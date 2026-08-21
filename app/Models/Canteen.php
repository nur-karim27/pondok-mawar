<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Canteen extends Model
{
    protected $guarded = [];

    public function transactions()
    {
        return $this->hasMany(CanteenTransaction::class);
    }
}
