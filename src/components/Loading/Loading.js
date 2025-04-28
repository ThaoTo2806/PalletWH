import React, {useMemo} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
  });

function Loading({
  title = 'Đang tải dữ liệu...',
}) {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

export default Loading;
