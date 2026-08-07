<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesAndUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@pondokkita.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Super Admin',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'KH. Ahmad Fawwaz',
            'email' => 'pimpinan@pondokkita.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Pimpinan Pondok',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Ustadzah Nur Aini',
            'email' => 'sekretaris@pondokkita.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Sekretaris',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Bendahara Pondok',
            'email' => 'bendahara@pondokkita.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Bendahara',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Ustadz Musyrif',
            'email' => 'musyrif@pondokkita.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Musyrif / Pengasuhan',
            'is_active' => true,
        ]);
    }
}
