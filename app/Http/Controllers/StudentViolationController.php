<?php

namespace App\Http\Controllers;

use App\Models\StudentViolation;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentViolationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $violations = StudentViolation::with(['student', 'reporter'])
            ->latest('violation_date')
            ->paginate(10);
            
        $students = Student::orderBy('name')->get(['id', 'name', 'nis']);

        return Inertia::render('Keamanan/Violations/Index', [
            'violations' => $violations,
            'students' => $students
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_name' => 'required|string|max:255',
            'category' => 'required|in:Ringan,Sedang,Berat,Sangat Berat',
            'points' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'violation_date' => 'required|date',
        ]);

        $validated['reported_by'] = auth()->id();
        $validated['is_resolved'] = false;

        StudentViolation::create($validated);

        return redirect()->back()->with('success', 'Pelanggaran berhasil dicatat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentViolation $studentViolation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentViolation $studentViolation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StudentViolation $pelanggaran)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'violation_name' => 'required|string|max:255',
            'category' => 'required|in:Ringan,Sedang,Berat,Sangat Berat',
            'points' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'violation_date' => 'required|date',
        ]);

        $pelanggaran->update($validated);

        return redirect()->back()->with('success', 'Data pelanggaran berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentViolation $pelanggaran)
    {
        $pelanggaran->delete();
        return redirect()->back()->with('success', 'Data pelanggaran berhasil dihapus.');
    }

    public function resolve(StudentViolation $pelanggaran)
    {
        $pelanggaran->update(['is_resolved' => true]);
        return redirect()->back()->with('success', 'Status pelanggaran berhasil diperbarui.');
    }
}
