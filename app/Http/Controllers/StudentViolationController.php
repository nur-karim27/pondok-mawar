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
        $query = Student::whereHas('violations');

        // Filter by gender
        if ($request->filled('gender') && $request->gender !== 'semua') {
            $query->where('gender', $request->gender);
        }

        // Filter by specific student
        if ($request->filled('student_id') && $request->student_id !== 'semua') {
            $query->where('id', $request->student_id);
        }

        $groupedStudents = $query->withSum('violations as total_points', 'points')
            ->withCount(['violations as unresolved_count' => function($q) {
                $q->where('is_resolved', false);
            }])
            ->orderByDesc('unresolved_count')
            ->orderByDesc('total_points')
            ->paginate(15)
            ->withQueryString();
            
        $students = Student::orderBy('name')->get(['id', 'name', 'nis', 'gender', 'photo']);

        return Inertia::render('Keamanan/Violations/Index', [
            'groupedStudents' => $groupedStudents,
            'students' => $students,
            'filters' => $request->only(['gender', 'student_id'])
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

    public function resolve(Request $request, StudentViolation $pelanggaran)
    {
        $request->validate([
            'punishment' => 'required|string|max:500'
        ]);

        $pelanggaran->update([
            'is_resolved' => true,
            'punishment' => $request->punishment
        ]);
        
        return redirect()->back()->with('success', 'Status pelanggaran berhasil diselesaikan dengan catatan kegiatan.');
    }

    public function resolveAll(Request $request)
    {
        $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'punishment'  => 'required|string|max:500'
        ]);

        StudentViolation::where('student_id', $request->student_id)
            ->where('is_resolved', false)
            ->update([
                'is_resolved' => true,
                'punishment'  => $request->punishment
            ]);

        return redirect()->back()->with('success', 'Semua pelanggaran berhasil diselesaikan.');
    }

    public function getStudentViolations($student_id)
    {
        $student = Student::findOrFail($student_id);
        $violations = StudentViolation::with('reporter')
            ->where('student_id', $student_id)
            ->orderBy('violation_date', 'desc')
            ->get();
            
        // Calculate total points
        $totalPoints = $violations->sum('points');
        
        return response()->json([
            'student' => $student,
            'violations' => $violations,
            'total_points' => $totalPoints
        ]);
    }

    public function export(Request $request)
    {
        $query = StudentViolation::with(['student', 'reporter'])->latest('violation_date');

        // Filter by gender
        if ($request->filled('gender') && $request->gender !== 'semua') {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('gender', $request->gender);
            });
        }

        // Filter by specific student — must be numeric
        $studentId = $request->input('student_id');
        if (!empty($studentId) && is_numeric($studentId)) {
            $query->where('student_id', (int) $studentId);
        }

        $violations = $query->get();

        // Build filename
        $studentName = '';
        if (!empty($studentId) && is_numeric($studentId) && $violations->isNotEmpty()) {
            $studentName = '_' . str_replace(' ', '_', strtolower($violations->first()->student->name));
        }
        $filename = "pelanggaran{$studentName}_" . date('Ymd_His') . ".csv";

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = ['No', 'NIS', 'Nama Santri', 'Jenis Kelamin', 'Pelanggaran', 'Kategori', 'Poin', 'Tanggal', 'Jam', 'Dilaporkan Oleh', 'Status', 'Kegiatan Penyelesaian'];

        $callback = function() use($violations, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            $i = 1;
            foreach ($violations as $v) {
                $status = $v->is_resolved ? 'Selesai' : 'Belum Selesai';
                fputcsv($file, [
                    $i++,
                    $v->student->nis,
                    $v->student->name,
                    ucfirst($v->student->gender),
                    $v->violation_name,
                    $v->category,
                    $v->points,
                    date('d/m/Y', strtotime($v->violation_date)),
                    date('H:i', strtotime($v->violation_date)),
                    $v->reporter ? $v->reporter->name : '-',
                    $status,
                    $v->punishment ?? '-'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
