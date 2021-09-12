import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, SafeAreaView, Button, ScrollView, TouchableOpacity} from "react-native";
import Constants from 'expo-constants';

import CalendarBase from "../components/Calendar";
import { COLORS, SIZES } from "../constants";
import { FontAwesome } from '@expo/vector-icons';

import WorkoutCard from "../components/WorkoutCard";
import Line3 from "../components/Line3";

//db
import Workout from "../model/Workout";
import Workout_Session_Tag from "../model/Workout_Session_Tag";
import Tag from "../model/Tag";
import Set from "../model/Set";
import Session_Set from "../model/Session_Set";
import Session from "../model/Session";
import DatabaseLayer from 'expo-sqlite-orm/src/DatabaseLayer'
import * as SQLite from 'expo-sqlite'
import { GET_ALL_BY_WORKOUT_ID } from "./Report/ReportQueries";
import { getDATAfromDB } from "../util/getDATAfromDB";


const Home = ( {navigation} ) => {
  
  const koreaday = ['일','월','화','수','목','금','토']
  const [selectedDate,setSelectedDate] = useState({
    month: '',
    date:'',
    day:'',
    dateString:''
  })
  const [schedule,setSchedule] = useState(0)

  //workout id,datestring 담는 state
  const [workout,setWorkout] = useState({
    id: 0,
    dateString: selectedDate.dateString
  })

  const [DATA,setDATA] = useState([
    {
        title:'',
        tag:[{name:'',color:'',id:''}],
        data:[{rep:'',weight:'',time:''}]
    }
  ])

  // plus button
  function addWorkout(id){
    navigation.navigate("Workout",{
      name:`${selectedDate.month}월 ${selectedDate.date}일 ${koreaday[selectedDate.day]}요일`,
      itemId: id,
      date:selectedDate.dateString
    })
  }

  function setcurrent(){
    const today = new Date()
    let t_month = today.getMonth()+1
    let t_date = today.getDate()
    let t_day = today.getDay()

    if (t_month.toString().length <2){
      t_month = '0' + t_month
    }
    if (t_date.toString().length < 2){
      t_date = '0' + t_date
    }
    const t_string = [today.getFullYear().toString(),t_month,t_date].join('-')
    setSelectedDate({
      month: t_month,
      date:t_date,
      day:t_day,
      dateString: t_string
    })
  }

  function getWorkoutFromDB(props){
    if(props !== ''){
      // props에 해당하는 workout id 찾기
      const setData = async () => {
        let res1 = await Workout.findBy({date_eq:props})
        console.log(res1)
        if(res1 === null){
          setWorkout({id:0,dateString:props})
          setSchedule(0)
        }else{
          setSchedule(1)
          setWorkout(res1)
          // 세션 이름, 태그 + 세트 수까지 다 가져와야함
          const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
          databaseLayer.executeSql(GET_ALL_BY_WORKOUT_ID+`WHERE workout.id=${res1.id}`)
          .then((response) => {
            const responseList = response.rows
            let temp = getDATAfromDB(responseList)
            setDATA(temp)
          })
          .catch((err) => {
            console.log(err)
          })
        }
      }
      setData()
    }
  }

  // init 함수
  useEffect(()=>{
    setcurrent()
    // return()으로 다른 report 갈때 update된거 있으면 update
  },[])

  useEffect(()=>{
    getWorkoutFromDB(selectedDate.dateString)
  },[selectedDate])

  function renderCalendar() {
    return (
      <View style={{flex:1}}>
        <CalendarBase
          setSelectedDate={setSelectedDate}
        />
        <Line3/>
      </View>
    )
  }

  function renderTitle() {
    return(
      <View style={styles.titleView}>
        <Text style={styles.text}>{selectedDate.month}월 {selectedDate.date}일 {koreaday[selectedDate.day]}요일</Text>
        <View style={{marginRight:SIZES.padding*2}}>
          <TouchableOpacity onPress={() => addWorkout(workout.id)}>
            <FontAwesome
              name="plus"
              backgroundColor={COLORS.transparent}
              color={COLORS.primary}
              size={SIZES.h2}
            >
            </FontAwesome>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function renderSchedule() {
    return (<>
      <View style={{flex:1}}>
        <WorkoutCard
          DATA={DATA}
        ></WorkoutCard>
      </View>
      <View style={{height:SIZES.height/3}}></View>
      </>
    )
  }

  function noSchedule() {
    return (
      <View style={{marginTop:SIZES.padding,height:SIZES.height/2,justifyContent:'center',alignItems:'center', backgroundColor:COLORS.lightGray}}>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderCalendar()}
        {renderTitle()}
        <>
          {schedule === 1 ? renderSchedule() : noSchedule()}
        </>
      </ScrollView>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleView: {
    flexDirection: 'row',
    backgroundColor: COLORS.transparent,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:14
  },
  text: {
    fontSize: SIZES.h4,
    alignSelf: 'center',
    fontFamily: 'RobotoRegular',
    marginLeft: SIZES.padding*2,
  },
});

export default Home;
