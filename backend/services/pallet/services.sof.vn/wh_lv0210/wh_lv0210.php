<?php

include('../config.php');
include('../function.php');

// Lấy token và code được truyền từ index.php
$token = isset($token) ? $token : '';
$code = isset($code) ? $code : '';
$user06 = isset($user06) ? $user06 : '';
$wh_id = isset($wh_id) ? $wh_id : '';
$coke = isset($coke) ? $coke : '';
$pallettypeid = isset($pallettypeid) ? $pallettypeid : '';
$zone = isset($zone) ? $zone : '';
$func = isset($func) ? $func : '';
$position = isset($position) ? $position : '';
if ($token != '' && $code != '' && $func != '' && $wh_id != '') {
    switch ($func) {
        case 'select':
            $query = "
        SELECT wh_lv0210.lv001 AS 'position'
        FROM wh_lv0210
        JOIN wh_lv0207 ON wh_lv0207.lv001 = wh_lv0210.lv002
        JOIN wh_lv0222 ON wh_lv0222.lv001 = wh_lv0207.lv006
        JOIN wh_lv0216 ON wh_lv0216.lv001 = wh_lv0207.lv007
        LEFT JOIN wh_lv0278 AS wh_lv0278_1 ON wh_lv0278_1.lv001 = wh_lv0210.lv005
        LEFT JOIN wh_lv0278 AS wh_lv0278_2 ON wh_lv0278_2.lv001 = wh_lv0210.lv003
        WHERE
            wh_lv0222.lv002 LIKE '$coke'
            AND wh_lv0210.lv005 LIKE '$pallettypeid'
            AND wh_lv0216.lv003 LIKE '$zone'
            AND wh_lv0210.lv003 = 1
            AND wh_lv0207.lv010 LIKE '$wh_id' ";
            break;
        case 'update':
            $query = "UPDATE wh_lv0279
                 SET lv011 = '$position', lv013 = 1, lv009 = '$user06',  lv010 = NOW()
                 WHERE lv001 = '$pallet_id'";
            break;
        case 'update2':
            $query = "UPDATE wh_lv0279
                     SET lv011 = '$position', lv013 = 2, lv009 = '$user06',  lv010 = NOW()
                     WHERE lv001 = '$pallet_id'";
            break;
        default:
            echo json_encode(['error' => 'Invalid function']);
            exit;
    }

    $result = db_query($query);
    if ($result) {
        if ($func === 'select') {
            $vdata = [];
            while ($vrow = db_fetch_array($result)) {
                $vdata[] = $vrow;
            }
            echo json_encode(['data' => $vdata]);
        } else {
            echo json_encode(['success' => true]);
        }
    } else {
        echo json_encode(['error' => 'Database query failed']);
    }
} else {
    if ($token == '')
        echo json_encode(['error' => 'Token missing']);
    else if ($code == '')
        echo json_encode(['error' => 'Code missing']);
    else if ($func == '')
        echo json_encode(['error' => 'Function missing']);
    else if ($wh_id == '')
        echo json_encode(['error' => 'Warehouse ID missing']);
}
