import { SafeAreaView, ScrollView, View, Text } from 'react-native'
import React, { useState } from 'react';
import CustomHeader1 from '../CustomHeader1'
import BodyInfo from './BodyInfo'

export default function dem_hang({ route, navigation }) {
  const { token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
  const [latestScannedData, setLatestScannedData] = useState(null);
  const handleScan = (data) => {
    setLatestScannedData(data);
    console.log('Received Scanned Data:', data);
  };
  return (
    <SafeAreaView>
      <CustomHeader1 title="Đến hàng" navigation={navigation} token={token}
        user={user}
        userN={userN}
        user06={user06}
        wh_id={wh_id}
        wh_name={wh_name}
        onScan={handleScan} 
        ser={ser}
        ver={ver} />
      <ScrollView>
        <BodyInfo
          token={token}
          user={user}
          userN={userN}
          user06={user06}
          wh_id={wh_id}
          wh_name={wh_name}
          latestScannedData={latestScannedData} />
      </ScrollView>
    </SafeAreaView>
  )
}