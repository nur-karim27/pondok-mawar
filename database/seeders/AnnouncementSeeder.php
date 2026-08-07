<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $user = \App\Models\User::first();

        for ($i = 1; $i <= 5; $i++) {
            \App\Models\Announcement::create([
                'title' => 'Pengumuman Penting ' . $i,
                'slug' => 'pengumuman-penting-' . $i,
                'body' => $faker->paragraph,
                'audience' => 'semua',
                'published_at' => \Carbon\Carbon::now()->subDays(rand(1, 5))->format('Y-m-d H:i:s'),
                'expires_at' => \Carbon\Carbon::now()->addDays(rand(5, 30))->format('Y-m-d H:i:s'),
                'is_pinned' => $i == 1 ? true : false,
                'created_by' => $user->id,
            ]);
        }
    }
}
