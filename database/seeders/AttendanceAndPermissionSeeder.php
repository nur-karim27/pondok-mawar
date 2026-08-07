<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $students = \App\Models\Student::all();
        $user = \App\Models\User::first();

        // Absensi
        for ($i = 0; $i < 10; $i++) {
            $student = $students->random();
            \App\Models\Attendance::firstOrCreate([
                'student_id' => $student->id,
                'date' => \Carbon\Carbon::now()->subDays(rand(1, 10))->format('Y-m-d'),
                'type' => 'sekolah',
            ], [
                'status' => 'hadir',
                'check_in_at' => \Carbon\Carbon::now()->subDays(rand(1, 10))->setTime(7, 0, 0)->format('Y-m-d H:i:s'),
                'recorded_by' => $user->id,
            ]);
        }

        // Perizinan
        for ($i = 0; $i < 5; $i++) {
            $student = $students->random();
            \App\Models\StudentPermission::create([
                'student_id' => $student->id,
                'permission_type' => 'pulang',
                'reason' => 'Acara Keluarga',
                'leave_date' => \Carbon\Carbon::now()->addDays(rand(1, 5))->format('Y-m-d'),
                'return_date' => \Carbon\Carbon::now()->addDays(rand(6, 10))->format('Y-m-d'),
                'destination' => $faker->city,
                'guardian_phone' => $faker->phoneNumber,
                'status' => 'disetujui',
                'approved_by' => $user->id,
            ]);
        }
    }
}
