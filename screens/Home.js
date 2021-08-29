import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, SafeAreaView, Button, ScrollView, TouchableOpacity} from "react-native";
import Constants from 'expo-constants';

import CalendarBase from "../components/Calendar";
import { COLORS, SIZES } from "../constants";
import { FontAwesome } from '@expo/vector-icons';

import WorkoutCard from "../components/WorkoutCard";

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
    id: 1,
    dateString: selectedDate.dateString
  })

  // 임시
  const [sessionTitle,setSessionTitle] = useState([
      {
        title: '랫풀다운',
        tag: [{name:'등',color:'#FBBB0D'}],
      },
      {
        title: '데드리프트',
        tag: [{name:'등',color:'#FBBB0D'},{name:'하체',color:'#7A5ACB'}],
      }
    
  ])

  const [sessionBody, setSessionBody] = useState([
    {
      title: '랫풀다운',
      data: [
        {rep: 10, weight: 40, time: null},
        {rep: 10, weight: 40, time: null},
        {rep: 10, weight: 40, time: null},
        {rep: 10, weight: 40, time: null},
        {rep: 10, weight: 40, time: null}
      ]
    },
    {
      title: '데드리프트',
      data: [
        {rep: 10, weight: 80, time: null},
        {rep: 10, weight: 80, time: null},
        {rep: 10, weight: 80, time: null},
        {rep: 10, weight: 80, time: null},
        {rep: 10, weight: 100, time: null},
      ]
    }
  ])

  // plus button
  function addWorkout(id){
    navigation.navigate("Workout",{
      name:`${selectedDate.month}월 ${selectedDate.date}일 ${koreaday[selectedDate.day]}요일`,
      itemId: id
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
    // db로 datestring 넘겨서
    // workout.workout_date = props 인 workout.id get.
    // 해당 workout.id로 session 있는지 체크
    // if (session) {
    //   join문으로 세션이름, 태그 가져오고
    //   세션 아이디로 세트수 가져오기
    // }else{
    //   해당 날짜에 운동이 없다고 표시해야함.
    //   리턴으로 뭘 주면 좋을까
    // }
    console.log('get workout db - 1 yes : ' + props)
    if (props == "2021-08-23" || props == "2021-08-24"){
      // 운동 함
      //console.log(props)
      setSchedule(0)
      setWorkout({
        // 임시로 쓰는 id.
        id: 2,
        dateString:selectedDate.dateString
      })
    }else{
      // 운동안함
      setSchedule(1)
      setWorkout({
        // 임시로 쓰는 id.
        id: 1,
        dateString:selectedDate.dateString
      })
    }
  }

  // init 함수
  useEffect(()=>{
    setcurrent()
    getWorkoutFromDB(selectedDate.dateString)
  },[])

  useEffect(()=>{
    getWorkoutFromDB(selectedDate.dateString)
  },[selectedDate])

  // useEffect(()=>{
  //   getWorkoutFromDB(workout.id)
  // },[workout])

  function renderCalendar() {
    return (
      <View style={{flex:1}}>
        <CalendarBase
          setSelectedDate={setSelectedDate}
        />
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
    return (
      <View style={{flex:1}}>
        <WorkoutCard
          sessionTitle={sessionTitle}
          sessionBody={sessionBody}
        ></WorkoutCard>
      </View>
    )
  }

  function noSchedule() {
    return (
      <View style={{marginTop:SIZES.padding,height:'90%',justifyContent:'center',alignItems:'center', backgroundColor:COLORS.lightGray}}>
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
    marginTop:SIZES.padding2
  },
  text: {
    fontSize: SIZES.h4,
    alignSelf: 'center',
    fontFamily: 'RobotoRegular',
    marginLeft: SIZES.padding*2,
  },
});

export default Home;
