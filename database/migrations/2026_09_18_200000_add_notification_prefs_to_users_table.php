<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('notif_sholat_jamaah')->default(true)->after('receive_billing_notifications');
            $table->boolean('notif_kegiatan')->default(true)->after('notif_sholat_jamaah');
            $table->boolean('notif_sekolah')->default(true)->after('notif_kegiatan');
            $table->boolean('notif_madin')->default(true)->after('notif_sekolah');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['notif_sholat_jamaah', 'notif_kegiatan', 'notif_sekolah', 'notif_madin']);
        });
    }
};
