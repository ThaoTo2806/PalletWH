import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import { loadData } from '../../services/demhang';
import { loadData1 } from '../../services/sapxephang';
import { loadData2, updateData } from '../../services/nhansanpham';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, latestScannedData, onTriggerScan }) {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedPallet, setSelectedPallet] = useState('');
    const [selectedItemCode, setSelectedItemCode] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [sl, setSLs] = useState('');
    const [productQuality, setProductQuality] = useState(0);
    const [isSelected2, setIsSelected2] = useState(false);
    const [scanAgain, setScanAgain] = useState(false);
    const [positions, setPositions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const positionOptions = ['Đưa lên kệ', 'Để dưới đất'];
    const palletOptions = ['1 thùng', '16 thùng', '32 thùng', 'Khác'];
    const itemCodeOptions = ['1 mã hàng', 'Nhiều mã hàng'];

    useEffect(() => {

        console.log('Form Submitted: ', scanAgain);
        if (latestScannedData) {
            console.log('latestScannedData:', latestScannedData);
            const [data1, data2] = latestScannedData.split('|');
            console.log('data1:', data1, 'data2:', data2);
            setInput2(data1);
            selectItems();
        }
    }, [latestScannedData]);

    useEffect(() => {
        selectItems();
    }, [input2]);

    const isButtonDisabled = !input1;
    const isButtonDisabled1 = !selectedPosition;

    const selectItems = async () => {
        const result = await loadData(token, '0279', 'select1', wh_id, input2);
        const result1 = await loadData1(token, '0279', 'select2', wh_id, input2);
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
            if (processedBoxes.length == 0) {
                setScanAgain(true);
            } else {
                setScanAgain(false);
            }

            const lv002 = result1.data.data[0].lv002;
            const lv003 = result1.data.data[0].lv003;

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
            } else if (lv002 === 'LOẠI KHÁC') {
                setSelectedPallet('Khác');
            }
        } else {
            Alert.alert('Error', result.message || 'No data found');
        }
    };

    const selectPositionList = async () => {
        setIsLoading(true);
        let coke = null;
        let zone = null;
        let pallettypeid = null;
        //console.log(selectedPosition);


        if (selectedPosition === 'Đưa lên kệ') {
            coke = 'CÓ KỆ';
        } else {
            coke = 'KHÔNG KỆ';
        }

        if (isSelected2) {
            zone = 'SHIPPING LANE';
        } else {
            zone = 'THÀNH PHẨM';
        }

        if (selectedPallet === '1 thùng') {
            pallettypeid = '01C';
        } else if (selectedPallet === '16 thùng') {
            pallettypeid = '16C';
        } else if (selectedPallet === '32 thùng') {
            pallettypeid = '32C';
        } else if (selectedPallet === 'Khác') {
            pallettypeid = 'DNM';
        }

        //console.log(token, wh_id, coke, zone, pallettypeid);

        const result = await loadData2(token, '0210', 'select', wh_id, coke, zone, pallettypeid);
        //console.log(result);
        //console.log(Object.keys(result.data).length);
        //console.log(Object.keys(result.data));
        if (Object.keys(result.data).length == 0) {
            Alert.alert('Thông báo', 'Không có vị trí phù hợp');
        } else {
            if (result.success) {
                setPositions(Object.entries(result.data));
                Alert.alert('Thông báo', 'Lấy dữ liệu thành công');
            } else {
                Alert.alert('Error', result.message || 'No data found');
            }
        }

        setIsLoading(false);
    };

    const handlePalletSelect = (key, value) => {
        setInput1(value);
        setShowModal(false);
    };

    const updatePositions = async () => {

        //console.log('input2:', input2);
        //console.log('input1:', input1);
        const result = await updateData(token, '0210', 'update', wh_id, user06, input2, input1);
        if (result.success) {
            Alert.alert('Thông báo', 'Nhận sản phẩm thành công');
            setInput1('');
            setInput2('');
            setIsSelected2(false);
            setScanAgain(false);
            setShowModal(false);
            setSelectedPosition('');
            setPositions([]);
        } else {
            Alert.alert('Lỗi', result.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                        disabled={isButtonDisabled}
                        onPress={() => updatePositions()}
                    >
                        <Text style={styles.buttonText}>SUBMIT</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled1 && styles.buttonDisabled]}
                        onPress={() => selectPositionList()}
                        disabled={isButtonDisabled1}
                    >
                        <Text style={styles.buttonText}>TẢI VỊ TRÍ</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.optionsContainer}>
                {positionOptions.map((option, index) => (
                    <View key={index} style={styles.optionItem}>
                        <TouchableOpacity onPress={() => setSelectedPosition(option)} style={styles.optionButton1}>
                            <Icon
                                name={selectedPosition === option ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                                size={30}
                                color={selectedPosition === option ? '#6600ff' : '#737373'}
                            />
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>


            {/* Input 1: "Vị trí" */}
            <View style={styles.viewInput1}>
                <Text style={styles.title}>Vị trí:</Text>
                <TextInput
                    style={styles.input}
                    value={input1}
                    onChangeText={setInput1}
                    editable={false}
                />
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <Icon name="caret-down-outline" size={15} color="#737373" />
                </TouchableOpacity>
                <View style={styles.optionRow1}>
                    <TouchableOpacity onPress={() => setIsSelected2(!isSelected2)} style={styles.optionButton}>
                        <Icon
                            name={isSelected2 ? 'checkbox' : 'square-outline'}
                            size={20}
                            color={isSelected2 ? 'blue' : '#737373'}
                        />
                        <Text style={styles.optionText1}>Hàng gấp</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.viewInput}>
                <Text style={styles.title}>Số thùng: </Text>
            </View>

            <View style={styles.optionsContainer}>
                {/* Pallet Options */}
                <View style={styles.optionContainer}>
                    {palletOptions.map((option, index) => (
                        <View key={index} style={styles.optionRow}>
                            <TouchableOpacity onPress={() => setSelectedPallet(option)} style={[styles.optionButton, { pointerEvents: 'none' }]}>
                                <Icon
                                    name={selectedPallet === option ? 'radio-button-on-outline' : 'radio-button-off-outline'}
                                    size={30}
                                    color={selectedPallet === option ? '#6600ff' : '#737373'}
                                />
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.button, scanAgain ? styles.buttonDisabled : null]}
                        onPress={() => {
                            onTriggerScan();
                        }}
                    >
                        <Text style={styles.buttonText}>QUẸT LẠI</Text>
                    </TouchableOpacity>
                </View>

                {/* Item Code Options */}
                <View style={styles.optionContainer}>
                    {itemCodeOptions.map((option, index) => (
                        <View key={index} style={styles.optionRow}>
                            <TouchableOpacity onPress={() => setSelectedItemCode(option)} style={[styles.optionButton, { pointerEvents: 'none' }]}>
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
                <Text style={styles.titleText}>Thùng: {sl} </Text>
                <View style={styles.rightSide}>
                    <Text style={styles.titleText}>
                        Hàng hỏng: <Text style={styles.titleText1}>{productQuality}</Text>
                    </Text>
                </View>
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

            {/* Modal to select Pallet */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {isLoading ? (
                            <Text>Loading...</Text>
                        ) : (
                            <FlatList
                                data={positions}
                                keyExtractor={(item) => item[0]}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.modalOption}
                                        onPress={() => handlePalletSelect(item[0], item[1])}
                                    >
                                        <Text style={styles.modalText}>{item[1]}</Text>
                                    </TouchableOpacity>
                                )}
                            />

                        )}
                    </View>
                </View>
            </Modal>
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
    viewInput1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        color: '#737373',
        fontWeight: 'bold',
    },
    input: {
        color: '#737373',
        width: '50%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        fontSize: 20,
        marginLeft: 10,
    },
    button: {
        width: '100%',
        height: 50,
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
        flexDirection: 'row',
        height: 60,
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        color: '#737373',
        fontSize: 26,
        fontWeight: 'bold',
    },
    titleText1: {
        color: 'red',
        fontSize: 26,
        fontWeight: 'bold',
    },
    rightSide: {
        justifyContent: 'flex-end',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    optionButton1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 18,
    },
    optionText: {
        fontSize: 18,
        color: '#737373',
        marginLeft: 5,
    },
    optionText1: {
        fontSize: 16,
        color: '#737373',
        marginLeft: 5,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionRow1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'baseline',
        padding: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    buttonContainer: {
        width: '50%',
        marginRight: 5,
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
});
