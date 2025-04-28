import { SafeAreaView, ScrollView, View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '../CustomHeader';
import BodyInfo from './BodyInfo'

export default function chi_tiet_don_hang({ route, navigation }) {
    const { orderNumber, poNumber, token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
    return (
        <SafeAreaView>
            <CustomHeader title={orderNumber} navigation={navigation} />
            <ScrollView>
                <BodyInfo
                    orderNumber={orderNumber}
                    poNumber={poNumber}
                    token={token}
                    user={user}
                    userN={userN}
                    user06={user06}
                    wh_id={wh_id}
                    wh_name={wh_name}
                    navigation />
            </ScrollView>
        </SafeAreaView>
    )
}