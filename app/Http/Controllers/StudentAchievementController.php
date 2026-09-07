<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentAchievement;
use App\Models\Student;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StudentAchievementController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentAchievement::with('student');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('student', fn($s) => $s->where('name', 'like', '%' . $request->search . '%')
                                                       ->orWhere('nis', 'like', '%' . $request->search . '%'));
            });
        }

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $achievements = $query->latest()->paginate(10)->withQueryString();
        $students     = Student::where('status', 'aktif')->get(['id', 'name', 'nis']);

        return Inertia::render('Prestasi/Index', [
            'achievements' => $achievements,
            'students'     => $students,
            'filters'      => $request->only(['search', 'level', 'category']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id'  => 'required|exists:students,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'level'       => 'required|string',
            'category'    => 'required|string',
        ]);

        StudentAchievement::create($validated);

        return redirect()->back()->with('success', 'Data prestasi berhasil ditambahkan.');
    }

    public function update(Request $request, StudentAchievement $prestasi)
    {
        $validated = $request->validate([
            'student_id'  => 'required|exists:students,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'date'        => 'required|date',
            'level'       => 'required|string',
            'category'    => 'required|string',
        ]);

        $prestasi->update($validated);

        return redirect()->back()->with('success', 'Data prestasi berhasil diperbarui.');
    }

    public function destroy(StudentAchievement $prestasi)
    {
        $prestasi->delete();
        return redirect()->back()->with('success', 'Data prestasi berhasil dihapus.');
    }

    /**
     * Export rekap seluruh prestasi santri ke CSV
     */
    public function exportRekapCsv(Request $request)
    {
        $records  = StudentAchievement::with('student')->latest('date')->get();
        $filename = 'rekap_prestasi_' . date('Ymd_His') . '.csv';

        $response = new StreamedResponse(function () use ($records) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM UTF-8

            fputcsv($handle, ['No', 'NIS', 'Nama Santri', 'Judul Prestasi', 'Kategori', 'Tingkat', 'Tanggal', 'Keterangan']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->student->nis ?? '-',
                    $row->student->name ?? '-',
                    $row->title,
                    $row->category,
                    $row->level,
                    $row->date,
                    $row->description ?? '-',
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }

    /**
     * Export riwayat prestasi per santri ke CSV
     */
    public function exportCsv(Student $student)
    {
        $records  = StudentAchievement::where('student_id', $student->id)->latest('date')->get();
        $filename = 'prestasi_' . $student->nis . '_' . date('Ymd_His') . '.csv';

        $response = new StreamedResponse(function () use ($records, $student) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, ['NIS: ' . $student->nis, 'Nama: ' . $student->name]);
            fputcsv($handle, []);
            fputcsv($handle, ['No', 'Judul Prestasi', 'Kategori', 'Tingkat', 'Tanggal', 'Keterangan']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->title,
                    $row->category,
                    $row->level,
                    $row->date,
                    $row->description ?? '-',
                ]);
            }
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }
}
