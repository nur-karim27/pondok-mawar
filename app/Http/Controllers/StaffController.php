<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;

class StaffController extends Controller
{
    public function index()
    {
        return Inertia::render('Placeholder', ['title' => 'Asatidz', 'description' => 'Fitur ini sedang dalam tahap pengembangan dan akan segera hadir.']);
    }

    //
}
