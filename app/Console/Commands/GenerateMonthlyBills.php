<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;
use App\Models\PaymentType;
use App\Models\StudentBill;
use Carbon\Carbon;

class GenerateMonthlyBills extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'billing:generate-monthly {--month=} {--year=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly bills for all active students';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $month = $this->option('month') ?: Carbon::now()->format('m');
        $year = $this->option('year') ?: Carbon::now()->format('Y');

        $this->info("Generating monthly bills for {$month}-{$year}...");

        $monthlyPaymentTypes = PaymentType::where('is_active', true)
                                          ->where('frequency', 'bulanan')
                                          ->get();

        if ($monthlyPaymentTypes->isEmpty()) {
            $this->warn('No active monthly payment types found.');
            return;
        }

        $activeStudents = Student::all(); // Optionally filter by status if you have one
        $generatedCount = 0;

        $dueDate = Carbon::createFromDate($year, $month, 1)->endOfMonth()->format('Y-m-d');

        foreach ($monthlyPaymentTypes as $paymentType) {
            foreach ($activeStudents as $student) {
                // Check if bill already exists
                $existingBill = StudentBill::where('student_id', $student->id)
                                           ->where('payment_type_id', $paymentType->id)
                                           ->where('billing_month', $month)
                                           ->where('billing_year', $year)
                                           ->first();

                if (!$existingBill) {
                    StudentBill::create([
                        'student_id' => $student->id,
                        'payment_type_id' => $paymentType->id,
                        'billing_month' => $month,
                        'billing_year' => $year,
                        'amount' => $paymentType->amount,
                        'due_date' => $dueDate,
                        'status' => 'belum_bayar',
                        'notes' => "Tagihan Otomatis {$paymentType->name} Bulan {$month} {$year}",
                    ]);
                    $generatedCount++;
                }
            }
        }

        $this->info("Successfully generated {$generatedCount} new bills for {$month}-{$year}.");
    }
}
