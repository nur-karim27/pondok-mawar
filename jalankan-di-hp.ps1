# ============================================================
# Script: Jalankan Pondok Mawar - Akses dari HP via WiFi
# CATATAN: Klik kanan -> "Run with PowerShell" (sebagai Administrator)
# ============================================================

# Cek apakah dijalankan sebagai Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host ""
    Write-Host " [!] Script ini harus dijalankan sebagai Administrator!" -ForegroundColor Red
    Write-Host "     Klik kanan file ini -> Run with PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Pondok Mawar - Server Akses HP via WiFi Lokal      " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# -- Deteksi IP otomatis (ambil IP WiFi yang sedang aktif) --
$localIP = (
    Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.PrefixOrigin -eq 'Dhcp' -and
        $_.InterfaceAlias -notmatch 'Loopback|WSL|vEthernet|Hyper'
    } |
    Sort-Object -Property InterfaceMetric |
    Select-Object -First 1
).IPAddress

# Fallback jika DHCP tidak ditemukan (misalnya IP statis)
if (-not $localIP) {
    $localIP = (
        Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object {
            $_.IPAddress -notlike '127.*' -and
            $_.IPAddress -notlike '169.*' -and
            $_.InterfaceAlias -notmatch 'Loopback|WSL|vEthernet|Hyper'
        } |
        Select-Object -First 1
    ).IPAddress
}

if (-not $localIP) {
    Write-Host " [ERROR] Tidak bisa mendeteksi IP! Pastikan laptop terhubung ke WiFi." -ForegroundColor Red
    Write-Host ""
    pause
    exit
}

$laravelUrl = "http://${localIP}:8000"

Write-Host " IP Laptop kamu sekarang : $localIP" -ForegroundColor Green
Write-Host ""
Write-Host " Buka di HP              : $laravelUrl" -ForegroundColor White
Write-Host ""

# -- Buka Firewall (hapus rule lama, pasang baru) --
Write-Host " Mengkonfigurasi Firewall Windows..." -ForegroundColor Cyan

netsh advfirewall firewall delete rule name="Pondok Mawar - Laravel Port 8000" 2>$null | Out-Null
netsh advfirewall firewall delete rule name="Pondok Mawar - Vite HMR Port 5173" 2>$null | Out-Null

$r1 = netsh advfirewall firewall add rule name="Pondok Mawar - Laravel Port 8000" dir=in action=allow protocol=TCP localport=8000
$r2 = netsh advfirewall firewall add rule name="Pondok Mawar - Vite HMR Port 5173"  dir=in action=allow protocol=TCP localport=5173

if ($r1 -match "Ok") {
    Write-Host " [OK] Firewall Port 8000 (Laravel) dibuka" -ForegroundColor Green
} else {
    Write-Host " [WARN] Port 8000 mungkin sudah terbuka atau gagal" -ForegroundColor Yellow
}

if ($r2 -match "Ok") {
    Write-Host " [OK] Firewall Port 5173 (Vite) dibuka" -ForegroundColor Green
} else {
    Write-Host " [WARN] Port 5173 mungkin sudah terbuka atau gagal" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  KETIK URL ini di browser HP kamu:" -ForegroundColor Yellow
Write-Host ""
Write-Host "         $laravelUrl" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "  Pastikan HP & Laptop terhubung ke WiFi yang SAMA!" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " Tips:" -ForegroundColor Cyan
Write-Host "   - Setiap ganti WiFi/tempat, jalankan script ini lagi" -ForegroundColor White
Write-Host "   - Script otomatis mendeteksi IP baru kamu" -ForegroundColor White
Write-Host "   - Jangan tutup terminal php artisan serve" -ForegroundColor White
Write-Host ""

# -- Cek apakah php artisan serve sudah berjalan --
$phpProcess = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($phpProcess) {
    Write-Host " [OK] Server Laravel sudah berjalan di port 8000" -ForegroundColor Green
} else {
    Write-Host " [INFO] Server Laravel BELUM berjalan." -ForegroundColor Yellow
    Write-Host "        Buka terminal baru dan ketik:" -ForegroundColor White
    Write-Host "        php artisan serve --host=0.0.0.0 --port=8000" -ForegroundColor Cyan
}

Write-Host ""
pause
