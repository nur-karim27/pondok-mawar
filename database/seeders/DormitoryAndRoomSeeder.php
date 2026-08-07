<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DormitoryAndRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dormPutra = \App\Models\Dormitory::create([
            'name' => 'Asrama Putra Al-Fatih',
            'gender' => 'putra',
            'capacity' => 100,
            'description' => 'Asrama khusus santri putra.',
        ]);

        $dormPutri = \App\Models\Dormitory::create([
            'name' => 'Asrama Putri Khadijah',
            'gender' => 'putri',
            'capacity' => 100,
            'description' => 'Asrama khusus santri putri.',
        ]);

        for ($i = 1; $i <= 5; $i++) {
            \App\Models\Room::create([
                'dormitory_id' => $dormPutra->id,
                'name' => 'Kamar Putra ' . $i,
                'capacity' => 20,
                'status' => 'aktif',
            ]);
            
            \App\Models\Room::create([
                'dormitory_id' => $dormPutri->id,
                'name' => 'Kamar Putri ' . $i,
                'capacity' => 20,
                'status' => 'aktif',
            ]);
        }
    }
}
