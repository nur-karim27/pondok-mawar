<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentHealthRecord;
use App\Models\Student;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentHealthRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentHealthRecord::with('student');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('complaint', 'like', '%' . $request->search . '%')
                  ->orWhere('diagnosis', 'like', '%' . $request->search . '%')
                  ->orWhereHas('student', fn($s) => $s->where('name', 'like', '%' . $request->search . '%')
                                                       ->orWhere('nis', 'like', '%' . $request->search . '%'));
            });
        }

        $records  = $query->latest()->paginate(10)->withQueryString();
        $students = Student::where('status', 'aktif')->get(['id', 'name', 'nis']);

        return Inertia::render('Kesehatan/Index', [
            'records'  => $records,
            'students' => $students,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date'       => 'required|date',
            'complaint'  => 'required|string|max:255',
            'diagnosis'  => 'nullable|string|max:255',
            'treatment'  => 'nullable|string|max:255',
            'notes'      => 'nullable|string',
        ]);

        StudentHealthRecord::create($validated);

        return redirect()->back()->with('success', 'Data kesehatan berhasil ditambahkan.');
    }

    public function update(Request $request, StudentHealthRecord $kesehatan)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date'       => 'required|date',
            'complaint'  => 'required|string|max:255',
            'diagnosis'  => 'nullable|string|max:255',
            'treatment'  => 'nullable|string|max:255',
            'notes'      => 'nullable|string',
        ]);

        $kesehatan->update($validated);

        return redirect()->back()->with('success', 'Data kesehatan berhasil diperbarui.');
    }

    public function destroy(StudentHealthRecord $kesehatan)
    {
        $kesehatan->delete();
        return redirect()->back()->with('success', 'Data kesehatan berhasil dihapus.');
    }

    /**
     * Export rekap seluruh rekam kesehatan ke CSV
     */
    public function exportRekapCsv()
    {
        $records  = StudentHealthRecord::with('student')->latest('date')->get();
        $filename = 'rekap_kesehatan_' . date('Ymd_His') . '.csv';

        $response = new StreamedResponse(function () use ($records) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM UTF-8

            fputcsv($handle, ['No', 'NIS', 'Nama Santri', 'Tanggal', 'Keluhan', 'Diagnosis', 'Penanganan', 'Catatan']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->student->nis ?? '-',
                    $row->student->name ?? '-',
                    $row->date,
                    $row->complaint,
                    $row->diagnosis ?? '-',
                    $row->treatment ?? '-',
                    $row->notes ?? '-',
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }

    /**
     * Export riwayat kesehatan per santri ke CSV
     */
    public function exportCsv(Student $student)
    {
        $records  = StudentHealthRecord::where('student_id', $student->id)->latest('date')->get();
        $filename = 'kesehatan_' . $student->nis . '_' . date('Ymd_His') . '.csv';

        $response = new StreamedResponse(function () use ($records, $student) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, ['NIS: ' . $student->nis, 'Nama: ' . $student->name]);
            fputcsv($handle, []);
            fputcsv($handle, ['No', 'Tanggal', 'Keluhan', 'Diagnosis', 'Penanganan', 'Catatan']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->date,
                    $row->complaint,
                    $row->diagnosis ?? '-',
                    $row->treatment ?? '-',
                    $row->notes ?? '-',
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }
}
