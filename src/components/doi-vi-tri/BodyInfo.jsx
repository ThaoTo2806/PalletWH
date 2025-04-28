import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateData } from '../../services/doivitri';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, latestScannedData }) {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');

    useEffect(() => {
        if (latestScannedData) {
            const [data1, data2] = latestScannedData.split('|');
            console.log('data1: ', data1);
            console.log('data2: ', data2);
            setInput1(data1);
            setInput2(data2);
        }
    }, [latestScannedData]);

    const isButtonDisabled = !input1 || !input2;

    const updatePallets = async () => {
        const result = await updateData(token, '0279', 'update1', wh_id, user06, input1, input2);
        console.log(result);
        
        if (result.success) {
            Alert.alert('Thông báo', 'Đổi vị trí thành công');
            setInput1('');
            setInput2('');
            fetchPallets();
        } else {
            Alert.alert('Lỗi', result.message);
        }
    };

    return (
        <View>
            <View style={styles.container}>
                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                    onPress={() => updatePallets()}
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.buttonText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
            <View>
                {/* Input 1: "Pallet" */}
                <View style={styles.viewInput}>
                    <Text style={styles.title}>Từ Pallet</Text>
                    <TextInput
                        style={styles.input}
                        value={input1}
                        onChangeText={setInput1}
                    />
                </View>

                {/* Input 2: "Vi tri" */}
                <View style={styles.viewInput}>
                    <Text style={styles.title}>Tới vị trí</Text>
                    <TextInput
                        style={styles.input}
                        value={input2}
                        onChangeText={setInput2}
                    /></View>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: 6,
    },
    viewInput: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
    },
    title: {
        fontSize: 24,
        color: '#b3b3b3',
        fontWeight: 'bold',
    },
    input: {
        color: '#737373',
        width: '70%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 20,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    button: {
        width: '100%',
        height: 60,
        backgroundColor: '#6600ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
});
