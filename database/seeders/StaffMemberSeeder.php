<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StaffMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        for ($i = 1; $i <= 8; $i++) {
            $gender = $i % 2 == 0 ? 'putri' : 'putra';
            $user = \App\Models\User::create([
                'name' => $faker->name($gender == 'putra' ? 'male' : 'female'),
                'email' => 'ustadz' . $i . '@pondokkita.test',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'Ustadz / Ustadzah',
                'is_active' => true,
            ]);

            \App\Models\StaffMember::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'nip' => $faker->unique()->numerify('199#######'),
                'gender' => $gender,
                'role' => 'Pengajar',
                'division' => 'Pendidikan',
                'phone' => $faker->phoneNumber,
                'join_date' => $faker->dateTimeBetween('-5 years', '-1 year')->format('Y-m-d'),
                'is_active' => true,
            ]);
        }
    }
}
