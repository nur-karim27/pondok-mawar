<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class MonitoringSantriController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['Wali Santri', 'Super Admin', 'Admin', 'Kesantrian'])) {
            abort(403, 'Unauthorized action.');
        }

        if ($user->role === 'Wali Santri') {
            $student = Student::with(['achievements', 'healthRecords', 'violations', 'room', 'guardian'])
                ->where('user_id', $user->id)->first();
            
            if (!$student) {
                abort(404, 'Student data not found.');
            }

            return Inertia::render('WaliSantri/Monitoring/Index', [
                'student' => $student,
            ]);
        } else {
            // For admins, return a list of students (all status) ordered by name
            $studentsQuery = Student::with(['room', 'guardian']);
            
            if ($request->search) {
                // The user wants to search by year or name
                $studentsQuery->where(function ($query) use ($request) {
                    $query->whereYear('enrollment_date', $request->search)
                          ->orWhere('graduation_year', $request->search)
                          ->orWhere('name', 'like', "%{$request->search}%")
                          ->orWhere('nis', 'like', "%{$request->search}%");
                });
            }

            if ($request->status) {
                $studentsQuery->where('status', $request->status);
            }

            // Always order by name A-Z
            $studentsQuery->orderBy('name', 'asc');
            
            $students = $studentsQuery->paginate(12)->withQueryString();
            
            return Inertia::render('WaliSantri/Monitoring/StudentList', [
                'students' => $students,
                'filters' => $request->only(['search', 'status']),
            ]);
        }
    }

    public function show($id)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['Super Admin', 'Admin', 'Kesantrian'])) {
            abort(403, 'Unauthorized action.');
        }

        $student = Student::with(['achievements', 'healthRecords', 'violations', 'room', 'guardian'])
            ->findOrFail($id);

        return Inertia::render('WaliSantri/Monitoring/Index', [
            'student' => $student,
        ]);
    }
}
