<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AiController;
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
    Route::resource('kesantrian', \App\Http\Controllers\StudentController::class)->parameters([
        'kesantrian' => 'student'
    ]);
    Route::get('/asatidz', [\App\Http\Controllers\StaffController::class, 'index'])->name('staff.index');
    Route::get('/absensi', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('attendances.index');
    Route::get('/keuangan', [\App\Http\Controllers\PaymentController::class, 'index'])->name('payments.index');
    Route::get('/surat', [\App\Http\Controllers\LetterController::class, 'index'])->name('letters.index');
    Route::get('/pengumuman', [\App\Http\Controllers\AnnouncementController::class, 'index'])->name('announcements.index');

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
