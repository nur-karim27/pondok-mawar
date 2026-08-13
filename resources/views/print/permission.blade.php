<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Surat Izin {{ $perizinan->permission_type }} - {{ $perizinan->student->name }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #000;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 1px solid #ccc;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
        }
        .header h2 {
            margin: 0;
            font-size: 18px;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 12px;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            text-decoration: underline;
            margin-bottom: 30px;
        }
        .content table {
            width: 100%;
            margin-bottom: 20px;
        }
        .content table td {
            padding: 5px;
            vertical-align: top;
        }
        .content table td:first-child {
            width: 30%;
            font-weight: bold;
        }
        .content table td:nth-child(2) {
            width: 2%;
        }
        .signatures {
            margin-top: 50px;
            width: 100%;
        }
        .signatures td {
            text-align: center;
            width: 50%;
            vertical-align: bottom;
            padding-top: 50px;
        }
        .signature-line {
            display: inline-block;
            width: 150px;
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            .container {
                border: none;
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px; text-align: center;">
        <div style="margin-bottom: 15px; color: #4b5563; font-size: 14px;">
            💡 <strong>Tips:</strong> Untuk mengunduh (download) surat ini sebagai PDF, klik tombol di bawah lalu pada menu <strong>Destination (Tujuan)</strong>, ubah menjadi <strong>Save as PDF (Simpan sebagai PDF)</strong>.
        </div>
        <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            🖨️ Cetak / Download PDF
        </button>
        <button onclick="window.close()" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Tutup
        </button>
    </div>

    <div class="container">
        <div class="header">
            <h1>PONDOK PESANTREN MAMBA'UL ANWAR</h1>
            <h2>(PONPES MAWAR)</h2>
            <p>Alamat: Jl. Raya Pondok Pesantren, Kec. Santri, Kab. Ilmu, Kode Pos 12345</p>
            <p>Telp: (021) 1234567 | Email: info@ponpesmawar.test</p>
        </div>

        <div class="title">
            SURAT IZIN {{ strtoupper($perizinan->permission_type) }}
        </div>

        <div class="content">
            <p>Yang bertanda tangan di bawah ini, Pengurus Keamanan Pondok Pesantren Mamba'ul Anwar, menerangkan bahwa:</p>
            
            <table>
                <tr>
                    <td>Nama Lengkap</td>
                    <td>:</td>
                    <td><strong>{{ $perizinan->student->name }}</strong></td>
                </tr>
                <tr>
                    <td>Nomor Induk Santri (NIS)</td>
                    <td>:</td>
                    <td>{{ $perizinan->student->nis }}</td>
                </tr>
                <tr>
                    <td>Jenis Kelamin</td>
                    <td>:</td>
                    <td>{{ $perizinan->student->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
                </tr>
                <tr>
                    <td>Keperluan / Alasan</td>
                    <td>:</td>
                    <td>{{ $perizinan->reason }}</td>
                </tr>
                <tr>
                    <td>Tanggal Izin / Keluar</td>
                    <td>:</td>
                    <td>{{ \Carbon\Carbon::parse($perizinan->leave_date)->translatedFormat('d F Y - H:i') }} WIB</td>
                </tr>
                <tr>
                    <td>Batas Tanggal Kembali</td>
                    <td>:</td>
                    <td>{{ $perizinan->return_date ? \Carbon\Carbon::parse($perizinan->return_date)->translatedFormat('d F Y - H:i') . ' WIB' : '-' }}</td>
                </tr>
            </table>

            <p>Demikian surat izin ini dibuat untuk dapat digunakan sebagaimana mestinya. Kepada santri yang bersangkutan diwajibkan untuk kembali ke Pondok Pesantren tepat pada waktu yang telah ditentukan.</p>
        </div>

        <table class="signatures">
            <tr>
                <!-- Removed Wali Santri signature -->
                <td>
                    <br>
                    <strong>Santri</strong>
                    <br><br><br><br>
                    <span class="signature-line"></span><br>
                    {{ $perizinan->student->name }}
                </td>
                <td>
                    Ditetapkan di: Ponpes Mawar<br>
                    Tanggal: {{ now()->translatedFormat('d F Y') }}<br>
                    <strong>Bagian Keamanan</strong>
                    <br><br><br><br>
                    <span class="signature-line"></span><br>
                    Pengurus Keamanan
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
