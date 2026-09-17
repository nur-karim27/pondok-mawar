<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StudentBill;
use App\Models\User;
use App\Notifications\OverdueBillNotification;
use Carbon\Carbon;

class NotifyOverdueBills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'billing:notify-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications for overdue bills';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Checking for overdue bills...");

        // Find bills that are past due date and not fully paid
        // We'll consider status in belum_bayar, sebagian, or terlambat
        $overdueBills = StudentBill::whereIn('status', ['belum_bayar', 'sebagian', 'terlambat'])
                                   ->where('due_date', '<', Carbon::now()->format('Y-m-d'))
                                   ->get();

        if ($overdueBills->isEmpty()) {
            $this->info('No overdue bills found.');
            return;
        }

        // Only users with role Super Admin or Bendahara who have notifications enabled
        $notifiableUsers = User::whereIn('role', ['Super Admin', 'Bendahara'])
                               ->where('receive_billing_notifications', true)
                               ->get();

        if ($notifiableUsers->isEmpty()) {
            $this->warn('No users configured to receive billing notifications.');
            return;
        }

        $count = 0;
        foreach ($overdueBills as $bill) {
            // Check if there is actual remaining balance just to be safe
            $totalPaid = $bill->payments()->sum('amount');
            if ($totalPaid < $bill->amount) {
                foreach ($notifiableUsers as $user) {
                    $user->notify(new OverdueBillNotification($bill));
                }
                $count++;
                
                // Update status to terlambat if not already
                if ($bill->status !== 'terlambat' && $bill->status !== 'sebagian') {
                    $bill->update(['status' => 'terlambat']);
                }
            }
        }

        $this->info("Sent notifications for {$count} overdue bills.");
    }
}
