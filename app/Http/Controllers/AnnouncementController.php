<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $query = Announcement::with('createdBy')->orderByDesc('is_pinned')->latest();

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('body', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('audience', $request->category);
        }

        $announcements = $query->paginate(9)->withQueryString();
        $user          = Auth::user();

        // Ambil semua user yang memiliki role admin/pengurus untuk notifikasi WA
        $notifUsers = User::whereIn('role', ['Super Admin', 'Keamanan', 'Kesantrian', 'Bendahara'])
            ->where('is_active', true)
            ->get(['id', 'name', 'role', 'phone']);

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters'       => $request->only(['search', 'category']),
            'isSuperAdmin'  => $user->role === 'Super Admin',
            'notifUsers'    => $notifUsers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'body'         => 'required|string',
            'audience'     => 'required|in:semua,santri,wali_santri,pengurus,asatidz,putra,putri',
            'published_at' => 'nullable|date',
            'expires_at'   => 'nullable|date|after_or_equal:published_at',
            'is_pinned'    => 'boolean',
        ]);

        $validated['slug']       = Str::slug($validated['title']) . '-' . uniqid();
        $validated['created_by'] = Auth::id();

        if (empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Announcement::create($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'body'         => 'required|string',
            'audience'     => 'required|in:semua,santri,wali_santri,pengurus,asatidz,putra,putri',
            'published_at' => 'nullable|date',
            'expires_at'   => 'nullable|date',
            'is_pinned'    => 'boolean',
        ]);

        $announcement->update($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus.');
    }

    /**
     * Update nomor WhatsApp notifikasi untuk setiap user pengurus
     */
    public function updatePhones(Request $request)
    {
        $request->validate([
            'users'          => 'required|array',
            'users.*.id'     => 'required|exists:users,id',
            'users.*.phone'  => 'nullable|string|max:500',
        ]);

        foreach ($request->users as $item) {
            User::where('id', $item['id'])->update(['phone' => $item['phone'] ?? null]);
        }

        return redirect()->back()->with('success', 'Nomor WhatsApp notifikasi berhasil diperbarui.');
    }
}
