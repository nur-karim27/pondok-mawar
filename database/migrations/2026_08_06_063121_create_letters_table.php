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
        Schema::create('letters', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->enum('type', ['masuk', 'keluar', 'keputusan', 'keterangan']);
            $table->string('subject');
            $table->string('sender')->nullable();
            $table->string('recipient')->nullable();
            $table->date('letter_date');
            $table->date('received_date')->nullable();
            $table->text('body')->nullable();
            $table->string('attachment')->nullable();
            $table->enum('status', ['draft', 'masuk', 'perlu_paraf', 'diproses', 'selesai', 'diarsipkan'])->default('draft');
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('letters');
    }
};
