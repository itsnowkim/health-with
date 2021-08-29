//import React in our code
import React from 'react';

//import all the components we are going to use
import {
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';

export default ({loading}) => {

  return (
        <ActivityIndicator
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: COLORS.primary,
  },
});