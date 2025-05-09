<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);

// Bao gồm các tệp cấu hình và hàm
include('config.php');
include('function.php');

// Lấy token từ header Authorization
$token = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $token = $_SERVER['HTTP_AUTHORIZATION'];
    // Nếu token có dạng "Bearer token_value", tách lấy phần token_value
    if (strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7); // Lấy phần sau "Bearer "
    }
}

// Lấy token và code từ yêu cầu (có thể từ phương thức POST hoặc GET)
$token = isset($_POST['token']) ? $_POST['token'] : '';
$code = isset($_POST['code']) ? $_POST['code'] : '';
$func = isset($_POST['func']) ? $_POST['func'] : '';
$user06 = isset($_POST['user06']) ? $_POST['user06'] : '';
$wh_id = isset($_POST['wh_id']) ? $_POST['wh_id'] : '';
$pallet_id = isset($_POST['wh_id']) ? $_POST['pallet_id'] : '';
$position = isset($_POST['position']) ? $_POST['position'] : '';
$pallettypeid = isset($_POST['pallettypeid']) ? $_POST['pallettypeid'] : '';
$status = isset($_POST['status']) ? $_POST['status'] : '';
$quantity = isset($_POST['quantity']) ? $_POST['quantity'] : '';
$zone = isset($_POST['zone']) ? $_POST['zone'] : '';
$coke = isset($_POST['coke']) ? $_POST['coke'] : '';
$po = isset($_POST['po']) ? $_POST['po'] : '';
$batch = isset($_POST['batch']) ? $_POST['batch'] : '';

//Công
$name = isset($_POST['name']) ? $_POST['name'] : '';
$batchId = isset($_POST['ma_lo']) ? $_POST['ma_lo'] : '';
$productId = isset($_POST['ma_sp']) ? $_POST['ma_sp'] : '';
$time = isset($_POST['thoi_gian']) ? $_POST['thoi_gian'] : '';

$size = isset($_POST['kich_thuoc']) ? $_POST['kich_thuoc'] : '';
$totalWeight = isset($_POST['khoi_luong_tong']) ? $_POST['khoi_luong_tong'] : '';
$packageWeight = isset($_POST['khoi_luong_vo']) ? $_POST['khoi_luong_vo'] : '';
$actualWeight = isset($_POST['khoi_luong_tinh']) ? $_POST['khoi_luong_tinh'] : '';
$width = isset($_POST['rong']) ? $_POST['rong'] : '';
$length = isset($_POST['dai']) ? $_POST['dai'] : '';
$height = isset($_POST['cao']) ? $_POST['cao'] : '';

// Kiểm tra nếu token và code hợp lệ
if ($token != '' && $code != '') {
    // Log API nào được gọi
    if ($code === '0034') {
        include('wh_lv0034/wh_lv0034.php');
    } elseif ($code === '0279') {
        include('wh_lv0279/wh_lv0279.php');
    } elseif ($code === '0210') {
        include('wh_lv0210/wh_lv0210.php');
    } elseif ($code === '0010') {
        include('wh_lv0010/wh_lv0010.php');
    } elseif ($code === '0001') {
        include('hr_lv0001/hr_lv0001.php');
    } elseif ($code === '0207') {
        include('wh_lv0207/wh_lv0207.php');
    } elseif ($code === '0281') {
        include('wh_lv0281/wh_lv0281.php');
    } else {
        echo "Invalid API code\n";
    }
} else {
    if ($token == '')
        echo json_encode(['error' => 'Token missing']);
    else
        echo json_encode(['error' => 'Code missing']);
}