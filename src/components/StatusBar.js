import React from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { StatusBar as StatusBarC } from 'expo-status-bar';

const StatusBar = () => (
  <View style={styles.StatusBar}>
    <StatusBarC translucent backgroundColor="#d97706" barStyle="light-content" />
  </View>
);

const styles = StyleSheet.create({
  StatusBar: {
    height: Constants.statusBarHeight,
    backgroundColor: '#d97706',
  },
});

export default StatusBar;
