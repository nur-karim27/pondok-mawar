
<?php
$files = glob("app/Models/*.php");
foreach($files as $f) {
    $content = file_get_contents($f);
    if (strpos($content, "protected  = [];") !== false) {
        $content = str_replace("protected  = [];", "protected \$guarded = [];", $content);
        file_put_contents($f, $content);
    }
}
echo "Done";

