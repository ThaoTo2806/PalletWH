import { SafeAreaView, ScrollView, View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '../CustomHeader'
import BodyInfo from './BodyInfo'

export default function lay_hang({ route, navigation }) {
  const { token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
  return (
    <SafeAreaView>
      <CustomHeader title="Danh sách lấy hàng" navigation={navigation}
                token={token}
                user={user}
                userN={userN}
                user06={user06}
                wh_id={wh_id}
                wh_name={wh_name}
                ser={ser}
                ver={ver}/>
      <BodyInfo
        token={token}
        user={user}
        userN={userN}
        user06={user06}
        wh_id={wh_id}
        wh_name={wh_name} />
    </SafeAreaView>
  )
}