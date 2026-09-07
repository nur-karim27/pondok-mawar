<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;
use App\Models\Activity;
use App\Models\PesantrenProfile;

class GuestController extends Controller
{
    public function tentangKami()
    {
        $pesantren = PesantrenProfile::first();
        return Inertia::render('Guest/TentangKami', [
            'pesantren' => $pesantren
        ]);
    }

    public function akademik()
    {
        $pesantren = PesantrenProfile::first();
        return Inertia::render('Guest/Akademik', [
            'pesantren' => $pesantren
        ]);
    }

    public function alumni()
    {
        $pesantren = PesantrenProfile::first();
        $kegiatan = Activity::latest()->paginate(10);
        
        return Inertia::render('Guest/Alumni', [
            'pesantren' => $pesantren,
            'kegiatan' => $kegiatan
        ]);
    }

    public function berita()
    {
        $pesantren = PesantrenProfile::first();
        $berita = Announcement::where('category', 'Informasi')->latest()->paginate(9);
        
        return Inertia::render('Guest/Berita', [
            'pesantren' => $pesantren,
            'berita' => $berita
        ]);
    }
}