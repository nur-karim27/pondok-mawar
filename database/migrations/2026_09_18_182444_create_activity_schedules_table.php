<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Alter attendances ENUM type to include new types, preserving old ones to avoid data loss
        DB::statement("ALTER TABLE attendances MODIFY COLUMN type ENUM('sekolah', 'ngaji', 'kegiatan', 'asrama', 'jamaah', 'madin', 'sholat_jamaah')");
        
        Schema::create('activity_schedules', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['sholat_jamaah', 'kegiatan', 'sekolah', 'madin']);
            $table->string('name'); // e.g. "Dhuhur", "Sekolah Pagi"
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Insert initial data
        DB::table('activity_schedules')->insert([
            ['type' => 'sholat_jamaah', 'name' => 'Subuh', 'start_time' => '04:30:00', 'end_time' => '05:00:00', 'is_active' => true],
            ['type' => 'sholat_jamaah', 'name' => 'Dhuhur', 'start_time' => '12:00:00', 'end_time' => '12:30:00', 'is_active' => true],
            ['type' => 'sholat_jamaah', 'name' => 'Ashar', 'start_time' => '15:00:00', 'end_time' => '15:30:00', 'is_active' => true],
            ['type' => 'sholat_jamaah', 'name' => 'Maghrib', 'start_time' => '18:00:00', 'end_time' => '18:30:00', 'is_active' => true],
            ['type' => 'sholat_jamaah', 'name' => 'Isya', 'start_time' => '19:00:00', 'end_time' => '19:30:00', 'is_active' => true],
            ['type' => 'sekolah', 'name' => 'Sekolah', 'start_time' => '07:00:00', 'end_time' => '14:00:00', 'is_active' => true],
            ['type' => 'madin', 'name' => 'Madin Sore', 'start_time' => '16:00:00', 'end_time' => '17:30:00', 'is_active' => true],
            ['type' => 'madin', 'name' => 'Madin Malam', 'start_time' => '20:00:00', 'end_time' => '21:30:00', 'is_active' => true],
            ['type' => 'kegiatan', 'name' => 'Pengajian Rutin', 'start_time' => '10:00:00', 'end_time' => '11:00:00', 'is_active' => true],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_schedules');
        
        // Cannot cleanly revert ENUM modification without losing data if new types were used
        // so we'll just leave the ENUM as is on rollback, or we could define rollback.
    }
};
