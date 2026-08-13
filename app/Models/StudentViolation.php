<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentViolation extends Model
{
    protected $fillable = [
        'student_id',
        'violation_name',
        'category',
        'points',
        'description',
        'violation_date',
        'reported_by',
        'punishment',
        'is_resolved',
    ];

    protected $casts = [
        'violation_date' => 'date',
        'is_resolved' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
