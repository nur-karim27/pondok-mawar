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
            'email' => 'superadmin@ponpesmawar.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Super Admin',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Admin Keamanan',
            'email' => 'keamanan@ponpesmawar.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Keamanan',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Admin Kesantrian',
            'email' => 'kesantrian@ponpesmawar.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Kesantrian',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Bendahara Pondok',
            'email' => 'bendahara@ponpesmawar.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Bendahara',
            'is_active' => true,
        ]);

        \App\Models\User::create([
            'name' => 'Wali Santri Fulan',
            'email' => 'wali@ponpesmawar.test',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Wali Santri',
            'is_active' => true,
        ]);
    }
}
