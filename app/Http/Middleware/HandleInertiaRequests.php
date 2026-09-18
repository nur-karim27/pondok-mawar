<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $unreadNotifications = [];
        $notifCounts = ['sholat_jamaah' => 0, 'kegiatan' => 0, 'sekolah' => 0, 'madin' => 0, 'other' => 0, 'total' => 0];
        $notifPrefs = ['notif_sholat_jamaah' => true, 'notif_kegiatan' => true, 'notif_sekolah' => true, 'notif_madin' => true];

        if ($user) {
            $allUnread = $user->unreadNotifications()->latest()->take(20)->get();
            $unreadNotifications = $allUnread->take(10)->values();

            foreach ($allUnread as $notif) {
                $actType = $notif->data['activity_type'] ?? null;
                if ($actType && isset($notifCounts[$actType])) {
                    $notifCounts[$actType]++;
                } else {
                    $notifCounts['other']++;
                }
                $notifCounts['total']++;
            }

            // Pluck the specific schedule prefs
            $notifPrefs = \App\Models\UserSchedulePref::where('user_id', $user->id)
                ->pluck('is_enabled', 'schedule_id')
                ->toArray();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'unread_notifications' => $unreadNotifications,
                    'notif_counts'         => $notifCounts,
                    'notif_prefs'          => $notifPrefs,
                ]) : null,
            ],
            'vapid_public_key' => env('VAPID_PUBLIC_KEY'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
