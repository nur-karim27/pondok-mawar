<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentMuhafadzoh;
use App\Models\Student;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentMuhafadzohController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['room', 'muhafadzohs' => function($q) {
            $q->latest('date');
        }])->withCount('muhafadzohs');

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }

        $studentsPaginated = $query->where('status', 'aktif')->latest()->paginate(10)->withQueryString();
        $students = Student::where('status', 'aktif')->get(['id', 'name', 'nis']);

        return Inertia::render('Students/Muhafadzoh/Index', [
            'studentsPaginated' => $studentsPaginated,
            'students' => $students,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'type' => 'required|string',
            'memorization_name' => 'required|string',
            'target' => 'nullable|string',
            'grade' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        StudentMuhafadzoh::create($validated);

        return redirect()->back()->with('success', 'Data Evaluasi Muhafadzoh berhasil ditambahkan.');
    }

    public function update(Request $request, StudentMuhafadzoh $muhafadzoh)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'type' => 'required|string',
            'memorization_name' => 'required|string',
            'target' => 'nullable|string',
            'grade' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $muhafadzoh->update($validated);

        return redirect()->back()->with('success', 'Data Evaluasi Muhafadzoh berhasil diperbarui.');
    }

    public function destroy(StudentMuhafadzoh $muhafadzoh)
    {
        $muhafadzoh->delete();
        return redirect()->back()->with('success', 'Data Evaluasi Muhafadzoh berhasil dihapus.');
    }

    public function exportRekapCsv()
    {
        $records = StudentMuhafadzoh::with('student')->latest('date')->get();
        $filename = "rekap_muhafadzoh_" . date('Ymd_His') . ".csv";

        $response = new StreamedResponse(function() use ($records) {
            $handle = fopen('php://output', 'w');
            fputs($handle, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF))); // Add BOM
            
            fputcsv($handle, ['No', 'NIS', 'Nama Santri', 'Tanggal', 'Jenis', 'Nama Hafalan', 'Target', 'Nilai', 'Catatan']);

            foreach ($records as $index => $row) {
                fputcsv($handle, [
                    $index + 1,
                    $row->student->nis ?? '-',
                    $row->student->name ?? '-',
                    $row->date->format('Y-m-d'),
                    $row->type,
                    $row->memorization_name,
                    $row->target,
                    $row->grade,
                    $row->notes
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');
        return $response;
    }

    public function exportCsv(Student $student)
    {
        $records = StudentMuhafadzoh::where('student_id', $student->id)->latest('date')->get();
        $filename = "riwayat_muhafadzoh_" . $student->nis . "_" . date('Ymd_His') . ".csv";

        $response = new StreamedResponse(function() use ($records, $student) {
            $handle = fopen('php://output', 'w');
            fputs($handle, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF))); // Add BOM
            
            fputcsv($handle, ['NIS: ' . $student->nis, 'Nama: ' . $student->name]);
            fputcsv($handle, []);
            fputcsv($handle, ['No', 'Tanggal', 'Jenis', 'Nama Hafalan', 'Target', 'Nilai', 'Catatan']);

            foreach ($records as $index => $row) {
                fputcsv($handle, [
                    $index + 1,
                    $row->date->format('Y-m-d'),
                    $row->type,
                    $row->memorization_name,
                    $row->target,
                    $row->grade,
                    $row->notes
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');
        return $response;
    }
}
