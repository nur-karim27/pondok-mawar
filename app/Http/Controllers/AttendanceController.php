<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('student')->orderBy('date', 'desc')->orderBy('time', 'desc');

        if ($request->has('gender') && $request->gender != 'semua') {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('gender', $request->gender);
            });
        }

        if ($request->filled('date') && $request->date != 'all') {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('type') && $request->type != 'all') {
            $query->where('type', $request->type);
        }

        $attendances = $query->latest()->paginate(50)->withQueryString();
        $students = Student::select('id', 'name', 'nis', 'gender', 'photo')->get();

        return Inertia::render('Keamanan/Attendances/Index', [
            'attendances' => $attendances,
            'students'    => $students,
            'filters'     => [
                'date'   => $request->date ?? '',
                'type'   => $request->type ?? 'all',
                'gender' => $request->gender ?? 'semua',
            ]
        ]);
    }

    public function scan()
    {
        $students = Student::where('status', 'aktif')->select('id', 'name', 'nis')->get();
        return Inertia::render('Keamanan/Attendances/JamaahScan', [
            'students' => $students,
        ]);
    }

    public function storeScan(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date'       => 'required|date',
            'time'       => 'required|date_format:H:i',
            'type'       => 'required|string|max:100',
            'status'     => 'required|in:hadir,izin,sakit,alpa,terlambat',
            'notes'      => 'nullable|string',
            'points'     => 'nullable|integer|min:0',
        ]);

        $validated['recorded_by'] = Auth::id();

        Attendance::create([
            'student_id' => $validated['student_id'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'type' => $validated['type'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'recorded_by' => $validated['recorded_by'],
        ]);

        if (in_array($validated['status'], ['alpa', 'terlambat']) && !empty($validated['points']) && $validated['points'] > 0) {
            \App\Models\StudentViolation::create([
                'student_id' => $validated['student_id'],
                'violation_name' => 'Absensi ' . ucfirst($validated['status']) . ' (' . $validated['type'] . ')',
                'category' => 'Ringan',
                'points' => $validated['points'],
                'description' => $validated['notes'] ?? 'Dibuat otomatis dari sistem absensi jamaah/scan.',
                'violation_date' => $validated['date'] . ' ' . $validated['time'] . ':00',
                'reported_by' => Auth::id(),
                'is_resolved' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Absensi berhasil dicatat.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date'       => 'required|date',
            'time'       => 'required|date_format:H:i',
            'type'       => 'required|string|max:100',
            'status'     => 'required|in:hadir,izin,sakit,alpa,terlambat',
            'notes'      => 'nullable|string',
            'points'     => 'nullable|integer|min:0',
        ]);

        $validated['recorded_by'] = Auth::id();

        $attendance = Attendance::create([
            'student_id' => $validated['student_id'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'type' => $validated['type'],
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'recorded_by' => $validated['recorded_by'],
        ]);

        if (in_array($validated['status'], ['alpa', 'terlambat']) && !empty($validated['points']) && $validated['points'] > 0) {
            \App\Models\StudentViolation::create([
                'student_id' => $validated['student_id'],
                'violation_name' => 'Absensi ' . ucfirst($validated['status']) . ' (' . $validated['type'] . ')',
                'category' => 'Ringan',
                'points' => $validated['points'],
                'description' => $validated['notes'] ?? 'Dibuat otomatis dari input absensi.',
                'violation_date' => $validated['date'] . ' ' . $validated['time'] . ':00',
                'reported_by' => Auth::id(),
                'is_resolved' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Data absensi berhasil ditambahkan.');
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'status' => 'required|in:hadir,izin,sakit,alpa,terlambat',
            'notes'  => 'nullable|string',
            'points' => 'nullable|integer|min:0',
        ]);

        $attendance->update([
            'status' => $validated['status'],
            'notes'  => $validated['notes'],
        ]);

        if (in_array($validated['status'], ['alpa', 'terlambat']) && !empty($validated['points']) && $validated['points'] > 0) {
            \App\Models\StudentViolation::create([
                'student_id' => $attendance->student_id,
                'violation_name' => 'Absensi ' . ucfirst($validated['status']) . ' (' . $attendance->type . ')',
                'category' => 'Ringan',
                'points' => $validated['points'],
                'description' => $validated['notes'] ?? 'Dibuat otomatis saat update absensi.',
                'violation_date' => $attendance->date . ' ' . $attendance->time . ':00',
                'reported_by' => Auth::id(),
                'is_resolved' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Data absensi berhasil diperbarui.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->back()->with('success', 'Data absensi berhasil dihapus.');
    }

    public function export(Request $request)
    {
        $query = Attendance::with('student')->orderBy('date', 'desc')->orderBy('time', 'desc');
        $genderLabel = 'Semua';

        if ($request->has('gender') && $request->gender != 'semua') {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('gender', $request->gender);
            });
            $genderLabel = ucfirst($request->gender);
        }
        
        if ($request->filled('date') && $request->date != 'all') {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('type') && $request->type != 'all') {
            $query->where('type', $request->type);
        }

        $attendances = $query->get();
        $filename = "Export_Absensi_{$genderLabel}_" . date('Y-m-d_H-i') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['No', 'NIS', 'Nama Santri', 'Jenis Kelamin', 'Tanggal', 'Jam', 'Jenis Absensi', 'Status', 'Keterangan'];

        $callback = function () use ($attendances, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            $no = 1;
            foreach ($attendances as $a) {
                $dateFormatted = \Carbon\Carbon::parse($a->date)->format('d-m-Y');
                fputcsv($file, [
                    $no++,
                    $a->student->nis,
                    $a->student->name,
                    ucfirst($a->student->gender),
                    $dateFormatted,
                    $a->time ? \Carbon\Carbon::parse($a->time)->format('H:i') : '-',
                    ucfirst($a->type),
                    ucfirst($a->status),
                    $a->notes ?? '-'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
