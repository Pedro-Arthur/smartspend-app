import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from 'native-base';
import { FetchLoadingContext } from '../contexts/FetchLoadingContext';

const FetchLoading = () => {
  const { isFetchLoading } = useContext(FetchLoadingContext);

  if (isFetchLoading) {
    return (
      <View style={styles.container}>
        <Spinner size="lg" />
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
});

export default FetchLoading;
