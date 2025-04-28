<?php

include('../config.php');
include('../function.php');

// Lấy token và code được truyền từ index.php
$token = isset($token) ? $token : '';
$code = isset($code) ? $code : '';
$user06 = isset($user06) ? $user06 : '';
$wh_id = isset($wh_id) ? $wh_id : '';
$func = isset($func) ? $func : '';
$status = isset($status) ? $status : '';
$po = isset($po) ? $po : '';
if ($token != '' && $code != '' && $func != '' && $wh_id != '') {
    switch ($func) {
        case 'select':
            $query = "
            SELECT lv001, lv006 FROM `wh_lv0010` WHERE lv002 = '$wh_id ' AND lv013 = '$status'";
            break;
        case 'selectDetail':
            $query = "SELECT wh_lv0279.lv001,  wh_lv0216.lv003
                      FROM `wh_lv0279` join wh_lv0216
                      on wh_lv0216.lv001 = wh_lv0279.lv012
                      WHERE lv014 = '$po'";
            break;
        case 'select2':
            $query = "SELECT wh_lv0279.lv011, wh_lv0279.lv014 
                      FROM `wh_lv0279` 
                      join wh_lv0010 on wh_lv0010.lv006 = wh_lv0279.lv014
                      WHERE wh_lv0279.lv014 IS NOT NULL AND wh_lv0010.lv002 = '$wh_id' AND wh_lv0010.lv013 = '$status'";
            break;
        default:
            echo json_encode(['error' => 'Invalid function']);
            exit;
    }

    $result = db_query($query);
    if ($result) {
        if ($func === 'select' || $func === 'selectDetail' || $func === 'select2') {
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
