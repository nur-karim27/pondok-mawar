<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StudentPermission;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;

class StudentPermissionController extends Controller
{
    public function index(Request $request)
    {
        $query = StudentPermission::with('student')->latest();
        
        if ($request->has('gender') && $request->gender != 'semua') {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('gender', $request->gender);
            });
        }
        
        $permissions = $query->paginate(50)->withQueryString();
        $students = Student::select('id', 'name', 'nis', 'gender', 'photo')->get();

        return Inertia::render('Keamanan/Permissions/Index', [
            'permissions' => $permissions,
            'students' => $students,
            'filters' => $request->only(['gender']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'permission_type' => 'required|string|max:50',
            'reason' => 'required|string',
            'leave_date' => 'required|date',
            'return_date' => 'nullable|date|after_or_equal:leave_date',
        ]);

        $validated['status'] = 'diajukan'; // Default status

        StudentPermission::create($validated);

        return redirect()->back()->with('success', 'Izin berhasil ditambahkan.');
    }

    public function update(Request $request, StudentPermission $perizinan)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'permission_type' => 'required|string|max:50',
            'reason' => 'required|string',
            'leave_date' => 'required|date',
            'return_date' => 'nullable|date|after_or_equal:leave_date',
        ]);

        $perizinan->update($validated);

        return redirect()->back()->with('success', 'Data izin berhasil diperbarui.');
    }

    public function updateStatus(Request $request, StudentPermission $perizinan)
    {
        $validated = $request->validate([
            'status' => 'required|in:disetujui,ditolak,selesai',
        ]);

        $perizinan->update([
            'status' => $validated['status'],
            'approved_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Status izin berhasil diperbarui.');
    }

    public function destroy(StudentPermission $perizinan)
    {
        $perizinan->delete();
        return redirect()->back()->with('success', 'Data izin berhasil dihapus.');
    }

    public function print(StudentPermission $perizinan)
    {
        $perizinan->load('student');
        return view('print.permission', compact('perizinan'));
    }

    public function export(Request $request)
    {
        $query = StudentPermission::with('student')->latest();
        $genderLabel = 'Semua';

        if ($request->has('gender') && $request->gender != 'semua') {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('gender', $request->gender);
            });
            $genderLabel = ucfirst($request->gender);
        }

        $permissions = $query->get();
        $filename = "Export_Perizinan_{$genderLabel}_" . date('Y-m-d_H-i') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['No', 'NIS', 'Nama Santri', 'Jenis Kelamin', 'Jenis Izin', 'Tgl Keluar', 'Tgl Kembali', 'Alasan', 'Status', 'Keterangan Waktu'];

        $callback = function () use ($permissions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            $no = 1;
            foreach ($permissions as $p) {
                $statusWaktu = '-';
                if ($p->status == 'selesai') {
                    $statusWaktu = 'Selesai';
                } elseif ($p->status == 'disetujui' && $p->return_date && $p->return_date < now()) {
                    $statusWaktu = 'Terlambat';
                } elseif ($p->status == 'disetujui') {
                    $statusWaktu = 'Belum Kembali';
                } elseif ($p->status == 'ditolak') {
                    $statusWaktu = 'Ditolak';
                } else {
                    $statusWaktu = 'Menunggu';
                }

                $leaveDate = $p->leave_date ? \Carbon\Carbon::parse($p->leave_date)->format('d-m-Y H:i') : '-';
                $returnDate = $p->return_date ? \Carbon\Carbon::parse($p->return_date)->format('d-m-Y H:i') : '-';

                fputcsv($file, [
                    $no++,
                    $p->student->nis,
                    $p->student->name,
                    ucfirst($p->student->gender),
                    $p->permission_type,
                    $leaveDate,
                    $returnDate,
                    $p->reason,
                    ucfirst($p->status),
                    $statusWaktu
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
