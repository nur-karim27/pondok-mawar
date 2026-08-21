<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\StudentBill;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['studentBill.student', 'studentBill.paymentType', 'receivedBy'])
                        ->orderBy('payment_date', 'desc');

        // Optional filtering by date or method can be added here
        
        $payments = $query->paginate(15);

        // Rekapitulasi
        $totalMasuk = Payment::sum('amount');
        $totalTunai = Payment::where('payment_method', 'tunai')->sum('amount');
        $totalNonTunai = Payment::whereIn('payment_method', ['transfer', 'qris'])->sum('amount');

        // Tunggakan (Unpaid bills)
        $unpaidBills = StudentBill::with(['student', 'paymentType'])
            ->whereIn('status', ['belum_bayar', 'sebagian', 'terlambat'])
            ->get()
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
            'students' => Student::orderBy('name')->get(['id', 'name', 'nis']),
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

        return back()->with('success', 'Pembayaran berhasil dicatat.');
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'student_bill_id' => 'required|exists:student_bills,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:tunai,transfer,qris',
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
                         });

        return response()->json($bills);
    }
}
