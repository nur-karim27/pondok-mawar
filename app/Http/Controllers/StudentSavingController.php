<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\SavingTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StudentSavingController extends Controller
{
    public function index(Request $request)
    {
        // Calculate balance for each student
        $students = Student::withSum(['savingTransactions as total_setor' => function ($query) {
                $query->where('transaction_type', 'setor');
            }], 'amount')
            ->withSum(['savingTransactions as total_tarik' => function ($query) {
                $query->where('transaction_type', 'tarik');
            }], 'amount')
            ->orderBy('name')
            ->paginate(15);

        $students->getCollection()->transform(function ($student) {
            $student->balance = ($student->total_setor ?? 0) - ($student->total_tarik ?? 0);
            return $student;
        });

        // Rekapitulasi Global
        $totalSetor = SavingTransaction::where('transaction_type', 'setor')->sum('amount');
        $totalTarik = SavingTransaction::where('transaction_type', 'tarik')->sum('amount');
        $totalSaldo = $totalSetor - $totalTarik;

        return Inertia::render('Keuangan/Tabungan/Index', [
            'students' => $students,
            'summary' => [
                'total_saldo' => $totalSaldo,
                'total_setor' => $totalSetor,
                'total_tarik' => $totalTarik,
            ]
        ]);
    }

    public function show(Student $tabungan)
    {
        // $tabungan is a Student instance since we use route model binding
        $student = $tabungan;
        
        $transactions = SavingTransaction::where('student_id', $student->id)
            ->with('handledBy:id,name')
            ->select('saving_transactions.*')
            ->selectSub(function ($query) {
                $query->selectRaw('SUM(CASE WHEN transaction_type = "setor" THEN amount ELSE -amount END)')
                      ->from('saving_transactions as st2')
                      ->whereColumn('st2.student_id', 'saving_transactions.student_id')
                      ->where(function ($q) {
                          $q->whereColumn('st2.transaction_date', '<', 'saving_transactions.transaction_date')
                            ->orWhere(function ($q2) {
                                $q2->whereColumn('st2.transaction_date', 'saving_transactions.transaction_date')
                                   ->whereColumn('st2.id', '<=', 'saving_transactions.id');
                            });
                      });
            }, 'running_balance')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        $setor = SavingTransaction::where('student_id', $student->id)->where('transaction_type', 'setor')->sum('amount');
        $tarik = SavingTransaction::where('student_id', $student->id)->where('transaction_type', 'tarik')->sum('amount');
        $balance = $setor - $tarik;

        return Inertia::render('Keuangan/Tabungan/Show', [
            'student' => $student,
            'transactions' => $transactions,
            'balance' => $balance
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'transaction_type' => 'required|in:setor,tarik',
            'amount' => 'required|numeric|min:1',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        if ($validated['transaction_type'] === 'tarik') {
            // Biarkan penarikan melebihi saldo, sehingga bisa minus.
        }

        SavingTransaction::create([
            'student_id' => $validated['student_id'],
            'transaction_type' => $validated['transaction_type'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'notes' => $validated['notes'],
            'handled_by' => auth()->id()
        ]);

        return back()->with('success', 'Transaksi tabungan berhasil dicatat.');
    }

    public function history(Request $request)
    {
        $transactions = SavingTransaction::with(['student:id,name,nis', 'handledBy:id,name'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(20);

        return Inertia::render('Keuangan/Tabungan/History', [
            'transactions' => $transactions
        ]);
    }

    public function export(Request $request)
    {
        $transactions = SavingTransaction::with(['student:id,name,nis', 'handledBy:id,name'])
            ->select('saving_transactions.*')
            ->selectSub(function ($query) {
                $query->selectRaw('SUM(CASE WHEN transaction_type = "setor" THEN amount ELSE -amount END)')
                      ->from('saving_transactions as st2')
                      ->whereColumn('st2.student_id', 'saving_transactions.student_id')
                      ->where(function ($q) {
                          $q->whereColumn('st2.transaction_date', '<', 'saving_transactions.transaction_date')
                            ->orWhere(function ($q2) {
                                $q2->whereColumn('st2.transaction_date', 'saving_transactions.transaction_date')
                                   ->whereColumn('st2.id', '<=', 'saving_transactions.id');
                            });
                      });
            }, 'running_balance')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $filename = "rekap_tabungan_santri_" . date('Ymd_His') . ".csv";

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = array('Tanggal/Waktu', 'NIS', 'Nama Santri', 'Jenis Transaksi', 'Nominal (Rp)', 'Catatan', 'Admin / Petugas');

        $callback = function() use($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($transactions as $trx) {
                $row['Tanggal/Waktu']  = " " . $trx->transaction_date;
                $row['NIS']    = $trx->student->nis;
                $row['Nama Santri']  = $trx->student->name;
                
                $jenis = ucfirst($trx->transaction_type);
                if ($trx->transaction_type === 'tarik' && $trx->running_balance < 0) {
                    $jenis = 'Tarik (Kasbon)';
                }
                $row['Jenis Transaksi'] = $jenis;
                
                $row['Nominal (Rp)']  = $trx->amount;
                $row['Catatan']  = $trx->notes;
                $row['Admin / Petugas']  = $trx->handledBy ? $trx->handledBy->name : '-';

                fputcsv($file, array($row['Tanggal/Waktu'], $row['NIS'], $row['Nama Santri'], $row['Jenis Transaksi'], $row['Nominal (Rp)'], $row['Catatan'], $row['Admin / Petugas']));
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportBalances(Request $request)
    {
        $students = Student::withSum(['savingTransactions as total_setor' => function ($query) {
                $query->where('transaction_type', 'setor');
            }], 'amount')
            ->withSum(['savingTransactions as total_tarik' => function ($query) {
                $query->where('transaction_type', 'tarik');
            }], 'amount')
            ->orderBy('name')
            ->get();

        $filename = "rekap_saldo_tabungan_" . date('Ymd_His') . ".csv";
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );
        $columns = array('NIS', 'Nama Santri', 'Total Setor (Rp)', 'Total Tarik (Rp)', 'Sisa Saldo (Rp)');

        $callback = function() use($students, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($students as $student) {
                $setor = $student->total_setor ?? 0;
                $tarik = $student->total_tarik ?? 0;
                $balance = $setor - $tarik;
                fputcsv($file, array($student->nis, $student->name, $setor, $tarik, $balance));
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function exportStudent(Student $student)
    {
        $transactions = SavingTransaction::where('student_id', $student->id)
            ->with('handledBy:id,name')
            ->orderBy('transaction_date', 'asc') // ascending to calculate running balance
            ->orderBy('id', 'asc')
            ->get();

        $filename = "riwayat_tabungan_" . strtolower(str_replace(' ', '_', $student->name)) . "_" . date('Ymd_His') . ".csv";
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );
        $columns = array('Tanggal/Waktu', 'Jenis Transaksi', 'Nominal (Rp)', 'Sisa Saldo (Rp)', 'Catatan', 'Admin / Petugas');

        $callback = function() use($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            $runningBalance = 0;
            foreach ($transactions as $trx) {
                if ($trx->transaction_type === 'setor') {
                    $runningBalance += $trx->amount;
                    $jenis = 'Setor';
                } else {
                    $runningBalance -= $trx->amount;
                    $jenis = $runningBalance < 0 ? 'Tarik (Kasbon)' : 'Tarik';
                }
                fputcsv($file, array(
                    " " . $trx->transaction_date, 
                    $jenis, 
                    $trx->amount, 
                    $runningBalance, 
                    $trx->notes, 
                    $trx->handledBy ? $trx->handledBy->name : '-'
                ));
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
}
