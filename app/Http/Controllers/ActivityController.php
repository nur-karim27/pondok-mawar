<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::query();

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $activities = $query->latest('activity_date')->paginate(12)->withQueryString();

        return Inertia::render('Kegiatan/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'activity_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'location' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,terjadwal,berlangsung,selesai,dibatalkan',
            'youtube_url' => 'nullable|url|max:255',
            'ig_url' => 'nullable|url|max:255',
            'fb_url' => 'nullable|url|max:255',
            'wa_url' => 'nullable|url|max:255',
            'wa_channel_url' => 'nullable|url|max:255',
            'cover_image' => 'nullable|image|max:2048',
            'video_file' => 'nullable|mimes:mp4,mov,ogg,qt|max:307200',
            'gallery_images.*' => 'nullable|image|max:2048'
        ], [
            'video_file.max' => 'Video terlalu besar, tolong untuk dikompres lagi (Maksimal 300 MB).'
        ]);

        $data = $request->except(['cover_image', 'video_file', 'gallery_images']);
        $data['slug'] = Str::slug($data['title']) . '-' . uniqid();
        
        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('activities/covers', 'public');
        }
        
        if ($request->hasFile('video_file')) {
            $data['video_path'] = $request->file('video_file')->store('activities/videos', 'public');
        }

        if ($request->hasFile('gallery_images')) {
            $paths = [];
            foreach ($request->file('gallery_images') as $file) {
                $paths[] = $file->store('activities/gallery', 'public');
            }
            $data['gallery_images'] = json_encode($paths);
        }

        Activity::create($data);

        return back()->with('success', 'Kegiatan berhasil ditambahkan');
    }

    public function update(Request $request, Activity $kegiatan)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'activity_date' => 'required|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'location' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|in:draft,terjadwal,berlangsung,selesai,dibatalkan',
            'youtube_url' => 'nullable|url|max:255',
            'ig_url' => 'nullable|url|max:255',
            'fb_url' => 'nullable|url|max:255',
            'wa_url' => 'nullable|url|max:255',
            'wa_channel_url' => 'nullable|url|max:255',
            'cover_image' => 'nullable|image|max:2048',
            'video_file' => 'nullable|mimes:mp4,mov,ogg,qt|max:307200',
            'gallery_images.*' => 'nullable|image|max:2048'
        ], [
            'video_file.max' => 'Video terlalu besar, tolong untuk dikompres lagi (Maksimal 300 MB).'
        ]);

        $data = $request->except(['cover_image', 'video_file', 'gallery_images']);
        
        if ($request->hasFile('cover_image')) {
            if ($kegiatan->cover_image) {
                Storage::disk('public')->delete($kegiatan->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('activities/covers', 'public');
        }
        
        if ($request->hasFile('video_file')) {
            if ($kegiatan->video_path) {
                Storage::disk('public')->delete($kegiatan->video_path);
            }
            $data['video_path'] = $request->file('video_file')->store('activities/videos', 'public');
        }

        // Simplification for gallery: appending or overwriting? We'll overwrite for now if provided
        if ($request->hasFile('gallery_images')) {
            if ($kegiatan->gallery_images) {
                $oldPaths = json_decode($kegiatan->gallery_images, true);
                if(is_array($oldPaths)) {
                    foreach($oldPaths as $path) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }
            $paths = [];
            foreach ($request->file('gallery_images') as $file) {
                $paths[] = $file->store('activities/gallery', 'public');
            }
            $data['gallery_images'] = json_encode($paths);
        }

        $kegiatan->update($data);

        return back()->with('success', 'Kegiatan berhasil diperbarui');
    }

    public function destroy(Activity $kegiatan)
    {
        if ($kegiatan->cover_image) {
            Storage::disk('public')->delete($kegiatan->cover_image);
        }
        if ($kegiatan->video_path) {
            Storage::disk('public')->delete($kegiatan->video_path);
        }
        if ($kegiatan->gallery_images) {
            $oldPaths = json_decode($kegiatan->gallery_images, true);
            if(is_array($oldPaths)) {
                foreach($oldPaths as $path) {
                    Storage::disk('public')->delete($path);
                }
            }
        }
        
        $kegiatan->delete();

        return back()->with('success', 'Kegiatan berhasil dihapus');
    }
}
