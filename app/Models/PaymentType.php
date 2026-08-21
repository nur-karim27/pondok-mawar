<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentType extends Model
{
    protected $guarded = [];

    public function studentBills()
    {
        return $this->hasMany(StudentBill::class);
    }
}

