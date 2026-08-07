<?php
$controllers = ['StudentController' => 'Kesantrian', 'StaffController' => 'Asatidz', 'AttendanceController' => 'Absensi', 'PaymentController' => 'Keuangan', 'LetterController' => 'Surat & Berkas', 'AnnouncementController' => 'Pengumuman'];
foreach($controllers as $c => $t) {
    $path = 'app/Http/Controllers/'.$c.'.php';
    $content = file_get_contents($path);
    $content = str_replace('class '.$c.' extends Controller', "use Inertia\Inertia;\n\nclass ".$c." extends Controller", $content);
    $content = preg_replace('/\{/', "{\n    public function index()\n    {\n        return Inertia::render('Placeholder', ['title' => '".$t."', 'description' => 'Fitur ini sedang dalam tahap pengembangan dan akan segera hadir.']);\n    }\n", $content, 1);
    file_put_contents($path, $content);
}
