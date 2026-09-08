# ============================================================
# Script: Buka Firewall untuk Pondok Mawar (Run as Administrator)
# ============================================================
# Cara pakai: Klik kanan file ini → "Run with PowerShell" (as Admin)

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Pondok Mawar — Membuka Port Firewall" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Hapus rule lama jika ada
netsh advfirewall firewall delete rule name="Pondok Mawar - Laravel Port 8000" 2>$null
netsh advfirewall firewall delete rule name="Pondok Mawar - Vite HMR Port 5173" 2>$null

# Tambah rule baru
$r1 = netsh advfirewall firewall add rule name="Pondok Mawar - Laravel Port 8000" dir=in action=allow protocol=TCP localport=8000
$r2 = netsh advfirewall firewall add rule name="Pondok Mawar - Vite HMR Port 5173" dir=in action=allow protocol=TCP localport=5173

if ($r1 -match "Ok") {
    Write-Host "[OK] Port 8000 (Laravel) berhasil dibuka" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Port 8000 gagal: $r1" -ForegroundColor Red
}

if ($r2 -match "Ok") {
    Write-Host "[OK] Port 5173 (Vite HMR) berhasil dibuka" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Port 5173 gagal: $r2" -ForegroundColor Red
}

Write-Host ""
Write-Host "Selesai! Akses dari HP menggunakan:" -ForegroundColor Cyan
Write-Host "   http://192.168.0.105:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pastikan HP dan laptop terhubung ke WiFi yang sama." -ForegroundColor White
Write-Host ""
pause
