import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SIZES } from '../constants';

const Tag = ({ name, color }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          height: 25,
          backgroundColor: color,
          borderRadius: SIZES.radius,
          justifyContent: 'center',
        }}
      >
        <View style={{ paddingHorizontal: 8 }}>
          <Text style={styles.tag}>{name}</Text>
        </View>
      </View>
    </View>
  );
};

export default Tag;

const styles = StyleSheet.create({
  tag: {
    color: COLORS.lightWhite,
    fontFamily: 'RobotoBold',
    fontSize: SIZES.body4,
  },
  container: {
    marginRight: SIZES.base,
  },
});
