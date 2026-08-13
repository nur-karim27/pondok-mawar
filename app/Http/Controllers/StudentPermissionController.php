<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentPermission;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class StudentPermissionController extends Controller
{
    public function index()
    {
        $permissions = StudentPermission::with('student')->latest()->paginate(50);
        $students = Student::select('id', 'name', 'nis')->get();

        return Inertia::render('Keamanan/Permissions/Index', [
            'permissions' => $permissions,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'permission_type' => 'required|string|max:50',
            'reason' => 'required|string',
            'leave_date' => 'required|date',
            'return_date' => 'nullable|date|after_or_equal:leave_date',
        ]);

        $validated['status'] = 'diajukan'; // Default status

        StudentPermission::create($validated);

        return redirect()->back()->with('success', 'Izin berhasil ditambahkan.');
    }

    public function update(Request $request, StudentPermission $perizinan)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'permission_type' => 'required|string|max:50',
            'reason' => 'required|string',
            'leave_date' => 'required|date',
            'return_date' => 'nullable|date|after_or_equal:leave_date',
        ]);

        $perizinan->update($validated);

        return redirect()->back()->with('success', 'Data izin berhasil diperbarui.');
    }

    public function updateStatus(Request $request, StudentPermission $perizinan)
    {
        $validated = $request->validate([
            'status' => 'required|in:disetujui,ditolak,selesai',
        ]);

        $perizinan->update([
            'status' => $validated['status'],
            'approved_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Status izin berhasil diperbarui.');
    }

    public function destroy(StudentPermission $perizinan)
    {
        $perizinan->delete();
        return redirect()->back()->with('success', 'Data izin berhasil dihapus.');
    }

    public function print(StudentPermission $perizinan)
    {
        $perizinan->load('student');
        return view('print.permission', compact('perizinan'));
    }
}
