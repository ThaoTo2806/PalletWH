<?php
include('../config.php');
include('../function.php');

$token = isset($token) ? $token : '';
$code = isset($code) ? $code : '';

if ($token != '' && $code != '') {
    $vsql = "SELECT lv_lv0007.lv001, lv_lv0007.lv004, lv_lv0007.lv006, wh_lv0001.lv001 AS 'lv002', wh_lv0001.lv003
             FROM lv_lv0007
             JOIN wh_lv0034 ON lv_lv0007.lv001 = wh_lv0034.lv002
             JOIN wh_lv0001 ON wh_lv0001.lv001 = wh_lv0034.lv003
             WHERE lv_lv0007.lv197 = '$token'";

    $vresult = db_query($vsql);
    if ($vresult) {
        $vdata = [];
        while ($vrow = db_fetch_array($vresult)) {
            $vdata[] = $vrow;
        }
        echo json_encode(['data' => $vdata]);
    } else {
        echo json_encode(['error' => 'Database query failed']);
    }
} else {
    if ($token == '')
        echo json_encode(['error' => 'Token missing']);
    else
        echo json_encode(['error' => 'Code missing']);
}
