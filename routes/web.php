<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\CanteenController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $pesantren       = \App\Models\PesantrenProfile::first();
    $informasi       = \App\Models\Announcement::where('audience', 'semua')->orderBy('created_at', 'desc')->take(3)->get();
    $kegiatan_alumni = \App\Models\Activity::orderBy('activity_date', 'desc')->take(4)->get();
    return Inertia::render('Welcome', [
        'canLogin'        => Route::has('login'),
        'pesantren'       => $pesantren,
        'informasi'       => $informasi,
        'kegiatan_alumni' => $kegiatan_alumni,
    ]);
});

// Public Guest Routes
Route::get('/tentang-kami', [\App\Http\Controllers\GuestController::class, 'tentangKami'])->name('guest.tentang-kami');
Route::get('/akademik',     [\App\Http\Controllers\GuestController::class, 'akademik'])->name('guest.akademik');
Route::get('/alumni',       [\App\Http\Controllers\GuestController::class, 'alumni'])->name('guest.alumni');
Route::get('/berita',       [\App\Http\Controllers\GuestController::class, 'berita'])->name('guest.berita');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/notifications/mark-read', function (Illuminate\Http\Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return back();
    })->name('notifications.markRead');

    Route::post('/notifications/update-prefs', function (Illuminate\Http\Request $request) {
        $data = $request->validate([
            'schedule_id' => 'required|exists:activity_schedules,id',
            'is_enabled' => 'required|boolean'
        ]);

        \App\Models\UserSchedulePref::updateOrCreate(
            ['user_id' => $request->user()->id, 'schedule_id' => $data['schedule_id']],
            ['is_enabled' => $data['is_enabled']]
        );

        return back();
    })->name('notifications.updatePrefs');

    Route::post('/notifications/billing-prefs', function (Illuminate\Http\Request $request) {
        $data = $request->validate(['receive_billing_notifications' => 'required|boolean']);
        $request->user()->update(['receive_billing_notifications' => $data['receive_billing_notifications']]);
        return back();
    })->name('notifications.billingPrefs');

    Route::post('/push/subscribe', function (Illuminate\Http\Request $request) {
        $request->user()->updatePushSubscription(
            $request->endpoint,
            $request->keys['p256dh'],
            $request->keys['auth']
        );
        return response()->json(['success' => true]);
    })->name('push.subscribe');

    Route::get('/notifications/poll', function (Illuminate\Http\Request $request) {
        $user = $request->user();
        if (!$user) return response()->json(['unread' => []]);
        $unread = $user->unreadNotifications()->latest()->take(10)->get();
        return response()->json(['unread' => $unread]);
    })->name('notifications.poll');

    // =========================================================
    // Modul Keamanan
    // =========================================================
    Route::get('/pelanggaran/export', [\App\Http\Controllers\StudentViolationController::class, 'export'])->name('pelanggaran.export');
    Route::get('/pelanggaran/santri/{student_id}', [\App\Http\Controllers\StudentViolationController::class, 'getStudentViolations'])->name('pelanggaran.santri');
    Route::post('/pelanggaran/resolve-all', [\App\Http\Controllers\StudentViolationController::class, 'resolveAll'])->name('pelanggaran.resolveAll');
    Route::resource('pelanggaran', \App\Http\Controllers\StudentViolationController::class);
    Route::post('/pelanggaran/{pelanggaran}/resolve', [\App\Http\Controllers\StudentViolationController::class, 'resolve'])->name('pelanggaran.resolve');

    // Perizinan
    Route::get('/perizinan/export', [\App\Http\Controllers\StudentPermissionController::class, 'export'])->name('perizinan.export');
    Route::resource('perizinan', \App\Http\Controllers\StudentPermissionController::class);
    Route::put('/perizinan/{perizinan}/status', [\App\Http\Controllers\StudentPermissionController::class, 'updateStatus'])->name('perizinan.status');
    Route::get('/perizinan/{perizinan}/cetak', [\App\Http\Controllers\StudentPermissionController::class, 'print'])->name('perizinan.print');

    // Absensi
    Route::get('/absensi/export', [\App\Http\Controllers\AttendanceController::class, 'export'])->name('attendances.export');
    Route::get('absensi/jamaah/scan',   [\App\Http\Controllers\AttendanceController::class, 'scan'])->name('attendances.jamaah.scan');
    Route::post('absensi/jamaah/scan',  [\App\Http\Controllers\AttendanceController::class, 'storeScan'])->name('attendances.jamaah.store');
    Route::resource('absensi', \App\Http\Controllers\AttendanceController::class)->names('attendances')->parameters(['absensi' => 'attendance']);

    // =========================================================
    // Modul Kesantrian
    // =========================================================
    Route::get('/kesantrian/export', [\App\Http\Controllers\StudentController::class, 'export'])->name('kesantrian.export');
    Route::resource('kesantrian', \App\Http\Controllers\StudentController::class)->parameters([
        'kesantrian' => 'student'
    ]);

    Route::resource('activity-schedules', \App\Http\Controllers\ActivityScheduleController::class)->except(['create', 'show', 'edit']);
    Route::post('/activity-schedules/{schedule}/notify', function (\App\Models\ActivitySchedule $schedule) {
        $users = \App\Models\User::where('role', '!=', 'Wali Santri')->get();
        \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\ActivityStartedNotification($schedule));
        return back()->with('success', "Notifikasi test untuk '{$schedule->name}' berhasil dikirim ke semua pengurus!");
    })->name('activity-schedules.notify');

    Route::post('/academic-histories', [\App\Http\Controllers\AcademicHistoryController::class, 'store'])->name('academic-histories.store');
    Route::put('/academic-histories/{id}', [\App\Http\Controllers\AcademicHistoryController::class, 'update'])->name('academic-histories.update');
    Route::delete('/academic-histories/{id}', [\App\Http\Controllers\AcademicHistoryController::class, 'destroy'])->name('academic-histories.destroy');

    // Evaluasi Muhafadzoh
    Route::get('/muhafadzoh/export-rekap',     [\App\Http\Controllers\StudentMuhafadzohController::class, 'exportRekapCsv'])->name('muhafadzoh.export-rekap');
    Route::get('/muhafadzoh/export/{student}', [\App\Http\Controllers\StudentMuhafadzohController::class, 'exportCsv'])->name('muhafadzoh.export');
    Route::resource('muhafadzoh', \App\Http\Controllers\StudentMuhafadzohController::class)->except(['create', 'show', 'edit']);

    // Prestasi Santri
    Route::get('/prestasi/export-rekap',     [\App\Http\Controllers\StudentAchievementController::class, 'exportRekapCsv'])->name('prestasi.export-rekap');
    Route::get('/prestasi/export/{student}', [\App\Http\Controllers\StudentAchievementController::class, 'exportCsv'])->name('prestasi.export');
    Route::resource('prestasi', \App\Http\Controllers\StudentAchievementController::class)->except(['create', 'show', 'edit']);

    // Kesehatan Santri
    Route::get('/kesehatan/export-rekap',     [\App\Http\Controllers\StudentHealthRecordController::class, 'exportRekapCsv'])->name('kesehatan.export-rekap');
    Route::get('/kesehatan/export/{student}', [\App\Http\Controllers\StudentHealthRecordController::class, 'exportCsv'])->name('kesehatan.export');
    Route::resource('kesehatan', \App\Http\Controllers\StudentHealthRecordController::class)->except(['create', 'show', 'edit']);

    // Monitoring Santri (Wali Santri)
    Route::get('/monitoring-santri',          [\App\Http\Controllers\MonitoringSantriController::class, 'index'])->name('monitoring-santri.index');
    Route::get('/monitoring-santri/{student}',[\App\Http\Controllers\MonitoringSantriController::class, 'show'])->name('monitoring-santri.show');

    // =========================================================
    // Modul Bendahara
    // =========================================================
    Route::get('/keuangan/export', [\App\Http\Controllers\PaymentController::class, 'export'])->name('payments.export');
    Route::post('/keuangan/midtrans-token', [\App\Http\Controllers\PaymentController::class, 'midtransToken'])->name('payments.midtransToken');
    Route::post('/keuangan/generate-monthly', [\App\Http\Controllers\PaymentController::class, 'generateMonthly'])->name('payments.generateMonthly');
    Route::resource('keuangan', \App\Http\Controllers\PaymentController::class)->names('payments')->parameters(['keuangan' => 'payment']);
    Route::get('/api/students/{student}/bills', [\App\Http\Controllers\PaymentController::class, 'getStudentBills'])->name('api.students.bills');

    // Tabungan Santri
    Route::get('tabungan/history',                     [\App\Http\Controllers\StudentSavingController::class, 'history'])->name('tabungan.history');
    Route::get('tabungan/export',                      [\App\Http\Controllers\StudentSavingController::class, 'export'])->name('tabungan.export');
    Route::get('tabungan/export-balances',             [\App\Http\Controllers\StudentSavingController::class, 'exportBalances'])->name('tabungan.export_balances');
    Route::get('tabungan/{student}/export-student',    [\App\Http\Controllers\StudentSavingController::class, 'exportStudent'])->name('tabungan.export_student');
    Route::resource('tabungan', \App\Http\Controllers\StudentSavingController::class)->names('tabungan')->parameters(['tabungan' => 'tabungan']);

    // Keuangan Kantin
    Route::get('/kantin',                              [CanteenController::class, 'index'])->name('kantin.index');
    Route::get('/kantin/history',                      [CanteenController::class, 'history'])->name('kantin.history');
    Route::get('/kantin/export',                       [CanteenController::class, 'export'])->name('kantin.export');
    Route::get('/kantin/export-balances',              [CanteenController::class, 'exportBalances'])->name('kantin.export_balances');
    Route::get('/kantin/settings',                     [CanteenController::class, 'settings'])->name('kantin.settings');
    Route::post('/kantin/settings',                    [CanteenController::class, 'storeSettings'])->name('kantin.settings.store');
    Route::delete('/kantin/settings/{kantin}',         [CanteenController::class, 'destroySettings'])->name('kantin.settings.destroy');
    Route::post('/kantin',                             [CanteenController::class, 'store'])->name('kantin.store');
    Route::put('/kantin/transactions/{transaction}',   [CanteenController::class, 'update'])->name('kantin.transactions.update');
    Route::get('/kantin/{kantin}/export',              [CanteenController::class, 'exportCanteen'])->name('kantin.export_canteen');
    Route::get('/kantin/{kantin}',                     [CanteenController::class, 'show'])->name('kantin.show');

    // =========================================================
    // Modul Lainnya
    // =========================================================

    // Asatidz / Staff
    Route::get('/staff/export', [\App\Http\Controllers\StaffController::class, 'export'])->name('staff.export');
    Route::resource('staff', \App\Http\Controllers\StaffController::class)->except(['create', 'show', 'edit']);

    // Surat & Berkas
    Route::get('/surat/export', [\App\Http\Controllers\LetterController::class, 'export'])->name('letters.export');
    Route::resource('surat', \App\Http\Controllers\LetterController::class)->names('letters')->parameters(['surat' => 'letter']);

    // Pengumuman
    Route::post('/pengumuman/update-phones', [\App\Http\Controllers\AnnouncementController::class, 'updatePhones'])->name('announcements.updatePhones');
    Route::resource('pengumuman', \App\Http\Controllers\AnnouncementController::class)->names('announcements')->parameters(['pengumuman' => 'announcement'])->except(['create', 'show', 'edit']);

    // Kegiatan Alumni / IKSAMA
    Route::resource('kegiatan', \App\Http\Controllers\ActivityController::class)->except(['create', 'show', 'edit']);

    // AI Assistant
    Route::get('/ai-assistant', [AiController::class, 'index'])->name('ai.index');
    Route::post('/api/ai/generate', [AiController::class, 'generate'])
        ->name('ai.generate')
        ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

    // Profile
    Route::get('/profile',    [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
