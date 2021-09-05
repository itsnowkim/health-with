import React from "react";
import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";

import Tabs from "./navigation/tabs";
import { Details, Workout } from "./screens";

//import { HowToUse, Notice, RemoveAd, SendIdea, SendReview } from './screens/Detail';
import HowToUse from "./screens/Detail/HowToUse";
import Notice from "./screens/Detail/Notice";
import RemoveAd from "./screens/Detail/RemoveAd";
import SendIdea from "./screens/Detail/SendIdea";
import SendReview from "./screens/Detail/SendReview";
import { Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

// font 적용
import { useFonts } from 'expo-font';
import { COLORS, SIZES } from "./constants";
import { View, Text, TouchableOpacity } from "react-native";

// import existing db
import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';

const Stack = createStackNavigator();

// header에 탭 이름 가져오는 함수
function getHeaderTitle(route) {
  // tab navigator의 `route.state` state를 사용한다
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return '캘린더';
    case 'Report':
      return '통계';
    case 'Settings':
    return '설정';
  }
}

const App = () => {
  //copy .db file
  // useEffect(() => {
  //   const copyDB = async () => {
  //     await FileSystem.downloadAsync(
  //       Asset.fromModule(require('./db/testDB.db')).uri,
  //       FileSystem.documentDirectory + 'SQLite/testDB.db'
  //     )
  //   }
  //   copyDB();
  // }, [])

// push test

  // key name으로 fontfaily 적용가능.
  const [loaded] = useFonts({
    RobotoBlack : require('./assets/fonts/Roboto-Black.ttf'),
    RobotoBold : require('./assets/fonts/Roboto-Bold.ttf'),
    RobotoRegular : require('./assets/fonts/Roboto-Regular.ttf'),
    RobotoMedium : require('./assets/fonts/Roboto-Medium.ttf'),
    RobotoThin : require('./assets/fonts/Roboto-Thin.ttf'),
    RobotoLight : require('./assets/fonts/Roboto-Light.ttf'),
  });
  
  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer theme={{colors:{background:'white'}}}>
      <Stack.Navigator
      // screenOptions={{
      //   headerShown: false
      // }}
      >
        <Stack.Screen
          name="캘린더"
          component={Tabs}
          options={({route}) => ({
            headerTitle: getHeaderTitle(route)
          })}
        />
        
        <Stack.Screen
          name="Workout"
          component={Workout}
          options={({ route,navigation }) => ({ 
            title: route.params.name,
            headerRight: () => (
              <TouchableOpacity onPress={()=>alert('저장 누름')}>
                <Text style={{color:COLORS.primary, fontSize:17, marginRight:SIZES.padding}}>저장</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>navigation.goBack()}>
                <FontAwesome
                  name="angle-left"
                  color={COLORS.primary}
                  style={{transform: [{ scaleX: 2 }, { scaleY: 2 }],marginLeft:SIZES.padding}}
                />
                <Text style={{fontSize:17, marginLeft:SIZES.padding}}>캘린더</Text>
              </TouchableOpacity>
            )
          })}
          />
        <Stack.Screen name="Details" component={Details} />

        <Stack.Screen name="HowToUse" component={HowToUse} />
        <Stack.Screen name="Notice" component={Notice} />
        <Stack.Screen name="RemoveAd" component={RemoveAd} />
        <Stack.Screen name="SendIdea" component={SendIdea} />
        <Stack.Screen name="SendReview" component={SendReview} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
