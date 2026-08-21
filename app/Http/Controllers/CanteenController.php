<?php

namespace App\Http\Controllers;

use App\Models\Canteen;
use App\Models\CanteenTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CanteenController extends Controller
{
    public function index()
    {
        $canteens = Canteen::withSum(['transactions as total_masuk' => function ($query) {
                $query->where('transaction_type', 'masuk');
            }], 'amount')
            ->withSum(['transactions as total_keluar' => function ($query) {
                $query->where('transaction_type', 'keluar');
            }], 'amount')
            ->orderBy('name')
            ->get();

        $canteens->transform(function ($canteen) {
            $canteen->balance = ($canteen->total_masuk ?? 0) - ($canteen->total_keluar ?? 0);
            return $canteen;
        });

        return Inertia::render('Keuangan/Kantin/Index', [
            'canteens' => $canteens
        ]);
    }

    public function show(Canteen $kantin)
    {
        $canteen = $kantin;
        $transactions = CanteenTransaction::where('canteen_id', $canteen->id)
            ->with('handledBy:id,name')
            ->select('canteen_transactions.*')
            ->selectSub(function ($query) {
                $query->selectRaw('SUM(CASE WHEN transaction_type = "masuk" THEN amount ELSE -amount END)')
                      ->from('canteen_transactions as ct2')
                      ->whereColumn('ct2.canteen_id', 'canteen_transactions.canteen_id')
                      ->where(function ($q) {
                          $q->whereColumn('ct2.transaction_date', '<', 'canteen_transactions.transaction_date')
                            ->orWhere(function ($q2) {
                                $q2->whereColumn('ct2.transaction_date', 'canteen_transactions.transaction_date')
                                   ->whereColumn('ct2.id', '<=', 'canteen_transactions.id');
                            });
                      });
            }, 'running_balance')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        $masuk = CanteenTransaction::where('canteen_id', $canteen->id)->where('transaction_type', 'masuk')->sum('amount');
        $keluar = CanteenTransaction::where('canteen_id', $canteen->id)->where('transaction_type', 'keluar')->sum('amount');
        $balance = $masuk - $keluar;

        return Inertia::render('Keuangan/Kantin/Show', [
            'canteen' => $canteen,
            'transactions' => $transactions,
            'balance' => $balance
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'canteen_id' => 'required|exists:canteens,id',
            'transaction_type' => 'required|in:masuk,keluar',
            'amount' => 'required|numeric|min:1',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        CanteenTransaction::create([
            'canteen_id' => $validated['canteen_id'],
            'transaction_type' => $validated['transaction_type'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'notes' => $validated['notes'],
            'handled_by' => auth()->id()
        ]);

        return back()->with('success', 'Transaksi kantin berhasil dicatat.');
    }

    public function update(Request $request, CanteenTransaction $transaction)
    {
        $validated = $request->validate([
            'transaction_type' => 'required|in:masuk,keluar',
            'amount' => 'required|numeric|min:1',
            'transaction_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $transaction->update([
            'transaction_type' => $validated['transaction_type'],
            'amount' => $validated['amount'],
            'transaction_date' => $validated['transaction_date'],
            'notes' => $validated['notes'],
            'handled_by' => auth()->id()
        ]);

        return back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function history()
    {
        $transactions = CanteenTransaction::with(['canteen:id,name,type', 'handledBy:id,name'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(20);

        return Inertia::render('Keuangan/Kantin/History', [
            'transactions' => $transactions
        ]);
    }

    public function settings()
    {
        $canteens = Canteen::orderBy('name')->get();
        return Inertia::render('Keuangan/Kantin/Settings', [
            'canteens' => $canteens
        ]);
    }

    public function storeSettings(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:putra,putri'
        ]);

        Canteen::create($validated);
        return redirect()->route('kantin.index')->with('success', 'Kantin berhasil ditambahkan.');
    }

    public function destroySettings(Canteen $kantin)
    {
        if ($kantin->transactions()->exists()) {
            return back()->with('error', 'Kantin tidak dapat dihapus karena sudah memiliki riwayat transaksi.');
        }
        $kantin->delete();
        return back()->with('success', 'Kantin berhasil dihapus.');
    }

    public function export(Request $request)
    {
        $transactions = CanteenTransaction::with(['canteen:id,name,type', 'handledBy:id,name'])
            ->select('canteen_transactions.*')
            ->selectSub(function ($query) {
                $query->selectRaw('SUM(CASE WHEN transaction_type = "masuk" THEN amount ELSE -amount END)')
                      ->from('canteen_transactions as ct2')
                      ->whereColumn('ct2.canteen_id', 'canteen_transactions.canteen_id')
                      ->where(function ($q) {
                          $q->whereColumn('ct2.transaction_date', '<', 'canteen_transactions.transaction_date')
                            ->orWhere(function ($q2) {
                                $q2->whereColumn('ct2.transaction_date', 'canteen_transactions.transaction_date')
                                   ->whereColumn('ct2.id', '<=', 'canteen_transactions.id');
                            });
                      });
            }, 'running_balance')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $filename = "riwayat_transaksi_kantin_" . date('Ymd_His') . ".csv";
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );
        $columns = array('Tanggal/Waktu', 'Nama Kantin', 'Tipe Kantin', 'Jenis Transaksi', 'Nominal (Rp)', 'Catatan', 'Admin / Petugas');

        $callback = function() use($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($transactions as $trx) {
                fputcsv($file, array(
                    " " . $trx->transaction_date, 
                    $trx->canteen->name, 
                    ucfirst($trx->canteen->type), 
                    ucfirst($trx->transaction_type), 
                    $trx->amount, 
                    $trx->notes, 
                    $trx->handledBy ? $trx->handledBy->name : '-'
                ));
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function exportBalances(Request $request)
    {
        $canteens = Canteen::withSum(['transactions as total_masuk' => function ($query) {
                $query->where('transaction_type', 'masuk');
            }], 'amount')
            ->withSum(['transactions as total_keluar' => function ($query) {
                $query->where('transaction_type', 'keluar');
            }], 'amount')
            ->orderBy('name')
            ->get();

        $filename = "rekap_saldo_kantin_" . date('Ymd_His') . ".csv";
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );
        $columns = array('Nama Kantin', 'Tipe Kantin', 'Total Pemasukan (Rp)', 'Total Pengeluaran (Rp)', 'Sisa Saldo (Rp)');

        $callback = function() use($canteens, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($canteens as $canteen) {
                $masuk = $canteen->total_masuk ?? 0;
                $keluar = $canteen->total_keluar ?? 0;
                $balance = $masuk - $keluar;
                fputcsv($file, array($canteen->name, ucfirst($canteen->type), $masuk, $keluar, $balance));
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }

    public function exportCanteen(Canteen $kantin)
    {
        $transactions = CanteenTransaction::where('canteen_id', $kantin->id)
            ->with('handledBy:id,name')
            ->orderBy('transaction_date', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $filename = "riwayat_kas_" . strtolower(str_replace(' ', '_', $kantin->name)) . "_" . date('Ymd_His') . ".csv";
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );
        $columns = array('Tanggal/Waktu', 'Jenis Transaksi', 'Nominal (Rp)', 'Sisa Kas (Rp)', 'Catatan', 'Admin / Petugas');

        $callback = function() use($transactions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            $runningBalance = 0;
            foreach ($transactions as $trx) {
                if ($trx->transaction_type === 'masuk') {
                    $runningBalance += $trx->amount;
                } else {
                    $runningBalance -= $trx->amount;
                }
                fputcsv($file, array(
                    " " . $trx->transaction_date, 
                    ucfirst($trx->transaction_type), 
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
