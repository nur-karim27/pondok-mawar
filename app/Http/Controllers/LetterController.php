<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class LetterController extends Controller
{
    public function index()
    {
        return Inertia::render('Placeholder', ['title' => 'Surat & Berkas', 'description' => 'Fitur ini sedang dalam tahap pengembangan dan akan segera hadir.']);
    }

    //
}
