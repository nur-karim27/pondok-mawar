<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

Schedule::command('billing:generate-monthly')->monthlyOn(1, '01:00');
Schedule::command('billing:notify-overdue')->dailyAt('08:00');
Schedule::command('activities:check')->everyMinute();
Schedule::command('app:prune-activity-notifications')->dailyAt('00:00'); // Hapus notif lama tiap tengah malam
