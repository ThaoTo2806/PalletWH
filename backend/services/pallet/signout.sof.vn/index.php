<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('config.php');
include('function.php');

$token = isset($_POST['token']) ? $_POST['token'] : '';

if ($token != '') {
    $vsql = "SELECT * FROM lv_lv0007 WHERE lv197='" . $token . "'";
    
    // In ra câu lệnh SQL để kiểm tra
    // echo $vsql; 

    $vresult = db_query($vsql);

    if ($vresult) {
        $vnum = db_num_rows($vresult);

        if ($vnum > 0) {
			$vsql = "UPDATE lv_lv0007 SET lv197='', lv198= NULL WHERE lv197='$token'";
			$vresult = db_query($vsql);
			if ($vresult) {
				echo json_encode(['success' => 'Signout successful']);
			} else {
				echo json_encode(['error' => 'Failed to update database']);
			}
		} else {
			echo json_encode(['error' => 'Signout failed: Please try again!']);
		}
    } else {
        echo json_encode(['error' => 'Database query failed']);
    }
} else {
    echo json_encode(['error' => 'Token or Username missing']);
}
?>