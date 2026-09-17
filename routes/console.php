<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

Schedule::command('billing:generate-monthly')->monthlyOn(1, '01:00');
Schedule::command('billing:notify-overdue')->dailyAt('08:00');
