<?php

namespace App\Console\Commands;

use App\Models\ActivitySchedule;
use App\Models\User;
use App\Notifications\ActivityStartedNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class CheckActivitySchedules extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'activities:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check activity schedules and send notifications if they are starting now.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Format time as HH:mm to match start_time which is TIME in DB (HH:mm:ss)
        // By checking where Time(start_time) is exactly equal to current H:i:00, or just matching H:i.
        $currentTime = now()->format('H:i');
        
        $schedules = ActivitySchedule::where('is_active', true)
            ->whereRaw("DATE_FORMAT(start_time, '%H:%i') = ?", [$currentTime])
            ->get();

        if ($schedules->isEmpty()) {
            $this->info("No activities starting at {$currentTime}.");
            return;
        }

        // Get all users except Wali Santri
        $users = User::where('role', '!=', 'Wali Santri')->get();

        foreach ($schedules as $schedule) {
            $this->info("Activity starting: {$schedule->name}");
            Notification::send($users, new ActivityStartedNotification($schedule));
        }

        $this->info('Notifications sent successfully.');
    }
}
