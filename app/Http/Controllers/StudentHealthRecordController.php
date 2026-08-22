<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentHealthRecord;
use App\Models\Student;

class StudentHealthRecordController extends Controller
{
    public function index()
    {
        $records = StudentHealthRecord::with('student')->latest()->paginate(10);
        $students = Student::where('status', 'aktif')->get(['id', 'name', 'nis']);

        return Inertia::render('Kesehatan/Index', [
            'records' => $records,
            'students' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'complaint' => 'required|string|max:255',
            'diagnosis' => 'nullable|string|max:255',
            'treatment' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        StudentHealthRecord::create($validated);

        return redirect()->back()->with('success', 'Data kesehatan berhasil ditambahkan.');
    }

    public function update(Request $request, StudentHealthRecord $kesehatan)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'complaint' => 'required|string|max:255',
            'diagnosis' => 'nullable|string|max:255',
            'treatment' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $kesehatan->update($validated);

        return redirect()->back()->with('success', 'Data kesehatan berhasil diperbarui.');
    }

    public function destroy(StudentHealthRecord $kesehatan)
    {
        $kesehatan->delete();
        return redirect()->back()->with('success', 'Data kesehatan berhasil dihapus.');
    }
}
