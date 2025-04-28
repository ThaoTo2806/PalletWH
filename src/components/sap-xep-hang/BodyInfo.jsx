import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loadData } from '../../services/demhang';
import { loadData1, updateData } from '../../services/sapxephang';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, latestScannedData }) {
    const [input1, setInput1] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [selectedPallet, setSelectedPallet] = useState('');
    const [selectedItemCode, setSelectedItemCode] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [sl, setSLs] = useState('');

    const palletOptions = ['1 thùng', '16 thùng', '32 thùng', 'Khác'];
    const itemCodeOptions = ['1 mã hàng', 'Nhiều mã hàng'];

    useEffect(() => {
        if (latestScannedData) {
            const [data1, data2] = latestScannedData.split('|');
            setInput1(data1);
        }
    }, [latestScannedData]);

    //const isButtonDisabled = !input1;

    useEffect(() => {
        setIsButtonDisabled(!input1);
    }, [input1]);

    const selectItems = async () => {
        const result = await loadData(token, '0279', 'select1', wh_id, input1);
        const result1 = await loadData1(token, '0279', 'select2', wh_id, input1);
        //console.log(result1.data.data[0].lv003);
        //console.log(Array.isArray(result.data.data));


        if (result.success && Array.isArray(result.data.data)) {
            const processedBoxes = result.data.data.map(item => ({
                id: item[0],
                netWeight: item[1],
                grossWeight: item[2],
            }));
            setBoxes(processedBoxes);
            setSLs(processedBoxes.length.toString());
            //console.log("rrrrr: ", result1.data.data[0]);
            const lv002 = result1.data.data[0].lv002;
            const lv003 = result1.data.data[0].lv003;
            //console.log("lv002: ", lv002);
            //console.log("lv003: ", lv003);
            if (lv003 == 0) {
                setSelectedItemCode('1 mã hàng');
            } else if (lv003 == 1) {
                setSelectedItemCode('Nhiều mã hàng');
            }

            if (lv002 === '01C') {
                setSelectedPallet('1 thùng');
            } else if (lv002 === '16C') {
                setSelectedPallet('16 thùng');
            } else if (lv002 === '32C') {
                setSelectedPallet('32 thùng');
            } else if (lv002 === 'LOẠI KHÁC' || lv002 === 'DNM') {
                setSelectedPallet('Khác');
            }
        } else {
            Alert.alert('Error', result.message || 'No data found');
        }
        setIsSubmitClicked(true); 
    };

    const updateItems = async () => {
        let pallettypeid = null; // Use let or const
        let quantity = 0; // Use let or const
        let status = 0; // Initialize status properly
    
        if (selectedItemCode === '1 mã hàng') {
            status = 0;
        } else {
            status = 1;
        }
    
        if (selectedPallet === '1 thùng') {
            if (sl > 1) {
                Alert.alert('Error', 'Vui lòng chọn loại pallet khác');
                return; // Exit the function if there's an error
            } else {
                pallettypeid = '01C'; // Use assignment operator
                quantity = 1;
            }
        } else if (selectedPallet === '16 thùng') {
            if (sl > 16) {
                Alert.alert('Error', 'Vui lòng chọn loại pallet khác');
                return; // Exit the function if there's an error
            } else {
                pallettypeid = '16C'; // Use assignment operator
                quantity = 16 - sl;
            }
        } else if (selectedPallet === '32 thùng') {
            if (sl > 32) {
                Alert.alert('Error', 'Vui lòng chọn loại pallet khác');
                return; // Exit the function if there's an error
            } else {
                pallettypeid = '32C'; // Use assignment operator
                quantity = 32 - sl;
            }
        } else {
            pallettypeid = 'DNM'; // Use assignment operator
            quantity = 48 - sl;
        }
    
        const result = await updateData(token, '0279', 'update2', wh_id, input1, pallettypeid, status, quantity);
    
        if (result.success) {
            setIsButtonDisabled(true);
            setIsSubmitClicked(false);
            Alert.alert('Thông báo', 'Cập nhật dữ liệu thành công');
        } else {
            Alert.alert('Error', result.message || 'No data found');
        }
    };

    return (
        <View style={styles.container}>
            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                onPress={() => (isSubmitClicked ? updateItems() : selectItems())}
                disabled={isButtonDisabled}
            >
                <Text style={styles.buttonText}>{isSubmitClicked ? 'UPDATE' : 'SUBMIT'}</Text>
            </TouchableOpacity>

            {/* Input 1: "Pallet" */}
            <View style={styles.viewInput}>
                <Text style={styles.title}>Pallet:</Text>
                <TextInput
                    style={styles.input}
                    value={input1}
                    onChangeText={setInput1}
                />
            </View>

            <View style={styles.optionsContainer}>
                {/* Pallet Options */}
                <View style={styles.optionContainer}>
                    {palletOptions.map((option, index) => (
                        <View key={index} style={styles.optionRow}>
                            <TouchableOpacity onPress={() => setSelectedPallet(option)} style={styles.optionButton}>
                                <Icon
                                    name={selectedPallet === option ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                                    size={30}
                                    color={selectedPallet === option ? '#6600ff' : '#737373'}
                                />
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Item Code Options */}
                <View style={styles.optionContainer}>
                    {itemCodeOptions.map((option, index) => (
                        <View key={index} style={styles.optionRow}>
                            <TouchableOpacity onPress={() => setSelectedItemCode(option)} style={styles.optionButton}>
                                <Icon
                                    name={selectedItemCode === option ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                                    size={30}
                                    color={selectedItemCode === option ? 'blue' : '#737373'}
                                />
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>

            {/* Thùng List */}
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Thùng: {sl}</Text>
            </View>

            {/* Render Box List */}
            <View style={styles.boxContainer}>
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
        fontSize: 26,
        color: '#737373',
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    optionContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionText: {
        fontSize: 18,
        color: '#737373',
        marginLeft: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
        width: '32%',
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
