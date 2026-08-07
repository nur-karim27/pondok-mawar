<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Room;
use App\Models\Guardian;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::with(['guardian', 'room.dormitory']);
        
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('nis', 'like', "%{$request->search}%");
        }
        
        $students = $query->latest()->paginate(10)->withQueryString();
        
        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search']),
            'rooms' => Room::with('dormitory')->get()->map(function($room) {
                return [
                    'id' => $room->id,
                    'name' => $room->dormitory->name . ' - ' . $room->name,
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
            'status' => 'required|in:aktif,izin,lulus,pindah,nonaktif',
            'room_id' => 'nullable|exists:rooms,id',
            'guardian_id' => 'nullable|exists:guardians,id',
        ]);

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
            'status' => 'required|in:aktif,izin,lulus,pindah,nonaktif',
            'room_id' => 'nullable|exists:rooms,id',
            'guardian_id' => 'nullable|exists:guardians,id',
        ]);

        $student->update($validated);

        return redirect()->back()->with('success', 'Data santri berhasil diperbarui.');
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return redirect()->back()->with('success', 'Data santri berhasil dihapus.');
    }
}
