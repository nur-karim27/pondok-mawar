<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndUsersSeeder::class,
            PesantrenProfileSeeder::class,
            DormitoryAndRoomSeeder::class,
            GuardianAndStudentSeeder::class,
            StaffMemberSeeder::class,
            ActivitySeeder::class,
            LetterSeeder::class,
            AnnouncementSeeder::class,
            PaymentSeeder::class,
            AttendanceAndPermissionSeeder::class,
        ]);
    }
}
