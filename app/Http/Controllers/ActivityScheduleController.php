<?php

namespace App\Http\Controllers;

use App\Models\ActivitySchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityScheduleController extends Controller
{
    /**
     * Hanya Super Admin dan Kesantrian yang boleh akses manage.
     */
    private function authorizeManage(): void
    {
        $role = auth()->user()->role;
        if (!in_array($role, ['Super Admin', 'Kesantrian'])) {
            abort(403, 'Anda tidak memiliki izin untuk mengubah jadwal.');
        }
    }

    public function index()
    {
        $schedules = ActivitySchedule::orderBy('type')->orderBy('start_time')->get();
        return Inertia::render('Kesantrian/ActivitySchedules/Index', [
            'schedules' => $schedules
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'type'       => 'required|in:kegiatan,sekolah,madin', // Sholat Jamaah tidak bisa ditambah manual
            'name'       => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i',
            'is_active'  => 'boolean',
        ]);

        ActivitySchedule::create($validated);
        return back()->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function update(Request $request, ActivitySchedule $activitySchedule)
    {
        $this->authorizeManage();

        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i',
            'is_active'  => 'boolean',
        ]);

        $activitySchedule->update($validated);
        return back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(ActivitySchedule $activitySchedule)
    {
        $this->authorizeManage();

        // Sholat Jamaah tidak bisa dihapus
        if ($activitySchedule->type === 'sholat_jamaah') {
            return back()->with('error', 'Jadwal Sholat Jamaah tidak dapat dihapus, hanya bisa diedit.');
        }

        $activitySchedule->delete();
        return back()->with('success', 'Jadwal berhasil dihapus.');
    }
}
