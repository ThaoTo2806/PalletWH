// QRCodeGenerator.js

import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';

const QRCodeGenerator = ({ value, onCapture }) => {
    const qrCodeRef = useRef();

    useEffect(() => {
        const captureQRCode = async () => {
            try {
                const uri = await captureRef(qrCodeRef, {
                    format: 'png',
                    quality: 1.0,
                });
                const base64 = uri.split(',')[1]; // Extract base64 part from the data URI
                onCapture(base64);
            } catch (error) {
                console.error("Error capturing QR code:", error);
            }
        };

        captureQRCode();
    }, [value]);

    return (
        <View ref={qrCodeRef}>
            <QRCode
                value={value}
                size={200}
                backgroundColor="white"
                color="black"
            />
        </View>
    );
};

export default QRCodeGenerator;
