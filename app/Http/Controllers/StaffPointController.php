<?php

namespace App\Http\Controllers;

use App\Models\StaffPoint;
use Illuminate\Http\Request;

class StaffPointController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'staff_member_id' => 'required|exists:staff_members,id',
            'point_name' => 'required|string|max:255',
            'category' => 'required|in:Penghargaan,Pelanggaran,Lainnya',
            'points' => 'required|integer', // e.g. +10 for penghargaan, -5 for pelanggaran
            'description' => 'nullable|string',
            'record_date' => 'required|date',
        ]);

        $validated['reported_by'] = auth()->id();

        StaffPoint::create($validated);

        return redirect()->back()->with('success', 'Catatan poin Asatidz berhasil ditambahkan.');
    }

    public function update(Request $request, StaffPoint $staffPoint)
    {
        $validated = $request->validate([
            'point_name' => 'required|string|max:255',
            'category' => 'required|in:Penghargaan,Pelanggaran,Lainnya',
            'points' => 'required|integer',
            'description' => 'nullable|string',
            'record_date' => 'required|date',
        ]);

        $staffPoint->update($validated);

        return redirect()->back()->with('success', 'Catatan poin Asatidz berhasil diperbarui.');
    }

    public function destroy(StaffPoint $staffPoint)
    {
        $staffPoint->delete();

        return redirect()->back()->with('success', 'Catatan poin Asatidz berhasil dihapus.');
    }
}