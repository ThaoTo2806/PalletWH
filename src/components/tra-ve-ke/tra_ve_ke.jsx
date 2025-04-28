import { SafeAreaView, ScrollView, View, Text } from 'react-native'
import React, { useState } from 'react';
import CustomHeader1 from '../CustomHeader1'
import BodyInfo from './BodyInfo'

export default function tra_ve_ke({ route, navigation }) {
  const { token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
  const [latestScannedData, setLatestScannedData] = useState(null);
  const [triggerScan, setTriggerScan] = useState(false);  // State để trigger quét mã
  
  const handleScan = (data) => {
    setLatestScannedData(data);
    console.log('Received Scanned Data:', data);
  };

  const handleTriggerScan = () => {
    setTriggerScan(true); // Kích hoạt quét mã
  };
  return (
    <SafeAreaView>
      <CustomHeader1 title="Trả về kệ" navigation={navigation} token={token}
        user={user}
        userN={userN}
        user06={user06}
        wh_id={wh_id}
        wh_name={wh_name}
        onScan={handleScan} 
        triggerScan={triggerScan} // Truyền state triggerScan xuống CustomHeader1
        setTriggerScan={setTriggerScan} // Truyền setter setTriggerScan xuống CustomHeader1
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
          latestScannedData={latestScannedData}
          onTriggerScan={handleTriggerScan}  />
      </ScrollView>
    </SafeAreaView>
  )
}