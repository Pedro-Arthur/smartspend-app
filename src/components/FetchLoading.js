import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { FetchLoadingContext } from '../contexts/FetchLoadingContext';

const FetchLoading = () => {
  const { isFetchLoading } = useContext(FetchLoadingContext);

  if (isFetchLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay} />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return <View />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default FetchLoading;
