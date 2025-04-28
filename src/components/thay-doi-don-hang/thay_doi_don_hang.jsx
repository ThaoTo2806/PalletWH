import { SafeAreaView, ScrollView, View, Text } from 'react-native'
import React from 'react'
import CustomHeader1 from '../CustomHeader1'

export default function thay_doi_don_hang({ navigation }) {
  return (
    <SafeAreaView>
      <CustomHeader1 title="Thay đổi đơn hàng" navigation={navigation} token={token}
        user={user}
        userN={userN}
        user06={user06}
        wh_id={wh_id}
        wh_name={wh_name}
        onScan={handleScan}
        triggerScan={triggerScan} // Truyền state triggerScan xuống CustomHeader1
        setTriggerScan={setTriggerScan}
        ser={ser}
        ver={ver} />
    </SafeAreaView>
  )
}