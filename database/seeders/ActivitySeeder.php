<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $categories = ['Keilmuan', 'Kesantrian', 'Keasramaan', 'Keagamaan'];
        
        for ($i = 1; $i <= 5; $i++) {
            \App\Models\Activity::create([
                'title' => 'Kegiatan ' . $categories[array_rand($categories)] . ' ' . $i,
                'slug' => 'kegiatan-' . strtolower($categories[array_rand($categories)]) . '-' . $i,
                'category' => $categories[array_rand($categories)],
                'description' => $faker->paragraph,
                'activity_date' => \Carbon\Carbon::now()->addDays(rand(1, 14))->format('Y-m-d'),
                'start_time' => '08:00:00',
                'end_time' => '12:00:00',
                'location' => 'Aula Pondok',
                'participant_target' => 50,
                'status' => 'terjadwal',
            ]);
        }
    }
}
