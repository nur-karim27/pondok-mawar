<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sppType = \App\Models\PaymentType::create([
            'name' => 'SPP Bulanan',
            'code' => 'SPP',
            'amount' => 500000,
            'frequency' => 'bulanan',
            'description' => 'SPP Bulanan Santri',
        ]);

        $students = \App\Models\Student::all();
        $admin = \App\Models\User::first();
        
        $faker = \Faker\Factory::create('id_ID');

        foreach ($students as $student) {
            $bill = \App\Models\StudentBill::create([
                'student_id' => $student->id,
                'payment_type_id' => $sppType->id,
                'billing_month' => date('m'),
                'billing_year' => date('Y'),
                'amount' => $sppType->amount,
                'due_date' => date('Y-m-10'),
                'status' => 'lunas',
            ]);

            \App\Models\Payment::create([
                'student_bill_id' => $bill->id,
                'receipt_number' => 'REC/' . date('Ymd') . '/' . str_pad($student->id, 4, '0', STR_PAD_LEFT),
                'payment_date' => \Carbon\Carbon::now()->subDays(rand(1, 10))->format('Y-m-d H:i:s'),
                'amount' => $bill->amount,
                'payment_method' => 'transfer',
                'received_by' => $admin->id,
            ]);
        }
    }
}
