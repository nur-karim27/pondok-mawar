<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Room;
use App\Models\Guardian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['guardian', 'room.dormitory', 'academicHistories']);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->whereYear('enrollment_date', $request->search)
                  ->orWhere('graduation_year', $request->search)
                  ->orWhere('name', 'like', "%{$request->search}%")
                  ->orWhere('nis', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $gender = $request->input('gender', 'semua');
        if ($gender !== 'semua') {
            $query->where('gender', $gender);
        }
        
        $students = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();
        
        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'status', 'gender']),
            'dormitories' => \App\Models\Dormitory::all(),
            'rooms' => Room::with('dormitory')->get()->map(function($room) {
                return [
                    'id' => $room->id,
                    'name' => $room->name,
                    'dormitory_id' => $room->dormitory_id,
                ];
            }),
            'guardians' => Guardian::select('id', 'name', 'phone')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis',
            'nisn' => 'nullable|string|unique:students,nisn',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:putra,putri',
            'place_of_birth' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'enrollment_date' => 'required|date',
            'graduation_year' => 'nullable|string|max:4',
            'school_level' => 'nullable|string|max:255',
            'quran_level' => 'nullable|string|max:255',
            'history' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'status' => 'required|in:aktif,lulus,pindah,boyong',
            'room_id' => 'nullable|exists:rooms,id',
            'guardian_id' => 'nullable|exists:guardians,id',
            'academic_year' => 'nullable|string|max:255',
            'academic_status' => 'nullable|in:Naik Kelas,Tinggal Kelas,Lulus',
            'academic_notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        }

        // Auto create Wali Santri User account
        $user = User::create([
            'name' => $validated['name'],
            'email' => 'wali_' . time() . '@ponpesmawar.test',
            'password' => Hash::make('password'),
            'role' => 'Wali Santri',
            'is_active' => true,
        ]);

        $validated['user_id'] = $user->id;

        $academicData = [
            'academic_year' => $validated['academic_year'] ?? null,
            'academic_status' => $validated['academic_status'] ?? 'Naik Kelas',
            'academic_notes' => $validated['academic_notes'] ?? null,
        ];
        
        unset($validated['academic_year'], $validated['academic_status'], $validated['academic_notes']);

        $student = Student::create($validated);

        if ($request->filled('academic_year')) {
            \App\Models\AcademicHistory::create([
                'student_id' => $student->id,
                'academic_year' => $academicData['academic_year'],
                'school_level' => $validated['school_level'] ?? null,
                'quran_level' => $validated['quran_level'] ?? null,
                'status' => $academicData['academic_status'],
                'notes' => $academicData['academic_notes'],
            ]);
        }

        return redirect()->back()->with('success', 'Data santri berhasil ditambahkan.');
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nis' => 'required|string|unique:students,nis,' . $student->id,
            'nisn' => 'nullable|string|unique:students,nisn,' . $student->id,
            'name' => 'required|string|max:255',
            'gender' => 'required|in:putra,putri',
            'place_of_birth' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'phone' => 'nullable|string',
            'enrollment_date' => 'required|date',
            'graduation_year' => 'nullable|string|max:4',
            'school_level' => 'nullable|string|max:255',
            'quran_level' => 'nullable|string|max:255',
            'history' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'status' => 'required|in:aktif,lulus,pindah,boyong',
            'room_id' => 'nullable|exists:rooms,id',
            'guardian_id' => 'nullable|exists:guardians,id',
            'academic_year' => 'nullable|string|max:255',
            'academic_status' => 'nullable|in:Naik Kelas,Tinggal Kelas,Lulus',
            'academic_notes' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($student->photo) {
                Storage::disk('public')->delete($student->photo);
            }
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        } else {
            unset($validated['photo']);
        }

        $academicData = [
            'academic_year' => $validated['academic_year'] ?? null,
            'academic_status' => $validated['academic_status'] ?? 'Naik Kelas',
            'academic_notes' => $validated['academic_notes'] ?? null,
        ];
        
        unset($validated['academic_year'], $validated['academic_status'], $validated['academic_notes']);

        $student->update($validated);

        // Sync Wali Santri User name and access status
        if ($student->user_id) {
            $user = User::find($student->user_id);
            if ($user) {
                $user->update([
                    'name' => $student->name,
                    'is_active' => $validated['status'] === 'boyong' ? false : true
                ]);
            }
        }

        if ($request->filled('academic_year')) {
            \App\Models\AcademicHistory::create([
                'student_id' => $student->id,
                'academic_year' => $academicData['academic_year'],
                'school_level' => $validated['school_level'] ?? null,
                'quran_level' => $validated['quran_level'] ?? null,
                'status' => $academicData['academic_status'],
                'notes' => $academicData['academic_notes'],
            ]);
        }

        return redirect()->back()->with('success', 'Data santri berhasil diperbarui.');
    }

    public function destroy(Student $student)
    {
        // Delete photo from storage if exists
        if ($student->photo) {
            Storage::disk('public')->delete($student->photo);
        }

        // Delete associated Wali Santri User account
        if ($student->user_id) {
            User::where('id', $student->user_id)->delete();
        }

        $student->delete();
        return redirect()->back()->with('success', 'Data santri berhasil dihapus.');
    }

    public function export(Request $request)
    {
        $query = Student::with(['guardian', 'room.dormitory']);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->whereYear('enrollment_date', $request->search)
                  ->orWhere('graduation_year', $request->search)
                  ->orWhere('name', 'like', "%{$request->search}%")
                  ->orWhere('nis', 'like', "%{$request->search}%");
            });
        }
        
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $gender = $request->input('gender', 'semua');
        if ($gender !== 'semua') {
            $query->where('gender', $gender);
        }
        
        $students = $query->orderBy('name', 'asc')->get();

        $genderLabel = $gender !== 'semua' ? '_' . $gender : '';
        $filename = "data_santri" . $genderLabel . "_" . date('Ymd_His') . ".csv";

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('NIS', 'NISN', 'Nama Santri', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'No HP', 'Tahun Masuk', 'Tahun Lulus', 'Tingkat Sekolah', 'Tingkat Al-Quran', 'Status', 'Kamar', 'Nama Wali');

        $callback = function() use($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($students as $student) {
                fputcsv($file, array(
                    $student->nis,
                    $student->nisn,
                    $student->name,
                    ucfirst($student->gender),
                    $student->place_of_birth,
                    $student->birth_date,
                    $student->address,
                    $student->phone,
                    $student->enrollment_date,
                    $student->graduation_year,
                    $student->school_level,
                    $student->quran_level,
                    ucfirst($student->status),
                    $student->room ? $student->room->name : '-',
                    $student->guardian ? $student->guardian->name : '-'
                ));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
