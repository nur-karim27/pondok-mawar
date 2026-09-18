<?php

namespace App\Notifications;

use App\Models\ActivitySchedule;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class ActivityStartedNotification extends Notification
{
    public $schedule;

    /**
     * Create a new notification instance.
     */
    public function __construct(ActivitySchedule $schedule)
    {
        $this->schedule = $schedule;
    }

    /**
     * Get the notification's delivery channels.
     * Only send if user has this type enabled.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // Check user preference for this specific schedule
        $pref = \App\Models\UserSchedulePref::where('user_id', $notifiable->id)
            ->where('schedule_id', $this->schedule->id)
            ->first();

        // Default is enabled if no record exists, skip if explicitly disabled
        if ($pref && !$pref->is_enabled) {
            return []; 
        }

        return ['database', WebPushChannel::class];
    }

    /**
     * Get the web push representation of the notification.
     */
    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title("Waktunya: {$this->schedule->name}")
            ->icon('/favicon.ico')
            ->body("{$this->schedule->name} dimulai pukul " . substr($this->schedule->start_time, 0, 5) . " WIB.")
            ->data(['url' => route('attendances.jamaah.scan')]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $typeLabels = [
            'sholat_jamaah' => 'Sholat Jamaah',
            'kegiatan' => 'Kegiatan',
            'sekolah' => 'Sekolah',
            'madin' => 'Madin'
        ];

        $label = $typeLabels[$this->schedule->type] ?? 'Kegiatan';

        return [
            'title'         => "Waktunya {$label}: {$this->schedule->name}",
            'message'       => "{$this->schedule->name} dimulai pukul " . substr($this->schedule->start_time, 0, 5) . " WIB.",
            'url'           => route('attendances.jamaah.scan'),
            'icon'          => 'BookOpenCheck',
            'type'          => 'activity',
            'activity_type' => $this->schedule->type, // sholat_jamaah | kegiatan | sekolah | madin
            'activity_name' => $this->schedule->name,
        ];
    }
}
