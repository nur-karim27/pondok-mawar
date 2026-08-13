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

        if ($request->filled('date') && $request->date != 'all') {
            $query->whereDate('date', $request->date);
        }

        if ($request->filled('type') && $request->type != 'all') {
            $query->where('type', $request->type);
        }

        $attendances = $query->latest()->paginate(50)->withQueryString();
        $students = Student::select('id', 'name', 'nis')->get();

        return Inertia::render('Keamanan/Attendances/Index', [
            'attendances' => $attendances,
            'students' => $students,
            'filters' => [
                'date' => $request->date ?? '',
                'type' => $request->type ?? 'all',
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'type' => 'required|in:sekolah,ngaji,kegiatan,asrama',
            'status' => 'required|in:hadir,izin,sakit,alpa,terlambat',
            'notes' => 'nullable|string'
        ]);

        $validated['recorded_by'] = Auth::id();

        Attendance::create($validated);

        return redirect()->back()->with('success', 'Data absensi berhasil ditambahkan.');
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'status' => 'required|in:hadir,izin,sakit,alpa,terlambat',
            'notes' => 'nullable|string'
        ]);

        $attendance->update($validated);

        return redirect()->back()->with('success', 'Data absensi berhasil diperbarui.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->back()->with('success', 'Data absensi berhasil dihapus.');
    }
}
