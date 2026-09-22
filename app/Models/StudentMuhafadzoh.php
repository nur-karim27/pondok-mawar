<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentMuhafadzoh extends Model
{
    protected $fillable = [
        'student_id',
        'date',
        'type',
        'tester_name',
        'memorization_name',
        'target',
        'grade',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
