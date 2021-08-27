import React from 'react';
import { useState, useEffect } from 'react';
import { View, Dimensions, Text } from "react-native";
import { LineChart } from 'react-native-chart-kit';
import { COLORS, SIZES } from '../constants';

export default Chart = ({isRecent, volume, tags, selectedTag}) => {

  const [labels, setLabels] = useState([])
  const [data, setData] = useState([])

  const setTotalLabelAndData = () => {
    console.log('hello')
    console.log(volume)
    const totalDate = Object.keys(volume)
    totalDate.map((date) => {
      let elem = volume[date]
      if (selectedTag in elem) {
        setData((prev) => [...prev, elem[selectedTag]])
        setLabels((prev) => [...prev, date])
      }
    })
  }

  useState(() => {
    setTotalLabelAndData()
  }, [volume])

  return (
    <View style={{alignItems:'center'}}>
      {data.length != 0 && labels.length != 0 && data[0] != 0 && (
      <LineChart
          data={{
            labels: labels,
            datasets: [{
              data: data
            }]
          }}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={{
            backgroundColor: '#cs2d1d',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 1, // optional, defaults to 2dp
            color: (opacity = 1) => `${COLORS.primary}`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 4
            },
            propsForDots: {
              r: "3",
              strokeWidth: "1",
              stroke: `${COLORS.primary}`,
            }
          }}
          style={{
            marginVertical: 0,
            borderRadius:16,
          }}
          withHorizontalLabels={true}
          withVerticalLines={false}
          withHorizontalLines={false}
          withOuterLines={false}
          verticalLabelRotation={0}
        />
      )}
      {
        data.length == 0 && <Text>Hi</Text>
      }
    </View>
  )
}

/*
          data={{
            labels: ['21.05.01', '21.06.01', '21.07.01', '21.07.15', '21.08.01'],
            datasets: [{
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100
              ]
            }]
          }}
*/