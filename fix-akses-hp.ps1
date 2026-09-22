# Buka Port Pondok Mawar - Semua Profil Firewall
# Klik kanan file ini -> "Run with PowerShell"

Write-Host ""
Write-Host "== Pondok Mawar: Fix Akses HP ==" -ForegroundColor Yellow

# Deteksi IP sekarang
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -eq "Dhcp" -and $_.InterfaceAlias -notmatch "Loopback|WSL|vEthernet" } | Select-Object -First 1).IPAddress
if (-not $localIP) {
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" -and $_.InterfaceAlias -notmatch "Loopback|WSL" } | Select-Object -First 1).IPAddress
}

Write-Host ""
Write-Host "IP Laptop sekarang: $localIP" -ForegroundColor Green
Write-Host "Buka di HP        : http://${localIP}:8000" -ForegroundColor Cyan
Write-Host ""

# Buka firewall - profile=any (Domain + Private + Public)
netsh advfirewall firewall delete rule name="Pondok Mawar Port 8000" 2>$null | Out-Null
netsh advfirewall firewall delete rule name="Pondok Mawar Port 5173" 2>$null | Out-Null
netsh advfirewall firewall delete rule name="Pondok Mawar - Laravel Port 8000" 2>$null | Out-Null
netsh advfirewall firewall delete rule name="Pondok Mawar - Vite HMR Port 5173" 2>$null | Out-Null

$r1 = netsh advfirewall firewall add rule name="Pondok Mawar Port 8000" dir=in action=allow protocol=TCP localport=8000 profile=any
$r2 = netsh advfirewall firewall add rule name="Pondok Mawar Port 5173" dir=in action=allow protocol=TCP localport=5173 profile=any

if ($r1 -match "Ok") { Write-Host "[OK] Port 8000 dibuka (semua profil)" -ForegroundColor Green }
else { Write-Host "[GAGAL] $r1" -ForegroundColor Red }

if ($r2 -match "Ok") { Write-Host "[OK] Port 5173 dibuka (semua profil)" -ForegroundColor Green }
else { Write-Host "[GAGAL] $r2" -ForegroundColor Red }

# Set profil jaringan WiFi ke Private agar tidak terlalu ketat
$interface = Get-NetConnectionProfile | Where-Object { $_.InterfaceAlias -match "Wi-Fi|WiFi|Wireless" } | Select-Object -First 1
if ($interface) {
    Set-NetConnectionProfile -InterfaceAlias $interface.InterfaceAlias -NetworkCategory Private
    Write-Host "[OK] Profil WiFi diubah ke Private (agar firewall lebih permisif)" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Ketik ini di browser HP:" -ForegroundColor Yellow
Write-Host "  http://${localIP}:8000" -ForegroundColor Green
Write-Host "  (HP & Laptop harus WiFi yang SAMA!)" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
pause
