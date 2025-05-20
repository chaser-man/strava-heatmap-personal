<?php
    
    $url = 'https://www.strava.com/oauth/token';
    $data = array(
        'client_id' => '160770',
        'client_secret' => '99a4a611ab72ab32e1c739e82bca98036ce4de1f',
        'code' => $_POST['code'],
        'grant_type' => 'authorization_code'
    );

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);

    if ($err) {
        echo json_encode(['error' => $err]);
    } else {
        echo $response;
    }

?>