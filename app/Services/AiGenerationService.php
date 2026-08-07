<?php

namespace App\Services;

use App\Models\AiGeneration;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiGenerationService
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY', '');
        $this->model = env('OPENAI_MODEL', 'gpt-4o-mini');
    }

    public function generate(string $feature, string $prompt, int $userId): array
    {
        $systemPrompt = "Kamu adalah Asisten Pesantren untuk PondokKita. Tugasmu membantu pengurus pondok pesantren di Indonesia membuat draf administrasi yang formal, santun, mudah dipahami, sesuai adab Islam, dan tidak mengarang informasi penting. Gunakan bahasa Indonesia yang baik. Jika tanggal, nama, lokasi, atau pihak tujuan belum disebutkan, gunakan placeholder dalam tanda kurung siku, contohnya [Tanggal Kegiatan]. Jangan membuat klaim hukum, fatwa, atau informasi keagamaan yang tidak diminta. Akhiri surat resmi dengan penutup yang sesuai.";

        if (empty($this->apiKey)) {
            // Demo mode fallback
            $result = $this->getDemoTemplate($feature, $prompt);
            
            $aiGen = AiGeneration::create([
                'user_id' => $userId,
                'feature' => $feature,
                'prompt' => $prompt,
                'result' => $result,
                'status' => 'sukses',
            ]);

            return ['status' => 'success', 'result' => $result, 'demo' => true];
        }

        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(60)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $this->model,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.7,
                ]);

            if ($response->successful()) {
                $result = $response->json('choices.0.message.content');
                
                AiGeneration::create([
                    'user_id' => $userId,
                    'feature' => $feature,
                    'prompt' => $prompt,
                    'result' => $result,
                    'status' => 'sukses',
                ]);

                return ['status' => 'success', 'result' => $result, 'demo' => false];
            }

            Log::error('OpenAI API Error: ' . $response->body());
            throw new \Exception('Failed to get response from OpenAI');

        } catch (\Exception $e) {
            AiGeneration::create([
                'user_id' => $userId,
                'feature' => $feature,
                'prompt' => $prompt,
                'result' => null,
                'status' => 'gagal',
            ]);

            return ['status' => 'error', 'message' => 'Gagal menghasilkan teks: ' . $e->getMessage()];
        }
    }

    protected function getDemoTemplate(string $feature, string $prompt): string
    {
        return "[MODE DEMO - API Key belum diatur]\n\n" .
               "Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\n" .
               "Ini adalah draf contoh untuk fitur *" . ucfirst($feature) . "*. \n\n" .
               "Prompt Anda: \"" . $prompt . "\"\n\n" .
               "Silakan masukkan OPENAI_API_KEY di file .env untuk menggunakan fitur AI yang sebenarnya.\n\n" .
               "Wassalamu'alaikum Warahmatullahi Wabarakatuh.";
    }
}
