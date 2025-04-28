<?php

include('../config.php');
include('../function.php');

// Lấy token và code được truyền từ index.php
$token = isset($token) ? $token : '';
$code = isset($code) ? $code : '';
$func = isset($func) ? $func : '';
$user06 = isset($user06) ? $user06 : '';
$wh_id = isset($wh_id) ? $wh_id : '';
$pallet_id = isset($pallet_id) ? $pallet_id : '';
$position = isset($position) ? $position : '';
$pallettypeid = isset($pallettypeid) ? $pallettypeid : '';
$status = isset($status) ? $status : '';
$quantity = isset($quantity) ? $quantity : '';

// Kiểm tra nếu token và code hợp lệ
if ($token != '' && $code != '' && $func != '' && $wh_id != '') {
    switch ($func) {
        case 'select':
            $vsql = "SELECT lv001,lv011 
                     FROM `wh_lv0279` 
                     WHERE SUBSTRING_INDEX(lv001, '-', 1) = '$wh_id' AND lv013 = 1";
            break;

        case 'select1':
            $vsql = "SELECT `wh_lv0281`.lv001, `wh_lv0281`.lv003, `wh_lv0281`.lv004
                     FROM `wh_lv0281`
                     JOIN `wh_lv0280` ON `wh_lv0281`.`lv001` = `wh_lv0280`.`lv003`
                     WHERE `wh_lv0280`.`lv002` LIKE '$pallet_id'";
            break;

        case 'select2':
            $vsql = "SELECT `lv002`, `lv003`
                         FROM `wh_lv0279`
                         WHERE `lv001` LIKE '$pallet_id'";
            break;

        case 'update':
            $vsql = "UPDATE `wh_lv0279`
                     SET `lv013` = 2, `lv009` = '$user06',  `lv010` = NOW()
                     WHERE `lv001` = '$pallet_id'";
            break;

        case 'update1':
            // Bước 1: Kiểm tra xem vị trí có tồn tại trong kho hay không
            $checkPositionExistSQL = "SELECT count(*) FROM `wh_lv0210` WHERE lv001 = '$position'";
            $checkPositionExistResult = db_query($checkPositionExistSQL);

            // Nếu không tìm thấy vị trí, báo lỗi
            $positionExistRow = db_fetch_array($checkPositionExistResult);
            if ($positionExistRow[0] == 0) {
                echo json_encode(['error' => 'Vị trí này không có trong kho']);
                exit;
            }

            // Bước 2: Tiến hành kiểm tra trường `lv004`
            $checkPositionSQL = "SELECT lv004 FROM `wh_lv0210` WHERE lv001 = '$position'";
            $checkResult = db_query($checkPositionSQL);

            if ($checkResult) {
                $checkRow = db_fetch_array($checkResult);

                // Bước 3: Kiểm tra giá trị của `lv004` để quyết định tiếp tục
                if ($checkRow['lv004'] == 0 || $checkRow['lv004'] == 1) {
                    // Cập nhật thông tin nếu điều kiện thỏa mãn
                    $vsql = "UPDATE `wh_lv0279`
                                     SET `lv011` = '$position', `lv009` = '$user06', `lv010` = NOW()
                                     WHERE `lv001` = '$pallet_id'";
                } else {
                    echo json_encode(['error' => 'Vị trí đã đầy']);
                    exit;
                }
            } else {
                echo json_encode(['error' => 'Vị trí không hợp lệ']);
                exit;
            }
            break;


        case 'update2':
            $vsql = "UPDATE `wh_lv0279`
                         SET `lv002` = '$pallettypeid', `lv003` = '$status', `lv004` = '$quantity', `lv009` = '$user06',  `lv010` = NOW()
                         WHERE `lv001` = '$pallet_id'";
            break;

        default:
            echo json_encode(['error' => 'Invalid function']);
            exit;
    }
    $vresult = db_query($vsql);
    if ($vresult) {
        if ($func === 'select' || $func === 'select1' || $func === 'select2') {
            $vdata = [];
            while ($vrow = db_fetch_array($vresult)) {
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
    else if ($position == '')
        echo json_encode(['error' => 'Position missing']);
}
