import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

const QRCodeComponent = React.forwardRef((props, ref) => {
    useEffect(() => {
        // Kiểm tra và log ref khi QRCodeComponent được render
        console.log('QRCodeComponent is rendered', ref.current);
    }, [ref]); // Chỉ log lại khi ref thay đổi

    return (
        <View ref={ref}>
            <QRCode
                value={typeof props.value === 'string' ? props.value : JSON.stringify(props.value)}
                size={100}
            />
        </View>
    );
});

export default QRCodeComponent;