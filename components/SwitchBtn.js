import React from 'react';
import { Switch, View, Text, StyleSheet} from 'react-native';
import { COLORS, SIZES } from '../constants';


export default SwitchBtn = ({isEnabled, setIsEnabled}) => {
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>최근</Text>
      <Switch
        trackColor={{ false: '#767577', true: COLORS.primary }}
        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor={COLORS.gray}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      <Text style={styles.text}>전체</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 10,
    margin: SIZES.padding,
  }
})