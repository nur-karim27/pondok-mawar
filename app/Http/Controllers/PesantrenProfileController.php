<?php

namespace App\Http\Controllers;

use App\Models\PesantrenProfile;
use Illuminate\Http\Request;

class PesantrenProfileController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'vision' => 'required|string',
            'mission' => 'required|string',
        ]);

        $profile = PesantrenProfile::first();
        if (!$profile) {
            $profile = new PesantrenProfile();
        }

        $profile->vision = $validated['vision'];
        $profile->mission = $validated['mission'];
        $profile->save();

        return redirect()->back()->with('success', 'Profil Pesantren berhasil diperbarui.');
    }
}
