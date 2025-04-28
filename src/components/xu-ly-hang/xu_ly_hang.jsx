import { SafeAreaView, ScrollView, View, Text } from 'react-native'
import React from 'react'
import CustomHeader from '../CustomHeader'
import BodyInfo from './BodyInfo'

export default function xu_ly_hang({ route, navigation }) {
  const { token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
  return (
    <SafeAreaView>
      <CustomHeader
                title="Xử lý hàng"
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
        <BodyInfo
          token={token}
          user={user}
          userN={userN}
          user06={user06}
          wh_id={wh_id}
          wh_name={wh_name}
          navigation={navigation} 
          />
      </ScrollView>
    </SafeAreaView>
  )
}