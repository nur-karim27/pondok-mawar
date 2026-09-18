<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PruneActivityNotifications extends Command
{
    protected $signature = 'app:prune-activity-notifications';
    protected $description = 'Hapus notifikasi kegiatan yang lebih dari 1 hari. Notifikasi keuangan (billing) tidak ikut dihapus.';

    public function handle()
    {
        // Delete notifications older than 24 hours EXCEPT billing/overdue types
        $deleted = DB::table('notifications')
            ->where('created_at', '<', now()->subDay())
            ->where(function ($q) {
                $q->whereNotLike('type', '%Billing%')
                  ->whereNotLike('type', '%Overdue%')
                  ->whereNotLike('type', '%billing%')
                  ->whereNotLike('type', '%overdue%');
            })
            ->delete();

        $this->info("Berhasil menghapus {$deleted} notifikasi lama (kecuali notifikasi keuangan).");
        return 0;
    }
}
