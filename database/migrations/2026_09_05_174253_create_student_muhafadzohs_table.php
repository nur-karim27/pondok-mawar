<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_muhafadzohs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->date('date');
            $table->string('type'); // Hafalan Baru, Murojaah, Ziyadah, Ujian
            $table->string('memorization_name'); // Nama Hafalan / Kitab / Surat
            $table->string('target')->nullable(); // Target Hafalan
            $table->string('grade')->nullable(); // Nilai
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_muhafadzohs');
    }
};
