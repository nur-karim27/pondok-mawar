<?php
$env = file_get_contents('.env');
$env .= "\nVAPID_PUBLIC_KEY=BHc8UrDI12YN1gCzI4E_ufLlYsVWVTLpPkcoQKOO5AIzHkncpB1nrkr8QZOgsWgoedINwPh2PYTXLbMTERiZ9XA\n";
$env .= "VAPID_PRIVATE_KEY=lHv4xRJOOO3isToQHvuhTWX4fGdl6PC1VPRdB8wxxyI\n";
file_put_contents('.env', $env);
echo "Keys appended.\n";
