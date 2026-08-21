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

    public function studentBills()
    {
        return $this->hasMany(StudentBill::class);
    }

    public function savingTransactions()
    {
        return $this->hasMany(SavingTransaction::class);
    }
}

