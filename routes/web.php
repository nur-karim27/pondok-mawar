<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\CanteenController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $pesantren = \App\Models\PesantrenProfile::first();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'pesantren' => $pesantren
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Modules
    Route::resource('pelanggaran', \App\Http\Controllers\StudentViolationController::class);
    Route::post('/pelanggaran/{pelanggaran}/resolve', [\App\Http\Controllers\StudentViolationController::class, 'resolve'])->name('pelanggaran.resolve');
    
    // Perizinan
    Route::resource('perizinan', \App\Http\Controllers\StudentPermissionController::class);
    Route::put('/perizinan/{perizinan}/status', [\App\Http\Controllers\StudentPermissionController::class, 'updateStatus'])->name('perizinan.status');
    Route::get('/perizinan/{perizinan}/cetak', [\App\Http\Controllers\StudentPermissionController::class, 'print'])->name('perizinan.print');
    
    Route::resource('kesantrian', \App\Http\Controllers\StudentController::class)->parameters([
        'kesantrian' => 'student'
    ]);
    Route::get('/asatidz', [\App\Http\Controllers\StaffController::class, 'index'])->name('staff.index');
    // Absensi
    Route::resource('absensi', \App\Http\Controllers\AttendanceController::class)->names('attendances')->parameters(['absensi' => 'attendance']);
    
    // Keuangan (Bendahara)
    Route::resource('keuangan', \App\Http\Controllers\PaymentController::class)->names('payments')->parameters(['keuangan' => 'payment']);
    Route::get('/api/students/{student}/bills', [\App\Http\Controllers\PaymentController::class, 'getStudentBills'])->name('api.students.bills');
    
    // Tabungan Santri
    Route::get('tabungan/history', [\App\Http\Controllers\StudentSavingController::class, 'history'])->name('tabungan.history');
    Route::get('tabungan/export', [\App\Http\Controllers\StudentSavingController::class, 'export'])->name('tabungan.export');
    Route::get('tabungan/export-balances', [\App\Http\Controllers\StudentSavingController::class, 'exportBalances'])->name('tabungan.export_balances');
    Route::get('tabungan/{student}/export-student', [\App\Http\Controllers\StudentSavingController::class, 'exportStudent'])->name('tabungan.export_student');
    Route::resource('tabungan', \App\Http\Controllers\StudentSavingController::class)->names('tabungan')->parameters(['tabungan' => 'tabungan']);

    // Keuangan Kantin (Bendahara Kantin)
    Route::get('/kantin', [CanteenController::class, 'index'])->name('kantin.index');
    Route::get('/kantin/history', [CanteenController::class, 'history'])->name('kantin.history');
    Route::get('/kantin/export', [CanteenController::class, 'export'])->name('kantin.export');
    Route::get('/kantin/export-balances', [CanteenController::class, 'exportBalances'])->name('kantin.export_balances');
    Route::get('/kantin/settings', [CanteenController::class, 'settings'])->name('kantin.settings');
    Route::post('/kantin/settings', [CanteenController::class, 'storeSettings'])->name('kantin.settings.store');
    Route::delete('/kantin/settings/{kantin}', [CanteenController::class, 'destroySettings'])->name('kantin.settings.destroy');
    Route::post('/kantin', [CanteenController::class, 'store'])->name('kantin.store');
    Route::put('/kantin/transactions/{transaction}', [CanteenController::class, 'update'])->name('kantin.transactions.update');
    Route::get('/kantin/{kantin}/export', [CanteenController::class, 'exportCanteen'])->name('kantin.export_canteen');
    Route::get('/kantin/{kantin}', [CanteenController::class, 'show'])->name('kantin.show');

    Route::get('/surat', [\App\Http\Controllers\LetterController::class, 'index'])->name('letters.index');
    Route::get('/pengumuman', [\App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcements.index');

    // Monitoring Santri (Wali Santri)
    Route::get('/monitoring-santri', [\App\Http\Controllers\MonitoringSantriController::class, 'index'])->name('monitoring-santri.index');
    Route::get('/monitoring-santri/{student}', [\App\Http\Controllers\MonitoringSantriController::class, 'show'])->name('monitoring-santri.show');

    // Kesehatan & Prestasi (Kesantrian/Admin)
    Route::resource('prestasi', \App\Http\Controllers\StudentAchievementController::class)->except(['create', 'show', 'edit']);
    Route::resource('kesehatan', \App\Http\Controllers\StudentHealthRecordController::class)->except(['create', 'show', 'edit']);

    // AI Assistant
    Route::get('/ai-assistant', [AiController::class, 'index'])->name('ai.index');
    Route::post('/api/ai/generate', [AiController::class, 'generate'])
        ->name('ai.generate')
        ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
