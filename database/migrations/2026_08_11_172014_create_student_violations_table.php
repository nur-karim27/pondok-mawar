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
        Schema::create('student_violations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->string('violation_name');
            $table->enum('category', ['Ringan', 'Sedang', 'Berat', 'Sangat Berat']);
            $table->integer('points');
            $table->text('description')->nullable();
            $table->date('violation_date');
            $table->foreignId('reported_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('punishment')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_violations');
    }
};
