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
        $gender = $request->get('gender', 'semua');

        $query = Student::with(['room', 'muhafadzohs' => function($q) {
            $q->latest('date');
        }])->withCount('muhafadzohs');
        
        if ($gender !== 'semua') {
            $query->where('gender', $gender);
        }

        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nis', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('room_id') && $request->room_id != '') {
            $query->where('room_id', $request->room_id);
        }

        $studentsPaginated = $query->where('status', 'aktif')->orderBy('name', 'asc')->paginate(10)->withQueryString();
        
        $studentsQuery = Student::where('status', 'aktif');
        if ($gender !== 'semua') {
            $studentsQuery->where('gender', $gender);
        }
        $students = $studentsQuery->orderBy('name', 'asc')->get(['id', 'name', 'nis']);
        $rooms = \App\Models\Room::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Students/Muhafadzoh/Index', [
            'studentsPaginated' => $studentsPaginated,
            'students' => $students,
            'rooms' => $rooms,
            'filters' => $request->only('search', 'room_id'),
            'currentGender' => $gender
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'type' => 'required|string',
            'tester_name' => 'nullable|string',
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
            'tester_name' => 'nullable|string',
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

    public function exportRekapCsv(Request $request)
    {
        $gender = $request->get('gender', 'semua');
        $genderLabel = $gender === 'semua' ? 'SEMUA' : ($gender === 'putra' ? 'PUTRA' : 'PUTRI');
        
        $query = StudentMuhafadzoh::with(['student.room'])->latest('date');
        
        if ($gender !== 'semua') {
            $query->whereHas('student', function($q) use ($gender) {
                $q->where('gender', $gender);
            });
        }
        
        $records = $query->get();
        
        $filename = "Rekap_Evaluasi_Muhafadzoh_" . ucfirst(strtolower($genderLabel)) . "_" . date('Ymd_His') . ".csv";
        $pesantren = \App\Models\PesantrenProfile::first();

        $response = new StreamedResponse(function() use ($records, $pesantren, $genderLabel) {
            $handle = fopen('php://output', 'w');
            fputs($handle, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF))); // Add BOM
            
            fputcsv($handle, [$pesantren->name ?? 'Pondok Mawar']);
            fputcsv($handle, ['REKAPITULASI EVALUASI MUHAFADZOH (' . $genderLabel . ')']);
            fputcsv($handle, ['Dicetak pada: ' . date('d-m-Y H:i:s')]);
            fputcsv($handle, []);
            
            fputcsv($handle, ['No', 'NIS', 'Nama Santri', 'Kamar', 'Tanggal', 'Jenis', 'Penguji', 'Nama Hafalan', 'Target', 'Nilai', 'Catatan']);

            foreach ($records as $index => $row) {
                fputcsv($handle, [
                    $index + 1,
                    $row->student->nis ?? '-',
                    $row->student->name ?? '-',
                    $row->student->room->name ?? '-',
                    $row->date->format('d-m-Y'),
                    $row->type,
                    $row->tester_name ?? '-',
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
        $safeName = preg_replace('/[^A-Za-z0-9\-]/', '_', $student->name);
        $filename = "Riwayat_Muhafadzoh_" . $safeName . "_" . $student->nis . "_" . date('Ymd_His') . ".csv";
        $pesantren = \App\Models\PesantrenProfile::first();

        $response = new StreamedResponse(function() use ($records, $student, $pesantren) {
            $handle = fopen('php://output', 'w');
            fputs($handle, $bom =(chr(0xEF) . chr(0xBB) . chr(0xBF))); // Add BOM
            
            fputcsv($handle, [$pesantren->name ?? 'Pondok Mawar']);
            fputcsv($handle, ['RIWAYAT EVALUASI MUHAFADZOH SANTRI']);
            fputcsv($handle, ['NIS', ': ' . $student->nis]);
            fputcsv($handle, ['Nama', ': ' . $student->name]);
            fputcsv($handle, ['Dicetak pada', ': ' . date('d-m-Y H:i:s')]);
            fputcsv($handle, []);
            fputcsv($handle, ['No', 'Tanggal', 'Jenis', 'Penguji', 'Nama Hafalan', 'Target', 'Nilai', 'Catatan']);

            foreach ($records as $index => $row) {
                fputcsv($handle, [
                    $index + 1,
                    $row->date->format('d-m-Y'),
                    $row->type,
                    $row->tester_name ?? '-',
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
