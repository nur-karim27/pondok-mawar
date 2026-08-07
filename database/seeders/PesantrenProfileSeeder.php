<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PesantrenProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\PesantrenProfile::create([
            'name' => 'Pondok Pesantren Al-Hikmah',
            'short_name' => 'Al-Hikmah',
            'npsn' => '10293847',
            'address' => 'Jl. Pendidikan No. 123, Desa Damai',
            'village' => 'Damai',
            'district' => 'Sejahtera',
            'city' => 'Kota Mawar',
            'province' => 'Jawa Barat',
            'postal_code' => '40123',
            'phone' => '022-123456',
            'email' => 'info@alhikmah.test',
            'website' => 'https://alhikmah.test',
            'founded_year' => '1990',
            'leader_name' => 'KH. Ahmad Fawwaz',
            'vision' => 'Mencetak generasi rabbani yang berilmu, beramal, dan berakhlak mulia.',
            'mission' => '1. Menyelenggarakan pendidikan Islam terpadu.\n2. Membina akhlak karimah.\n3. Mengembangkan kemandirian umat.',
            'description' => 'Pondok Pesantren Al-Hikmah adalah lembaga pendidikan Islam yang berdedikasi tinggi terhadap pengembangan karakter santri.'
        ]);
    }
}
