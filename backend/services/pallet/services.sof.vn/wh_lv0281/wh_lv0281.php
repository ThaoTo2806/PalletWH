<?php

include('../config.php');
include('../function.php');

// Lấy token và code được truyền từ index.php
$token = isset($token) ? $token : '';
$code = isset($code) ? $code : '';
$func = isset($func) ? $func : '';
$name = isset($name) ? $name : '';
$batchId = isset($batchId) ? $batchId : '';
$productId = isset($productId) ? $productId : '';
$time = isset($time) ? $time : '';

$size = isset($size) ? $size : '';
$totalWeight = isset($totalWeight) ? $totalWeight : '';
$packageWeight = isset($packageWeight) ? $packageWeight : '';
$actualWeight = isset($actualWeight) ? $actualWeight : '';
$width = isset($width) ? $width : '';
$length = isset($length) ? $length : '';
$height = isset($height) ? $height : '';

// Kiểm tra nếu token và code hợp lệ
if ($token != '' && $code != '' && $func != '') {
    switch ($func) {
        case 'getListBatchId':
            $vsql = "SELECT DISTINCT lv001 FROM wh_lv0020 WHERE lv001 IS NOT NULL AND TRIM(lv001) <> ''";
            break;
        case 'getListProductByName':
            $escapedName = mysqli_real_escape_string(db_connect(), $name);
            $vsql = "SELECT DISTINCT lv001, lv002 FROM sl_lv0007 WHERE lv002 LIKE '%" . $escapedName . "%' LIMIT 100";
            break;
        case 'getBoxId':
            $escapedBatchId = mysqli_real_escape_string(db_connect(), $batchId);
            $escapedProductId = mysqli_real_escape_string(db_connect(), $productId);
            $vsql = "SELECT lv001 FROM wh_lv0281 WHERE lv002 = '" . $escapedBatchId . "' AND lv005 = '" . $escapedProductId . "' AND lv008 = '" . $time . "' ORDER BY lv001 DESC LIMIT 1";
            break;
        case 'addBox':
            $escapedBatchId = mysqli_real_escape_string(db_connect(), $batchId);
            $escapedProductId = mysqli_real_escape_string(db_connect(), $productId);
            $escapedSize = mysqli_real_escape_string(db_connect(), $size);
            $escapedTotalWeight = mysqli_real_escape_string(db_connect(), $totalWeight);
            $escapedPackageWeight = mysqli_real_escape_string(db_connect(), $packageWeight);
            $escapedActualWeight = mysqli_real_escape_string(db_connect(), $actualWeight);
            $escapedWidth = mysqli_real_escape_string(db_connect(), $width);
            $escapedLength = mysqli_real_escape_string(db_connect(), $length);
            $escapedHeight = mysqli_real_escape_string(db_connect(), $height);

            $vsql = "INSERT INTO wh_lv0281 (lv002, lv003, lv004, lv005, lv008, lv009, lv010, lv016, lv017, lv018) VALUES ('" . $escapedBatchId . "', '" . $escapedTotalWeight . "', '" . $size . "', '" . $escapedProductId . "', '" . $time . "', '" . $escapedPackageWeight . "', '" . $escapedActualWeight . "', '" . $escapedWidth . "', '" . $escapedLength . "', '" . $escapedHeight . "')";
            break;
        default:
            echo json_encode(['error' => 'Invalid function']);
            exit;
    }

    $vresult = db_query($vsql);
    if ($vresult) {
        if ($func === 'getListBatchId' || $func === 'getListProductByName' || $func === 'getBoxId') {
            $vdata = [];
            while ($vrow = db_fetch_assoc($vresult)) {
                $vdata[] = $vrow;
            }
            echo json_encode($vdata);
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
