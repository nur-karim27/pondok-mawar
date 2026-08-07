<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\StaffMember;
use App\Models\Activity;
use App\Models\Letter;
use App\Models\StudentPermission;
use App\Models\Payment;
use App\Models\Announcement;

class DashboardController extends Controller
{
    public function index()
    {
        $today = \Carbon\Carbon::today();

        return Inertia::render('Dashboard', [
            'stats' => [
                'students_count' => Student::where('status', 'aktif')->count(),
                'staff_count' => StaffMember::where('is_active', true)->count(),
                'activities_today' => Activity::whereDate('activity_date', $today)->count(),
                'letters_pending' => Letter::where('status', 'perlu_paraf')->count(),
                'active_permissions' => StudentPermission::where('status', 'disetujui')
                                        ->whereDate('leave_date', '<=', $today)
                                        ->where(function($q) use ($today) {
                                            $q->whereNull('return_date')
                                              ->orWhereDate('return_date', '>=', $today);
                                        })->count(),
                'payments_this_month' => Payment::whereMonth('payment_date', $today->month)
                                        ->whereYear('payment_date', $today->year)->sum('amount'),
            ],
            'upcoming_activities' => Activity::whereDate('activity_date', '>=', $today)
                                    ->orderBy('activity_date')
                                    ->take(5)->get(),
            'recent_letters' => Letter::latest()->take(5)->get(),
            'latest_announcements' => Announcement::latest()->take(3)->get(),
            'pesan_pimpinan' => Announcement::where('created_by', function($q) {
                $q->select('id')->from('users')->where('role', 'Pimpinan Pondok')->limit(1);
            })->latest()->first(),
        ]);
    }
}
