import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, latestScannedData, onTriggerScan })  {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');

    useEffect(() => {
            if (latestScannedData) {
                const [data1, data2, data3] = latestScannedData.split('|');
                setInput1(data1);
                setInput2(data2);
                setInput3(data3);
            }
        }, [latestScannedData]);

    return (
        <View>
            {/* Input 1: "Thùng" */}
            <View style={styles.viewInput}>
                <Text style={styles.title}>Thùng</Text>
                <TextInput
                    style={styles.input1}
                    value={input1}
                    onChangeText={setInput1}
                />
            </View>

            {/* Input 2: "Vị trí" */}
            <View style={styles.viewInput}>
                <Text style={styles.title}>Vị trí</Text>
                <TextInput
                    style={styles.input1}
                    value={input2}
                    onChangeText={setInput2}
                />
            </View>

            {/* Input 3: "Pallet" */}
            <View style={styles.viewInput}>
                <Text style={styles.title}>Pallet</Text>
                <TextInput
                    style={styles.input3}
                    value={input3}
                    onChangeText={setInput3}
                    editable={false}
                    multiline={true}
                    numberOfLines={4}
                />
            </View>


            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#d3d3d3' }]}  onPress={() => {
                                                    onTriggerScan();
                                                }}>
                        <Text style={styles.buttonText}>QUÉT LẠI</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button1}
                    >
                        <Text style={styles.buttonText}>IN LẠI</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#b3b3b3',
        fontWeight: 'bold',
    },
    input: {
        color: '#737373',
        width: '70%',
        height: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 20,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    input1: {
        color: '#737373',
        width: '75%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 20,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    input3: {
        color: '#737373',
        width: '80%',
        height: 50,
        fontSize: 20,
        marginLeft: 10,
        paddingHorizontal: 10,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '80%',
        padding: 20,
        borderRadius: 10,
    },
    modalOption: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalText: {
        fontSize: 18,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    buttonContainer: {
        width: '50%',
    },
    button: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button1: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b3b3b3',
        marginLeft: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
