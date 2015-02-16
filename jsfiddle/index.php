<?php
if(file_exists('vendor/autoload.php')) {
    require_once 'vendor/autoload.php';
}

$demo = 'first_table';
$config = file_get_contents('demos/'.$demo.'/demo.details');
$start = 'resources:';

$assets = preg_grep("/^[ ]*-(.*)$/", explode("\n", substr($config, strpos($config, $start))));

$minified = TRUE;

$replace = array(
    'https://rawgit.com/nullpunkt/zng-table/master/src/js/zng-table.js' => ($minified ? '/build/zng-table.min.js' : '/src/js/zng-table.js')
);

foreach($assets as &$entry) {
    $entry = trim(str_replace(" - ", "", $entry));
    if(array_key_exists($entry, $replace)) {
        $entry = $replace[$entry];
    }
};

echo '
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta charset="utf-8">
        <title>'.$demo.'</title>
        ';
foreach($assets as $asset) {
    if(strpos($asset, '.css')!==FALSE) {
        echo '<link rel="stylesheet" type="text/css" href="'.$asset.'" />';
    }
}
echo '<style type="text/css">'.file_get_contents('demos/'.$demo.'/demo.css').'</style>';

echo '
</head>

<body>
';

echo file_get_contents('demos/'.$demo.'/demo.html');

foreach($assets as $asset) {
    if(strpos($asset, '.js')!==FALSE) {
        echo '<script src="'.$asset.'"></script>'.PHP_EOL;
    }
}

echo '<script type="text/javascript">'.file_get_contents('demos/'.$demo.'/demo.js').'</script>';
echo '
</body>
</html>
';
