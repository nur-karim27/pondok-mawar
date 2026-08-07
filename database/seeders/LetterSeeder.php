<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LetterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $types = ['masuk', 'keluar', 'keputusan', 'keterangan'];
        
        $user = \App\Models\User::where('role', 'Sekretaris')->first();
        if (!$user) {
            $user = \App\Models\User::first();
        }

        for ($i = 1; $i <= 5; $i++) {
            \App\Models\Letter::create([
                'code' => 'SM/00' . $i . '/III/2026',
                'type' => $types[array_rand($types)],
                'subject' => 'Surat Undangan Kegiatan ' . $i,
                'sender' => 'Instansi Luar',
                'recipient' => 'Pimpinan Pondok',
                'letter_date' => \Carbon\Carbon::now()->subDays(rand(1, 30))->format('Y-m-d'),
                'received_date' => \Carbon\Carbon::now()->subDays(rand(1, 10))->format('Y-m-d'),
                'body' => $faker->paragraph,
                'status' => 'selesai',
                'created_by' => $user->id,
            ]);
        }
    }
}
