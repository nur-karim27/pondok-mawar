<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GuardianAndStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        $guardians = [];
        for ($i = 1; $i <= 10; $i++) {
            $guardians[] = \App\Models\Guardian::create([
                'name' => $faker->name,
                'nik' => $faker->unique()->nik,
                'relationship' => $faker->randomElement(['Ayah', 'Ibu', 'Wali']),
                'phone' => $faker->phoneNumber,
                'email' => $faker->unique()->safeEmail,
                'occupation' => $faker->jobTitle,
                'address' => $faker->address,
            ]);
        }

        $rooms = \App\Models\Room::all();

        for ($i = 1; $i <= 26; $i++) {
            $gender = $i % 2 == 0 ? 'putri' : 'putra';
            $room = $rooms->filter(fn($r) => str_contains($r->name, ucfirst($gender)))->random();
            $guardian = $faker->randomElement($guardians);

            $user = \App\Models\User::create([
                'name' => $faker->name($gender == 'putra' ? 'male' : 'female'),
                'email' => 'santri' . $i . '@pondokkita.test',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'Wali Santri', // Usually Wali Santri can login, or Santri directly
                'is_active' => true,
            ]);

            \App\Models\Student::create([
                'user_id' => $user->id,
                'guardian_id' => $guardian->id,
                'room_id' => $room->id,
                'nis' => '2026' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nisn' => $faker->unique()->numerify('##########'),
                'name' => $user->name,
                'gender' => $gender,
                'place_of_birth' => $faker->city,
                'birth_date' => $faker->dateTimeBetween('-18 years', '-12 years')->format('Y-m-d'),
                'address' => $faker->address,
                'phone' => $faker->phoneNumber,
                'enrollment_date' => '2026-07-15',
                'status' => 'aktif',
            ]);
            
            $room->increment('current_occupancy');
        }
    }
}
