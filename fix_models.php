<?php
$files = glob('app/Models/*.php');
foreach($files as $f) {
    $content = file_get_contents($f);
    if (strpos($content, 'guarded') === false && strpos($content, 'fillable') === false) {
        $content = preg_replace('/\{\s*\/\/\s*\}/', "{\n    protected $guarded = [];\n}", $content);
        file_put_contents($f, $content);
    }
}
