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
        $gender = $request->query('gender', 'semua');
        
        $query = Student::with(['room', 'healthRecords' => function($q) {
            $q->latest('date');
        }])->withCount('healthRecords');
        
        if ($gender !== 'semua') {
            $query->where('gender', $gender);
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
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

        return Inertia::render('Kesehatan/Index', [
            'studentsPaginated' => $studentsPaginated,
            'students'     => $students,
            'rooms'        => $rooms,
            'filters'      => $request->only(['search', 'room_id']),
            'currentGender'=> $gender
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
    public function exportRekapCsv(Request $request)
    {
        $gender = $request->query('gender', 'semua');
        $genderLabel = $gender === 'semua' ? 'SEMUA' : strtoupper($gender);
        
        $query = StudentHealthRecord::with(['student.room'])->latest('date');
        
        if ($gender !== 'semua') {
            $query->whereHas('student', function($q) use ($gender) {
                $q->where('gender', $gender);
            });
        }
        
        $records = $query->get();
        $filename = "Rekap_Kesehatan_Santri_" . ucfirst(strtolower($genderLabel)) . "_" . date('Ymd_His') . ".csv";
        $pesantren = \App\Models\PesantrenProfile::first();

        $response = new StreamedResponse(function () use ($records, $pesantren, $genderLabel) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM UTF-8

            fputcsv($handle, [$pesantren->name ?? 'Pondok Mawar']);
            fputcsv($handle, ['REKAPITULASI KESEHATAN SANTRI (' . $genderLabel . ')']);
            fputcsv($handle, ['Dicetak pada: ' . date('d-m-Y H:i:s')]);
            fputcsv($handle, []);

            fputcsv($handle, ['No', 'NIS', 'Nama Santri', 'Kamar', 'Tanggal', 'Keluhan', 'Diagnosis', 'Penanganan', 'Catatan']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->student->nis ?? '-',
                    $row->student->name ?? '-',
                    $row->student->room->name ?? '-',
                    \Carbon\Carbon::parse($row->date)->format('d-m-Y'),
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
        $safeName = preg_replace('/[^A-Za-z0-9\-]/', '_', $student->name);
        $filename = "Riwayat_Kesehatan_" . $safeName . "_" . $student->nis . "_" . date('Ymd_His') . ".csv";
        $pesantren = \App\Models\PesantrenProfile::first();

        $response = new StreamedResponse(function () use ($records, $student, $pesantren) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [$pesantren->name ?? 'Pondok Mawar']);
            fputcsv($handle, ['RIWAYAT KESEHATAN SANTRI']);
            fputcsv($handle, ['NIS', ': ' . $student->nis]);
            fputcsv($handle, ['Nama', ': ' . $student->name]);
            fputcsv($handle, ['Dicetak pada', ': ' . date('d-m-Y H:i:s')]);
            fputcsv($handle, []);
            fputcsv($handle, ['No', 'Tanggal', 'Keluhan', 'Diagnosis', 'Penanganan', 'Catatan']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    \Carbon\Carbon::parse($row->date)->format('d-m-Y'),
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
