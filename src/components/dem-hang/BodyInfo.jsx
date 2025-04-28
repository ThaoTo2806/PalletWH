import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { loadData } from '../../services/demhang';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, latestScannedData }) {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [sl, setSLs] = useState('');

    useEffect(() => {
        if (latestScannedData) {
            const [data1, data2] = latestScannedData.split('|');
            setInput1(data1);
            setInput2(data2);
        }
    }, [latestScannedData]);

    const isButtonDisabled = !input1 || !input2;

    const selectItems = async () => {
        const result = await loadData(token, '0279', 'select1', wh_id, input1);
        //]console.log(result.data.data);
        //console.log(Array.isArray(result.data.data));


        if (result.success && Array.isArray(result.data.data)) {
            const processedBoxes = result.data.data.map(item => ({
                id: item[0],
                netWeight: item[1],
                grossWeight: item[2],
            }));
            setBoxes(processedBoxes);
            setSLs(processedBoxes.length.toString());
        } else {
            Alert.alert('Error', result.message || 'No data found');
        }
    };

    return (
        <View>
            <View style={styles.container}>
                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                    onPress={() => selectItems()}
                    disabled={isButtonDisabled}
                >
                    <Text style={styles.buttonText}>SUBMIT</Text>
                </TouchableOpacity>
            </View>

            <View>
                {/* Input 1: "Tu Pallet" */}
                <View style={styles.viewInput}>
                    <Text style={styles.title}>Pallet</Text>
                    <TextInput
                        style={styles.input}
                        value={input1}
                        onChangeText={setInput1}
                        editable={false}
                    />
                </View>

                {/* Input 2: "Tu vi tri" */}
                <View style={styles.viewInput}>
                    <Text style={styles.title}>Vị trí</Text>
                    <TextInput
                        style={styles.input}
                        value={input2}
                        onChangeText={setInput2}
                        editable={false}
                    />
                </View>
            </View>

            {/* Thung List */}
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Thùng: {sl}</Text>
            </View>

            {/* Render Box List */}
            <ScrollView style={styles.boxContainer}>
                <View style={styles.boxHeader}>
                    <Text style={styles.boxColumnHeader}>ID</Text>
                    <Text style={styles.boxColumnHeader}>Net Weight</Text>
                    <Text style={styles.boxColumnHeader}>Gross Weight</Text>
                </View>
                {boxes.map((box, index) => (
                    <View key={index} style={styles.boxRow}>
                        <Text style={styles.boxColumn}>{box.id}</Text>
                        <Text style={styles.boxColumn}>{box.netWeight}</Text>
                        <Text style={styles.boxColumn}>{box.grossWeight}</Text>
                    </View>
                ))}
            </ScrollView>
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
    titleView: {
        width: '100%',
        backgroundColor: '#d9d9d9',
        height: 50,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    titleText: {
        color: '#737373',
        fontSize: 26,
        fontWeight: 'bold',
    },
    boxContainer: {
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    boxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    boxColumnHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        width: '30%',
        textAlign: 'center',
        color: '#737373',
    },
    boxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    boxColumn: {
        fontSize: 16,
        width: '30%',
        textAlign: 'center',
    },
});
