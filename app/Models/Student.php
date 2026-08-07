<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $guarded = [];

    public function guardian()
    {
        return $this->belongsTo(Guardian::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}

