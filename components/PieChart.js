import React, { useEffect } from 'react';
import { Dimensions, View } from "react-native";
import { PieChart } from 'react-native-chart-kit';
import { COLORS } from '../constants';

export default ({frequency}) => {
  useEffect(() => {
    console.log(frequency)
  }, [])
  const data = [
    { name: 'Seoul', freq: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Toronto', freq: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Beijing', freq: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'New York', freq: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Moscow', freq: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
  ]

  return(
    <View style={{alignItems:'center'}}>
      <PieChart
        data={frequency}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
          backgroundColor: '#12cc12',
          backgroundGradientFrom: '#12cc12',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `${COLORS.primary}`,
        }}
        accessor="freq"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  )
}