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
            $vsql = "SELECT `wh_lv0281`.`lv001` AS 'lv002', `wh_lv0279`.`lv006` AS 'lv003', `wh_lv0279`.`lv007` AS 'lv005', `wh_lv0281`.`lv002` AS 'lv006'
FROM `wh_lv0279`
lEFT JOIN `wh_lv0280` ON `wh_lv0279`.`lv001` = `wh_lv0280`.`lv002`
lEFT JOIN `wh_lv0281` ON `wh_lv0281`.`lv001` = `wh_lv0280`.`lv003`
WHERE `wh_lv0279`.`lv001` LIKE '$pallet_id'";
            break;

        case 'select2':
            $vsql = "SELECT `lv002`, `lv003`, `lv008`
                         FROM `wh_lv0279`
                         WHERE `lv001` LIKE '$pallet_id'";
            break;

        case 'update':
            $query1 = "SELECT wh_lv0281.lv002 AS lv006, wh_lv0281.lv005 AS lv007
                           FROM wh_lv0279
                           LEFT JOIN wh_lv0280 ON wh_lv0279.lv001 = wh_lv0280.lv002
                           LEFT JOIN wh_lv0281 ON wh_lv0281.lv001 = wh_lv0280.lv003
                           WHERE wh_lv0279.lv001 LIKE '$pallet_id'";
            $res1 = db_query($query1);

            $debugInfo = []; // Mảng lưu thông tin debug

            if ($res1 && db_num_rows($res1) > 0) {
                $allSuccess = true;

                while ($row1 = db_fetch_array($res1)) {
                    $A = $row1['lv006'];
                    $B = $row1['lv007'];

                    $query2 = "SELECT lv002 FROM wh_lv0009 WHERE lv003 LIKE '$B' AND lv014 LIKE '$A'";
                    $res2 = db_query($query2);

                    if ($res2 && db_num_rows($res2) > 0) {
                        $row2 = db_fetch_array($res2);
                        $C = $row2['lv002'];

                        // $query3 = "SELECT count(*) AS SL FROM wh_lv0279
                        //            LEFT JOIN wh_lv0280 ON wh_lv0279.lv001 = wh_lv0280.lv002
                        //            LEFT JOIN wh_lv0281 ON wh_lv0281.lv001 = wh_lv0280.lv003
                        //            WHERE wh_lv0279.lv001 LIKE '$pallet_id'";
                        // $res3 = db_query($query3);
                        // $row3 = db_fetch_array($res3);
                        // $SL = $row3['SL'];

                        $currentDate = date("Ymd");
                        $lv888 = "NK_PALLET_" . $currentDate . "_" . $C;
                        $update0008 = "UPDATE wh_lv0279
                                 SET lv555 = '$lv888'
                                 WHERE lv001 = '$pallet_id'";

                        // $update0008 = "UPDATE wh_lv0008 
                        //                SET lv777 = lv777 + $SL, lv888 = '$lv888' 
                        //                WHERE lv001 = '$C'";
                        $res4 = db_query($update0008);

                        // Ghi debug
                        $debugInfo[] = [
                            'A' => $A,
                            'B' => $B,
                            'C' => $C,
                            'SL' => $SL,
                            'SQL' => $update0008,
                            'update0008_success' => $res4 ? true : false
                        ];

                        if (!$res4) {
                            echo json_encode([
                                'error' => 'Cập nhật wh_lv0008 thất bại',
                                'debug' => $debugInfo
                            ]);
                            $allSuccess = false;
                            break;
                        }
                    } else {
                        $debugInfo[] = [
                            'A' => $A,
                            'B' => $B,
                            'C' => null,
                            'SL' => null,
                            'SQL' => null,
                            'update0008_success' => false,
                            'reason' => "Không tìm thấy bản ghi trong wh_lv0009 với A=$A và B=$B"
                        ];
                        echo json_encode([
                            'error' => "Không tìm thấy bản ghi phù hợp trong wh_lv0009",
                            'debug' => $debugInfo
                        ]);
                        $allSuccess = false;
                        break;
                    }
                }

                if ($allSuccess) {
                    $vsql = "UPDATE wh_lv0279
                                 SET lv013 = 2, lv009 = '$user06', lv010 = NOW()
                                 WHERE lv001 = '$pallet_id'";
                }
            } else {
                echo json_encode([
                    'error' => 'Không có dữ liệu từ query1',
                    'debug' => $debugInfo
                ]);
            }
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