<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentAchievement;
use App\Models\Student;

class StudentAchievementController extends Controller
{
    public function index()
    {
        $achievements = StudentAchievement::with('student')->latest()->paginate(10);
        $students = Student::where('status', 'aktif')->get(['id', 'name', 'nis']);

        return Inertia::render('Prestasi/Index', [
            'achievements' => $achievements,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'level' => 'required|string',
            'category' => 'required|string',
        ]);

        StudentAchievement::create($validated);

        return redirect()->back()->with('success', 'Data prestasi berhasil ditambahkan.');
    }

    public function update(Request $request, StudentAchievement $prestasi)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'level' => 'required|string',
            'category' => 'required|string',
        ]);

        $prestasi->update($validated);

        return redirect()->back()->with('success', 'Data prestasi berhasil diperbarui.');
    }

    public function destroy(StudentAchievement $prestasi)
    {
        $prestasi->delete();
        return redirect()->back()->with('success', 'Data prestasi berhasil dihapus.');
    }
}
