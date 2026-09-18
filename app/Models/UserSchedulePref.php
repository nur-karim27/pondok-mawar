<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSchedulePref extends Model
{
    protected $guarded = [];

    protected $casts = [
        'is_enabled' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->belongsTo(ActivitySchedule::class, 'schedule_id');
    }
}
