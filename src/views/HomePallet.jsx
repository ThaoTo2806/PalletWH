import { SafeAreaView, ScrollView, View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../components/CustomHeader';
import ListFolder from '../components/home/ListFolder';
import {loadInfo,loadData1} from '../services/getInfoUser';

export default function HomePallet({ navigation, route }) {
    const { token } = route.params;
    const [user, set_User] = useState(null);
    const [user06, set_User06] = useState(null);
    const [userN, set_UserN] = useState(null);
    const [wh_id, set_Wh_ID] = useState(null);
    const [wh_name, set_Wh_Name] = useState(null);
    const [error, setError] = useState(null);
    const [ver, setVersion] = useState(null);
    const [ser, setServer] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const kq = await loadInfo("0034",token);
                
                if (kq.success) {
                    set_User (kq.data.lv001);
                    set_User06 (kq.data.lv006);
                    set_UserN(kq.data.lv004);
                    set_Wh_ID(kq.data.lv002);
                    set_Wh_Name(kq.data.lv003);
                } else {
                    setError(kq.message);
                }
            } catch (error) {
                Alert("Error fetching data:", error);
            }
        };
        const fetchData1 = async () => {
            try {
                const kq1 = await loadData1("0001",token);
                //console.log("version: ", kq1.data.data[0].lv099);
                //console.log("server: ", kq1.data.data[0].lv002);
                
                if (kq1.success) {
                    setServer(kq1.data.data[0].lv002);
                    setVersion(kq1.data.data[0].lv099);
                } else {
                    setError(kq1.message);
                }
            } catch (error) {
                Alert("Error fetching data:", error);
            }
        };

        fetchData();
        fetchData1();
    }, [token]);
    if (error) {
        return <Alert>{error}</Alert>;
    }
    return (
        <SafeAreaView>
            <CustomHeader
                title="Century WMS"
                navigation={navigation}
                token={token}
                user={user}
                userN={userN}
                user06={user06}
                wh_id={wh_id}
                wh_name={wh_name}
                ser={ser}
                ver={ver}
            />
            <ScrollView>
            <ListFolder navigation={navigation}
                token={token}
                user={user}
                userN={userN}
                user06={user06}
                wh_id={wh_id}
                wh_name={wh_name}
                ser={ser}
                ver={ver} />
                <View style={styles.footer}>
                    <Text>Nhà kho: {wh_name} - {wh_id}</Text>
                    <Text>Phiên bản: {ver}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    footer: {
        justifyContent: 'space-between',
        padding: 10,
      },
})