<?php
include('../config.php');
include('../function.php');

// SQL query to get distinct lv001 (mã line)
$sqlS = "SELECT DISTINCT lv001 FROM wh_lv0207 WHERE 1=1";

$bResult = db_query($sqlS);
$data = [];

while ($vrow = db_fetch_array($bResult)) {
    $lv001 = $vrow['lv001']; // Mã Line

    // Get faces (lv005) for the line (A/B)
    $sqlFaces = "SELECT * FROM wh_lv0207 WHERE lv001 = '$lv001'";
    $facesResult = db_query($sqlFaces);

    $faces = [];
    while ($faceRow = db_fetch_array($facesResult)) {
        $faces[$faceRow['lv005']] = $faceRow;
    }

    $lineData = [
        'lv001' => $lv001,
        'faces' => [],
    ];

    foreach (['A', 'B'] as $side) {
        if (isset($faces[$side])) {
            $f = $faces[$side];
            $lv003 = (int)$f['lv003']; // số tầng
            $lv004 = (int)$f['lv004']; // số cột
            $lv010 = $f['lv010'];      // Mã kho
            $lv002 = $f['lv002'];      // Mã tổ hợp vị trí

            $sideData = [
                'side' => $side,
                'floors' => $lv003,
                'columns' => $lv004,
                'positions' => [],
            ];

            for ($row = 1; $row <= $lv003; $row++) {
                for ($col = 1; $col <= $lv004; $col++) {
                    $sqlS2 = "SELECT * FROM wh_lv0210 
                              WHERE lv002 = '$lv001' 
                              AND lv001 LIKE '{$lv002}%-{$lv001}-%{$col}-%{$row}-%{$side}%'";
                    $bResult2 = db_query($sqlS2);
                    $vrow2 = db_fetch_array($bResult2);

                    $squareColor = "#ddd"; // default
                    if ($vrow2['lv003'] == 0) {
                        $squareColor = "#ffb3b3"; // đỏ nhạt
                    } elseif ($vrow2['lv003'] == 1) {
                        switch ($vrow2['lv004']) {
                            case 0: $squareColor = "#e6e6e6"; break; // xám
                            case 1: $squareColor = "#e6e600"; break; // vàng
                            case 2: $squareColor = "#00cc00"; break; // xanh
                        }
                    }

                    // Lấy danh sách sản phẩm chi tiết
                    $sqlS3 = "SELECT 
                        wh_lv0281.lv005 AS lv003, 
                        sl_lv0007.lv002 AS lv002, 
                        wh_lv0279.lv001 AS lv001,
                        COUNT(wh_lv0281.lv002) AS lv004, 
                        SUM(wh_lv0281.lv003) AS lv005
                    FROM 
                        wh_lv0279
                    JOIN 
                        wh_lv0280 ON wh_lv0279.lv001 = wh_lv0280.lv002
                    JOIN 
                        wh_lv0281 ON wh_lv0281.lv001 = wh_lv0280.lv003
                    JOIN 
                        sl_lv0007 ON sl_lv0007.lv001 = wh_lv0281.lv005
                    WHERE 
                        wh_lv0279.lv011 LIKE '{$vrow2['lv001']}'
                        AND wh_lv0281.lv006 LIKE '$lv010'
                    GROUP BY 
                        wh_lv0281.lv005, sl_lv0007.lv002, wh_lv0279.lv001";

                    $bResult3 = db_query($sqlS3);
                    $lv003_list = '';
                    $detailsHTML = '';

                    while ($vrow3 = db_fetch_array($bResult3)) {
                        if (!empty($lv003_list)) {
                            if (strpos($lv003_list, $vrow3['lv001']) === false) {
                                $lv003_list .= ' | ' . $vrow3['lv001'];
                            }
                        } else {
                            $lv003_list .= $vrow3['lv001'];
                        }

                        $detailsHTML .= $vrow3['lv003'].'|'.$vrow3['lv002'].'|'.$vrow3['lv004'].'|'.$vrow3['lv005'];
                    }

                    $sideData['positions'][] = [
                        'color' => $squareColor,
                        'lv001_2' => $vrow2['lv001'],
                        'product_list' => $lv003_list,
                        'details_html' => $detailsHTML,
                    ];
                }
            }

            $lineData['faces'][$side] = $sideData;
        }
    }

    $data[] = $lineData;
}

// Return the data as JSON
echo json_encode(!empty($data) ? $data : ['error' => 'No data found for the provided lv001']);
