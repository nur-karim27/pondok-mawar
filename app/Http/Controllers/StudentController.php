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
        
        $students = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();
        
        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'status']),
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
            'status' => 'required|in:aktif,izin,lulus,pindah,nonaktif',
            'room_id' => 'nullable|exists:rooms,id',
            'guardian_id' => 'nullable|exists:guardians,id',
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

        Student::create($validated);

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
            'status' => 'required|in:aktif,izin,lulus,pindah,nonaktif',
            'room_id' => 'nullable|exists:rooms,id',
            'guardian_id' => 'nullable|exists:guardians,id',
        ]);

        if ($request->hasFile('photo')) {
            if ($student->photo) {
                Storage::disk('public')->delete($student->photo);
            }
            $validated['photo'] = $request->file('photo')->store('students', 'public');
        }

        $student->update($validated);

        // Sync Wali Santri User name if user_id exists
        if ($student->user_id) {
            $user = User::find($student->user_id);
            if ($user && $user->name !== $student->name) {
                $user->update(['name' => $student->name]);
            }
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
}
