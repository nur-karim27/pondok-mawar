<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\StudentBill;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\User;
use App\Notifications\NewPaymentNotification;
use Illuminate\Support\Facades\Notification;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['studentBill.student', 'studentBill.paymentType', 'receivedBy'])
                        ->orderBy('payment_date', 'desc');

        // Filter by gender
        $gender = $request->query('gender', 'semua');
        if ($gender !== 'semua') {
            $query->whereHas('studentBill.student', function ($q) use ($gender) {
                $q->where('gender', $gender);
            });
        }
        
        $payments = $query->paginate(15)->withQueryString();

        // Rekapitulasi (Filtered)
        $totalMasukQuery = Payment::query();
        $totalTunaiQuery = Payment::where('payment_method', 'tunai');
        $totalNonTunaiQuery = Payment::whereIn('payment_method', ['transfer', 'qris', 'midtrans_sandbox']);

        if ($gender !== 'semua') {
            $totalMasukQuery->whereHas('studentBill.student', function ($q) use ($gender) { $q->where('gender', $gender); });
            $totalTunaiQuery->whereHas('studentBill.student', function ($q) use ($gender) { $q->where('gender', $gender); });
            $totalNonTunaiQuery->whereHas('studentBill.student', function ($q) use ($gender) { $q->where('gender', $gender); });
        }

        $totalMasuk = $totalMasukQuery->sum('amount');
        $totalTunai = $totalTunaiQuery->sum('amount');
        $totalNonTunai = $totalNonTunaiQuery->sum('amount');

        // Tunggakan (Unpaid bills)
        $unpaidBillsQuery = StudentBill::with(['student', 'paymentType'])
            ->whereIn('status', ['belum_bayar', 'sebagian', 'terlambat']);
            
        if ($gender !== 'semua') {
            $unpaidBillsQuery->whereHas('student', function ($q) use ($gender) {
                $q->where('gender', $gender);
            });
        }

        $unpaidBills = $unpaidBillsQuery->get()
            ->map(function ($bill) {
                $paid = $bill->payments()->sum('amount');
                $bill->remaining = $bill->amount - $paid;
                return $bill;
            });

        return Inertia::render('Keuangan/Index', [
            'payments' => $payments,
            'summary' => [
                'total_masuk' => $totalMasuk,
                'total_tunai' => $totalTunai,
                'total_non_tunai' => $totalNonTunai,
            ],
            'unpaid_bills' => $unpaidBills,
            'students' => Student::orderBy('name')->get(['id', 'name', 'nis', 'gender', 'photo']),
            'filters' => ['gender' => $gender],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_bill_id' => 'required|exists:student_bills,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:tunai,transfer,qris',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $bill = StudentBill::findOrFail($validated['student_bill_id']);
        
        // Cek sisa tagihan (prevent overpayment if needed, simplified here)
        $totalPaid = $bill->payments()->sum('amount');
        $remaining = $bill->amount - $totalPaid;
        
        if ($validated['amount'] > $remaining) {
            return back()->withErrors(['amount' => 'Jumlah bayar melebihi sisa tagihan.']);
        }

        $payment = Payment::create([
            'student_bill_id' => $bill->id,
            'receipt_number' => 'INV-' . strtoupper(Str::random(8)),
            'payment_date' => $validated['payment_date'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'received_by' => auth()->id(),
            'notes' => $validated['notes'],
        ]);

        // Update bill status
        $newTotalPaid = $totalPaid + $payment->amount;
        if ($newTotalPaid >= $bill->amount) {
            $bill->update(['status' => 'lunas']);
        } else {
            $bill->update(['status' => 'sebagian']);
        }

        // Send Notification
        $notifiableUsers = User::whereIn('role', ['Super Admin', 'Bendahara'])->get();
        Notification::send($notifiableUsers, new NewPaymentNotification($payment));

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_bill_id' => 'required|exists:student_bills,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:tunai,transfer,qris,midtrans_sandbox',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $oldBill = $payment->studentBill;
        $newBill = StudentBill::findOrFail($validated['student_bill_id']);
        
        $payment->update([
            'student_bill_id' => $newBill->id,
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'payment_date' => $validated['payment_date'],
            'notes' => $validated['notes'],
        ]);

        $this->recalculateBillStatus($oldBill);
        if ($oldBill->id !== $newBill->id) {
            $this->recalculateBillStatus($newBill);
        }

        return back()->with('success', 'Pembayaran berhasil diperbarui.');
    }

    private function recalculateBillStatus(StudentBill $bill)
    {
        $totalPaid = $bill->payments()->sum('amount');
        if ($totalPaid >= $bill->amount) {
            $bill->update(['status' => 'lunas']);
        } elseif ($totalPaid > 0) {
            $bill->update(['status' => 'sebagian']);
        } else {
            $bill->update(['status' => 'belum_bayar']);
        }
    }

    public function getStudentBills(Student $student)
    {
        $bills = $student->studentBills()
                         ->with('paymentType')
                         ->get()
                         ->map(function ($bill) {
                             $paid = $bill->payments()->sum('amount');
                             $bill->remaining = $bill->amount - $paid;
                             return $bill;
                         })
                         ->filter(function ($bill) {
                             return $bill->remaining > 0;
                         })
                         ->values();

        return response()->json($bills);
    }

    public function export(Request $request)
    {
        $query = Payment::with(['studentBill.student', 'studentBill.paymentType', 'receivedBy'])
                        ->orderBy('payment_date', 'desc');

        $genderLabel = 'Semua';
        if ($request->filled('gender') && $request->gender !== 'semua') {
            $query->whereHas('studentBill.student', function ($q) use ($request) {
                $q->where('gender', $request->gender);
            });
            $genderLabel = ucfirst($request->gender);
        }

        $payments = $query->get();
        $filename = "Rekap_Keuangan_{$genderLabel}_" . date('Ymd_His') . ".csv";

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['No', 'No. Kuitansi', 'Tanggal', 'Nama Santri', 'Jenis Kelamin', 'Jenis Tagihan', 'Metode', 'Jumlah (Rp)', 'Keterangan', 'Diterima Oleh'];

        $callback = function() use($payments, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            $no = 1;
            foreach ($payments as $payment) {
                fputcsv($file, [
                    $no++,
                    $payment->receipt_number,
                    date('d-m-Y', strtotime($payment->payment_date)),
                    $payment->studentBill->student->name,
                    ucfirst($payment->studentBill->student->gender),
                    $payment->studentBill->paymentType->name,
                    ucfirst(str_replace('_', ' ', $payment->payment_method)),
                    $payment->amount,
                    $payment->notes ?? '-',
                    $payment->receivedBy ? $payment->receivedBy->name : 'Sistem'
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function midtransToken(Request $request)
    {
        $validated = $request->validate([
            'student_bill_id' => 'required|exists:student_bills,id',
            'amount' => 'required|numeric|min:1',
        ]);

        $bill = StudentBill::with('student', 'paymentType')->findOrFail($validated['student_bill_id']);

        \Midtrans\Config::$serverKey = config('midtrans.server_key');
        \Midtrans\Config::$isProduction = config('midtrans.is_production');
        \Midtrans\Config::$isSanitized = config('midtrans.is_sanitized');
        \Midtrans\Config::$is3ds = config('midtrans.is_3ds');

        $orderId = 'INV-' . strtoupper(Str::random(8));

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => $validated['amount'],
            ],
            'customer_details' => [
                'first_name' => $bill->student->name,
                'email' => 'santri@ponpesmawar.test',
            ],
            'item_details' => [
                [
                    'id' => $bill->paymentType->id,
                    'price' => $validated['amount'],
                    'quantity' => 1,
                    'name' => $bill->paymentType->name . ' (' . ($bill->billing_month ? $bill->billing_month . ' ' . $bill->billing_year : 'Tahunan') . ')',
                ]
            ],
        ];

        try {
            $snapToken = \Midtrans\Snap::getSnapToken($params);
            return response()->json(['token' => $snapToken, 'order_id' => $orderId]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function generateMonthly()
    {
        \Illuminate\Support\Facades\Artisan::call('billing:generate-monthly');
        $output = \Illuminate\Support\Facades\Artisan::output();
        
        return back()->with('success', 'Berhasil: ' . trim($output));
    }
}
