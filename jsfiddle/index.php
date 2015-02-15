<?php
require_once 'vendor/autoload.php';

$demo = 'first_table';
$config = file_get_contents('demos/'.$demo.'/demo.details');
$start = '- ';
$end = '---';

$replace = array(
    'https://rawgit.com/nullpunkt/zng-table/master/src/js/zng-table.js' => '/src/js/zng-table.js'
);


$config = substr($config, strpos($config, $start, strpos($config, 'resources: '))+strlen($start), strrpos($config, $end)-strpos($config, $start, strpos($config, 'resources: '))+strlen($start)-strlen($end)-strlen($start));
$assets = explode('- ', $config);
foreach($assets as &$entry) {
    $entry = trim($entry);
    if(array_key_exists($entry, $replace)) {
        $entry = $replace[$entry];
    }
};

echo '
<!DOCTYPE html>
<html>
    <head>
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