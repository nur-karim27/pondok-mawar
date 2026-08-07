<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AiGenerationService;
use Inertia\Inertia;

class AiController extends Controller
{
    public function index()
    {
        return Inertia::render('AiAssistant/Index', [
            'history' => \App\Models\AiGeneration::where('user_id', auth()->id())->latest()->take(10)->get()
        ]);
    }

    public function generate(Request $request, AiGenerationService $aiService)
    {
        $request->validate([
            'feature' => 'required|in:surat,pengumuman,agenda,ringkasan',
            'prompt' => 'required|string|max:2000',
            'style' => 'nullable|string'
        ]);

        $fullPrompt = $request->prompt;
        if ($request->style) {
            $fullPrompt .= "\n\nGunakan gaya bahasa: " . $request->style;
        }

        $result = $aiService->generate($request->feature, $fullPrompt, auth()->id());

        if ($result['status'] === 'success') {
            return response()->json([
                'result' => $result['result'],
                'demo' => $result['demo']
            ]);
        }

        return response()->json([
            'error' => $result['message']
        ], 500);
    }
}
