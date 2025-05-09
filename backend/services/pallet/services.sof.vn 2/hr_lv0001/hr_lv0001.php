<?php
include('../config.php');
include('../function.php');

$code = isset($code) ? $code : '';

if ($code != '') {
    $vsql = "SELECT lv002, lv099 FROM hr_lv0001";

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
    echo json_encode(['error' => 'Code missing']);
}
