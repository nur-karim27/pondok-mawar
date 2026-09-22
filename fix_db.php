<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

if (!Schema::hasColumn('student_muhafadzohs', 'tester_name')) {
    Schema::table('student_muhafadzohs', function (Blueprint $table) {
        $table->string('tester_name')->nullable()->after('type');
    });
    echo "Column tester_name added successfully.\n";
} else {
    echo "Column already exists.\n";
}
