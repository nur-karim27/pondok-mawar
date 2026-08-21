<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanteenTransaction extends Model
{
    protected $guarded = [];

    public function canteen()
    {
        return $this->belongsTo(Canteen::class);
    }

    public function handledBy()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
