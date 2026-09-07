<?php

namespace App\Http\Controllers;

use App\Models\StaffMember;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = StaffMember::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%')
                  ->orWhere('division', 'like', '%' . $request->search . '%')
                  ->orWhere('role', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('gender') && $request->gender !== 'all') {
            $query->where('gender', $request->gender);
        }

        $staff = $query->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('Asatidz/Index', [
            'staff'   => $staff,
            'filters' => $request->only(['search', 'gender']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'nip'       => 'nullable|string|unique:staff_members,nip',
            'gender'    => 'required|in:putra,putri',
            'role'      => 'required|string|max:255',
            'division'  => 'required|string|max:255',
            'phone'     => 'nullable|string|max:20',
            'email'     => 'nullable|email|max:255',
            'address'   => 'nullable|string',
            'join_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        StaffMember::create($validated);

        return redirect()->back()->with('success', 'Data asatidz berhasil ditambahkan.');
    }

    public function update(Request $request, StaffMember $staff)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'nip'       => 'nullable|string|unique:staff_members,nip,' . $staff->id,
            'gender'    => 'required|in:putra,putri',
            'role'      => 'required|string|max:255',
            'division'  => 'required|string|max:255',
            'phone'     => 'nullable|string|max:20',
            'email'     => 'nullable|email|max:255',
            'address'   => 'nullable|string',
            'join_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $staff->update($validated);

        return redirect()->back()->with('success', 'Data asatidz berhasil diperbarui.');
    }

    public function destroy(StaffMember $staff)
    {
        $staff->delete();
        return redirect()->back()->with('success', 'Data asatidz berhasil dihapus.');
    }

    public function export(Request $request)
    {
        $query = StaffMember::query();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('nip', 'like', '%' . $request->search . '%')
                  ->orWhere('division', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('gender') && $request->gender !== 'all') {
            $query->where('gender', $request->gender);
        }

        $records  = $query->orderBy('name')->get();
        $filename = 'data_asatidz_' . date('Ymd_His') . '.csv';

        $response = new StreamedResponse(function () use ($records) {
            $handle = fopen('php://output', 'w');
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF)); // BOM UTF-8
            fputcsv($handle, ['No', 'Nama', 'NIP', 'Jenis Kelamin', 'Jabatan', 'Divisi', 'Telepon', 'Email', 'Status', 'Tanggal Bergabung']);

            foreach ($records as $i => $row) {
                fputcsv($handle, [
                    $i + 1,
                    $row->name,
                    $row->nip ?? '-',
                    $row->gender === 'putra' ? 'Laki-laki' : 'Perempuan',
                    $row->role,
                    $row->division,
                    $row->phone ?? '-',
                    $row->email ?? '-',
                    $row->is_active ? 'Aktif' : 'Non-aktif',
                    $row->join_date ?? '-',
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

        return $response;
    }
}
