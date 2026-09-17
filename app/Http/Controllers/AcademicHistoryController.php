<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\AcademicHistory;

class AcademicHistoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'academic_year' => 'required|string|max:255',
            'school_level' => 'nullable|string|max:255',
            'quran_level' => 'nullable|string|max:255',
            'status' => 'required|in:Naik Kelas,Tinggal Kelas,Lulus',
            'notes' => 'nullable|string',
        ]);

        AcademicHistory::create($validated);

        return redirect()->back()->with('success', 'Riwayat kenaikan kelas berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $history = AcademicHistory::findOrFail($id);

        $validated = $request->validate([
            'academic_year' => 'required|string|max:255',
            'school_level' => 'nullable|string|max:255',
            'quran_level' => 'nullable|string|max:255',
            'status' => 'required|in:Naik Kelas,Tinggal Kelas,Lulus',
            'notes' => 'nullable|string',
        ]);

        $history->update($validated);

        return redirect()->back()->with('success', 'Riwayat kenaikan kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $history = AcademicHistory::findOrFail($id);
        $history->delete();

        return redirect()->back()->with('success', 'Riwayat kenaikan kelas berhasil dihapus.');
    }
}
