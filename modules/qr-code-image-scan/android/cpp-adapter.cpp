#include <jni.h>
#include "react-native-qr-code-image-scan.h"

extern "C"
JNIEXPORT jdouble JNICALL
Java_com_qrcodeimagescan_QrCodeImageScanModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return qrcodeimagescan::multiply(a, b);
}
