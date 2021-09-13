import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, TextInput, Alert, Button } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../constants';
import Line3 from '../components/Line3';
import Tag from '../components/Tag';
import Line2 from '../components/Line2';
import Line1 from '../components/Line1';
import { FontAwesome } from '@expo/vector-icons';

import Animated, { color } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

//db
import DatabaseLayer from 'expo-sqlite-orm/src/DatabaseLayer'
import * as SQLite from 'expo-sqlite'
import { GET_ALL_BY_WORKOUT_ID } from "./Report/ReportQueries";
import { getDATAfromDB, GET_SESSION_SET_BY_WORKOUTID, GET_WORKOUT_SESSION_TAG_BY_DATESTRING } from "../util/getDATAfromDB";
import TagDb from '../model/Tag';
import WorkoutDb from '../model/Workout';
import SetsDb from '../model/Set';
import SessionDb from '../model/Session';
import Workout_Session_Tag from '../model/Workout_Session_Tag';
import Session_Set from '../model/Session_Set';

const Workout = ({ route }) => {
    const [isEnabled, setIsEnabled] = useState([false]);
    const toggleSwitch = (index) => {
        let temp = [...isEnabled];
        temp[index] = !temp[index]
        setIsEnabled(temp)

        if(measure[index] === true){
            toggleMeasure(index)
        }
        //DATA 비우기
        let del = [...DATA]
        del[index].data = [{rep:'',time:'',weight:'',lb:0}]
        setDATA(del)
    }
    const [measure, setMeasure] = useState([false]);
    const toggleMeasure = (index) => {
        let temp = [...measure];
        temp[index] = !temp[index]
        setMeasure(temp)

        let arr = [...DATA];
        arr[index].data.map((i,j)=>{
            if(i.lb === 0){
                arr[index].data[j].lb = 1
            }else{
                arr[index].data[j].lb = 0
            }
        })
        console.log(arr)
        setDATA(arr)

        if(isEnabled[index]=== true){
            toggleSwitch(index)
        }
    }

    // angledown, angleup 판단하는 state - DATA.data 개수만큼 true,false 있어야 함
    const [isPressed, setIsPressed] = useState(null)

    const togglePressed = (index,innerindex) => {
        let temp = [...isPressed];
        //console.log(index,innerindex)

        temp[index].data[innerindex] = !temp[index].data[innerindex]
        setIsPressed(temp)
    }
    

    const [bottomSheetOpened,setBottomSheetOpened] = useState(false)
    const [whichTag,setWhichTag] =useState(0)

    const TagColors = ["#B54B4B", "#DB6E15","#CC8042", "#FBBB0D", "#E6BA35", "#97D53F","#20C997","#6A8B3A","#3A8B46","#3A8B86","#32BAB2","#3790C9","#576BCF","#7A5ACB","#B25ACB","#CB5A97","#FF7979"]

    const [tagCustomize,setTagCustomize] = useState({
        name:'',
        color:'#B54B4B',
        id:1
    })
    const [tagUpdate,setTagUpdate] = useState({
        name: '',
        color: '',
        id:1,
        index: null
    })
    const [firstAngle,setFirstAngle] = useState(false)
    const [secondAngle,setSecondAngle] = useState(false)

    // 임시
    const [DATA,setDATA] = useState([
        {
            title:'',
            tag:[{name:'',color:'',id:1}],
            data:[{lb:0,rep:'',weight:'',time:null,id:0}]
        }
    ])
    const [AllTag,setAllTag] = useState([])

    const getTag = async () => {
        let tags = await TagDb.query({order:'id ASC'})
        tags.shift()
        setAllTag(tags)
    }

    function fetchData(itemId){
        // db에서 DATA 가져와서 넣기        
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(GET_ALL_BY_WORKOUT_ID+`WHERE workout.id=${itemId}`)
        .then((response) => {
            console.log('몇번?')
            const responseList = response.rows
            let temp = getDATAfromDB(responseList)
            setDATA(temp)
            
            // angledown, angleup 판단하는 state - DATA.data 개수만큼 true,false 있어야 함
            let pressedlist = []       
            temp.map((i,idx)=>{
                if(i.data[0].time!==null){
                    // 유산소 운동
                    let temp = isEnabled
                    temp[idx] = true
                    setIsEnabled(temp)
                }

                let aaa = {data:[]}
                pressedlist.push(aaa)
                i.data.map((j)=>{
                    pressedlist[idx].data.push(false)
                })
            })
            setIsPressed(pressedlist)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    useEffect(()=> {
        // 처음 마운트 되었을 때 넘어온 id로 local storage에서 get.
        const {itemId} = route.params;
        console.log(itemId)
        getTag()

        if (itemId === 0){
            // no item id, 새로 작성하는 경우
            console.log('생성')
        }else{
            // get data from local storage
            console.log('수정')
            fetchData(itemId)
        }
        // 화면을 나갈 때 변경사항이 있는지 체크(저장할 경우 data가 바뀌므로)
        return () => {
            setIsPressed(null)
            console.log('Workout Page 언마운트')
        }
    }, []);

    useEffect(()=>{
        if(route.params.saveButton){
            console.log('savebutton 누름(true)')
            // DATA에 있는 값 db에 저장
            saveDATAtoDB()
        }
    },[route.params.saveButton])

    async function saveWorkout(itemId,targetdate){
        if(itemId===0){
            let res = await WorkoutDb.findBy({date_eq:targetdate})
            if(res === null){
                let response = await WorkoutDb.create({date:targetdate})
                return response.id
            }else{
                return res.id
            }
        }else return itemId
    }
    async function saveSession(title){
        //존재하지 않는 title일 경우 추가후 해당 id 리턴
        let response = await SessionDb.findBy({name_eq:title})
        if(response === null){
            let res = await SessionDb.create({name:title})
            return res.id
        }else{
            return response.id
        }
    }
    async function saveSets(data){
        return new Promise((resolve)=>{
            function getdata(){
                let result = []
                data.map(async(i,j)=>{
                    if(i.time!==null){
                        // 유산소 운동의 경우
                        let response = await SetsDb.findBy({time_eq:i.time})
                        if(response === null){
                            response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
                        }
                        result = [...result,response.id]
                    }else{
                        // 무산소 운동의 경우
                        let response = await SetsDb.findBy({weight_eq:i.weight, rep_eq:i.rep, lb_eq:i.lb})
                        if(response === null){
                            response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
                        }
                        result = [...result,response.id]
                    }
                    if(j===data.length-1){
                        resolve(result)
                    }
                })
            }
            getdata()
        })

        console.log('saveSets 들어옴')
        let result = []
        data.map(async(i,j)=>{
            if(i.time!==null){
                // 유산소 운동의 경우
                let response = await SetsDb.findBy({time_eq:i.time})
                if(response === null){
                    // 없다면 추가
                    response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
                }
                console.log(response.id)
                result = [...result,response.id]
                console.log(result)
            }else{
                // 무산소 운동의 경우
                let response = await SetsDb.findBy({weight_eq:i.weight, rep_eq:i.rep, lb_eq:i.lb})
                if(response === null){
                    // 없다면 추가
                    response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
                }
                console.log(response.id)
                result = [...result,response.id]
                console.log(result)
            }
            if(j===data.length-1){
                console.log('result : ')
                console.log(result)
                return result
            }
            // 같은 값이 중복으로 들어가는 경우 방지
            // if(j>=1){
            //     if(i === data[j]){
            //         result = [...result,result[j-1]]
            //     }else{
            //         if(i.time!==null){
            //             // 유산소 운동의 경우
            //             let response = await SetsDb.findBy({time_eq:i.time})
            //             if(response === null){
            //                 // 없다면 추가
            //                 response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
            //             }
            //             console.log(response.id)
            //             result = [...result,response.id]
            //             console.log(result)
            //         }else{
            //             // 무산소 운동의 경우
            //             let response = await SetsDb.findBy({weight_eq:i.weight, rep_eq:i.rep, lb_eq:i.lb})
            //             if(response === null){
            //                 // 없다면 추가
            //                 response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
            //             }
            //             console.log(response.id)
            //             result = [...result,response.id]
            //             console.log(result)
            //         }
            //     }
            // }else{
            //     if(i.time!==null){
            //         // 유산소 운동의 경우
            //         let response = await SetsDb.findBy({time_eq:i.time})
            //         if(response === null){
            //             // 없다면 추가
            //             response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
            //         }
            //         console.log(response.id)
            //         result = [...result,response.id]
            //         console.log(result)
            //     }else{
            //         // 무산소 운동의 경우
            //         let response = await SetsDb.findBy({weight_eq:i.weight, rep_eq:i.rep, lb_eq:i.lb})
            //         if(response === null){
            //             // 없다면 추가
            //             response = await SetsDb.create({weight:i.weight,rep:i.rep, time:i.time, lb:i.lb})
            //         }
            //         console.log(response.id)
            //         result = [...result,response.id]
            //         console.log(result)
            //     }
            // }
            // if(j===data.length-1){
            //     console.log('res:')
            //     console.log(result)
            // }
        })
    }
    async function saveWorkoutSessionTag(title,tag,exist,date){
        const title_id = await saveSession(title)
        // ok
        let tagId = [0]
        if(tag.length !== 0){
            tagId = []
            tag.map((i)=>{
                tagId = [...tagId,i.id]
            })
        }
        tagId.map(async(i)=>{
            if(exist.length === 0){
                console.log('관계형 데이터베이스 테이블에 넣기')
                // 해당 날짜에 운동기록 없으니까 쏙쏙 넣어줘야함
                const props = {
                   workout_id: date,
                   session_id: title_id,
                   tag_id:i
                }
                await Workout_Session_Tag.create(props)
            }else{
                // 운동 기록을 수정하는 경우
                // 비교해서 사라진거 -> 삭제, 새로 생긴거 추가
                console.log('해당 날짜에 workout 존재')

            }
        })
        return title_id
    }
    async function checkWorkoutSessionTag(date){
        // 해당 날짜에 workout_session_tag rows가 있으면 리턴, 없으면 []리턴
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        let response = await databaseLayer.executeSql(GET_WORKOUT_SESSION_TAG_BY_DATESTRING+`WHERE workout.date='${date}'`)
        let rows = await response.rows
        return rows
    }
    async function checkSessionSets(id){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        let response = await databaseLayer.executeSql(GET_SESSION_SET_BY_WORKOUTID+`WHERE workout_id=${id}`)
        let rows = await response.rows
        return rows
    }
    async function saveSessionSet(data, title_id, workoutid, itemId){
        // const title_id = await saveSession(title)
        // console.log('title_id : ' + title_id)
        console.log(workoutid,itemId)
        // itemId가 0일 경우 비교필요 없음, 0이 아닐 경우 비교해야함

        if(itemId!==0){
            //비교시작해라
            //checkSessionSets
        }else{
            //비교할 필요 없이 새로 넣는거라서 그냥 무지성때려박기
            console.log('관계형데이터베이스 테이블 session set에 추가')
            //set 개수만큼 map -> 한 줄씩 넣기.
            saveSets(data).then((set_id)=>{
                set_id.map(async(i)=>{
                    const props = {
                        session_id: title_id,
                        set_id: i,
                        workout_id: workoutid
                    }
                    await Session_Set.create(props)
                })      
            })
        }
    }

    async function saveDATAtoDB(){
        const target = [...DATA];
        const {itemId} = route.params;
        const {date} = route.params

        const exist = await checkWorkoutSessionTag(date)
        let workoutid = await saveWorkout(itemId,date)

        // session 개수만큼 map
        console.log(target)
        target.map(async(item,index)=>{
            const title_id = await saveWorkoutSessionTag(item.title,item.tag,exist,workoutid)
            saveSessionSet(item.data,title_id,workoutid,itemId)
        })
    }

    function deleteTag(){
        TagDb.destroy(tagUpdate.id)
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`DELETE FROM workout_session_tag WHERE tag_id=${tagUpdate.id}`)
        
        const temp = AllTag.filter((i,j)=>j!==tagUpdate.index);
        setAllTag(temp)
        setTagUpdate({
            name: '',
            color: '',
            id:1,
            index: null
        })
        handleTagDelete(whichTag,tagUpdate.index)
    }

    function handleTagAdd(index){
        //console.log(AllTag)
        // 체크해서 이미 있으면 아무것도 안함.
        let color = AllTag[index].color
        let name = AllTag[index].name

        let temp = [...DATA];

        let istrue = false
        temp[whichTag].tag.map((i,j)=>{
            if(i.id === AllTag[index].id){
                istrue = true
            }
        })

        // 찾는함수
        if(!istrue){
            //문제 없음
            if(temp[whichTag].tag.length === 0){
                temp[whichTag].tag = [...temp[whichTag].tag,{color:color,name:name,id:AllTag[index].id}]
            }else{
                if(temp[whichTag].tag[0].name===''){
                    temp[whichTag].tag[0] = {...temp[whichTag].tag[index], color:color,name:name,id:AllTag[index].id};
                }else{
                    temp[whichTag].tag = [...temp[whichTag].tag,{color:color,name:name,id:AllTag[index].id}]
                }
            }
            setDATA(temp)
        }
        //console.log(temp)
    }
    function handleTagDelete(index,innerindex){
        const temp = DATA[index].tag.filter((item,j)=>j!==innerindex);
        
        let result = [...DATA];
        result[index] = {...result[index],tag:temp}
        setDATA(result)
    }

    function handelTitle (event,index){
        let temp = [...DATA];
        temp[index] = {...temp[index], title: event};
        setDATA(temp)
    }
    function handleWeight (event,innerindex,index){
        let temp = [...DATA];
        temp[index].data[innerindex] = {...temp[index].data[innerindex], weight: event};
        setDATA(temp)
    }
    function handleReps (event,innerindex,index){
        let temp = [...DATA];
        temp[index].data[innerindex] = {...temp[index].data[innerindex], rep: event};
        setDATA(temp)
    }

    function updateTagCustom(){
        if(tagUpdate.name !== ''){
            let temp = [...AllTag];
            temp[tagUpdate.index] = {...temp[tagUpdate.index], name:tagUpdate.name,color:tagUpdate.color,id:tagUpdate.id}
            setAllTag(temp)
            // db에 있는 태그 테이블에 변경된 점 반영.
            TagDb.update({id:tagUpdate.id,name:tagUpdate.name,color:tagUpdate.color})
            // 이미 등록된 태그도 같이 변경해 주어야 함.
            let addedTag = [...DATA];

            addedTag.map((data,index)=>{
                data.tag.map((t,j)=>{
                    if(t.id === tagUpdate.id){
                        addedTag[index].tag[j] = {
                            name:tagUpdate.name,
                            color:tagUpdate.color,
                            id:tagUpdate.id
                        }
                    }
                })
            })
            setDATA(addedTag)
        }
    }
    function handleTagCustomizeAdd(event,color){
        const id = AllTag.length+2
        setTagCustomize({name:event,color:color,id:id})
    }

    function delSets(index,innerindex){
        let count = DATA[index].data.length

        if(count!==1){
            const temp = DATA[index].data.filter((item,j)=>j!==innerindex);
            let result = [...DATA];
            result[index] = {...result[index],data:temp}
            setDATA(result)

            //angle state 처리
            const angle = isPressed[index].data.filter((item,j)=>j!==innerindex);
            let an_res = [...isPressed];
            an_res[index] = {...an_res[index],data:angle}
            setIsPressed(an_res)
        }
    }
    function addSets(index){
        let count = DATA[index].data.length;
        let push = {
            rep:DATA[index].data[count-1].rep,
            weight:DATA[index].data[count-1].weight,
            time:DATA[index].data[count-1].time,
            lb:DATA[index].data[count-1].lb,
            id:DATA[index].data[count-1].id + 1
        }
        let temp = [...DATA];
        temp[index].data[count] = push
        setDATA(temp)

        //angle state 처리
        let angle = [...isPressed];
        angle[index].data[count] = false
        setIsPressed(angle)

    }

    //flag =>1 일 경우 rep 조절, 0일 경우 kg 조절
    function handleLeftButtonPressed(index,innerindex,number,flag){
        let temp = [...DATA]
    
        if(flag === 1){    
            let result = Number(temp[index].data[innerindex].rep) - number
            if(result <= 0){
                result = 0
            }
            temp[index].data[innerindex] = {...temp[index].data[innerindex], rep: result};
            setDATA(temp)
        }else{
            let result = Number(temp[index].data[innerindex].weight) - number
            if(result <= 0){
                result = 0
            }
            temp[index].data[innerindex] = {...temp[index].data[innerindex], weight: result};
            setDATA(temp)
        }
    }

    function handleRightButtonPressed(index,innerindex,number,flag){
        if(flag === 1){
            let temp = [...DATA]
            temp[index].data[innerindex] = {...temp[index].data[innerindex], rep: Number(temp[index].data[innerindex].rep) + number};
            setDATA(temp)
        }else{
            let temp = [...DATA]
            temp[index].data[innerindex] = {...temp[index].data[innerindex], weight: Number(temp[index].data[innerindex].weight) + number};
            setDATA(temp)
        }
    }
    // 태그를 새로 만드는 함수
    //setAllTag()에 수정된 데이터 push
    function addNewTag(){
        if(tagCustomize.name !== ''){
            console.log(tagCustomize)
            setAllTag(prevArr => [...prevArr,{name:tagCustomize.name,color:tagCustomize.color,id:tagCustomize.id}])
            setTagCustomize({name:'',color:'#B54B4B',id:1})
            // db에 수정된 데이터 upload
            TagDb.create({name:tagCustomize.name,color:tagCustomize.color})
        }
    }
    function handleTagCustomizeUpdate(event,color){
        setTagUpdate({name:event,color:color,index:tagUpdate.index,id:tagUpdate.id})
    }
    function checkform(index){
        if(DATA[index].title !== ''){
            return true
        }else{
            return false
        }
    }
    function isRendered(){
        // data가 없을 경우는 setisPressed안에 초기값 넣고
        // data가 있을 때는 아무것도 안함
        if(route.params.itemId === 0){
            if(!isPressed){
                setIsPressed([{data:[false]}])
            }
        }
        return true
    }
    function addNewWorkout(index){
        // 한번 클릭한 버튼은 다시 나오면 안됨
        if(DATA[index].title !== ''){
            const temp = {
                title:'',
                tag:[{name:'',color:'',id:1}],
                data:[{rep:'',weight:'',time:null,lb:0,id:0}]
            }
            let res = [...DATA];
            res[index + 1] = temp
            //console.log(res)

            setDATA(res)
            
            // 토글도 새로 만들어 주자
            let toggle = [...isEnabled];
            toggle[index+1] = false
            setIsEnabled(toggle)

            // 단위 변환도 새로 만들어 주자
            let m_toggle = [...measure];
            m_toggle[index+1] = false
            setMeasure(m_toggle)

            //angle state 처리
            let angle = [...isPressed];
            const an_res = {
                data:[false]
            }
            angle[index + 1] = an_res
            setIsPressed(angle)

            return true
        }else{
            return false
        }
    }
    function deleteWorkout(index){
        console.log('삭제버튼 누름')
        if(DATA.length === 1){
            setDATA([{title:'',tag:[{name:'',color:'',id:1}],data:[{rep:'',weight:'',time:''}]}])
            //angle state 처리
            setIsPressed([{data:[false]}])
            setMeasure([false])
            setIsEnabled([false])
            measure
        }else{
            setWhichTag(0)
            setDATA(prevArr => (prevArr.filter((value,i)=>i!==index)))
            //angle state 처리
            setIsPressed(prevArr => (prevArr.filter((value,i)=>i!==index)))
            setMeasure(prevArr => (prevArr.filter((value,i)=>i!==index)))
            setIsEnabled(prevArr => (prevArr.filter((value,i)=>i!==index)))
        }
    }

    function handleTime(event,index){
        let temp = [...DATA];
        temp[index].data[0].time = event
        setDATA(temp)
    }

    function renderfirstSection (){
        return(
            <View>
                <View horizontal={true} style={styles.alltag}>
                    {
                        TagColors.map((d,i)=>(
                            <TouchableOpacity key={i} onPress={()=>{
                                setTagCustomize({name:tagCustomize.name,color:d,id:tagCustomize.id})
                            }}>
                                <View style={[styles.alltagcolor,{backgroundColor:d}]}></View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={{marginTop:10}}>
                    <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                        <TextInput
                            style={{ height:23, fontFamily:'RobotoBold',fontSize:SIZES.body5,color:COLORS.lightWhite,backgroundColor:tagCustomize.color,paddingRight:5,paddingLeft:5, borderRadius:SIZES.radius}}
                            onChangeText={(event)=>handleTagCustomizeAdd(event,tagCustomize.color)}
                            value={tagCustomize.name}
                            // onEndEditing={()=>onEndEditing()}
                            autoCompleteType='off'
                            placeholder='태그명을 입력하세요'
                            autoCorrect={false}
                            placeholderTextColor='#ffffff'
                        />
                        <TouchableOpacity
                            style={{marginLeft:10}}
                            onPress={()=>{
                                addNewTag()
                            }}
                        >
                            {
                                tagCustomize.name !== ''?
                                <FontAwesome
                                name="check"
                                color={'#404040'}
                                style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],marginRight:20}}
                                />:
                                <FontAwesome
                                name="check"
                                color={COLORS.gray}
                                style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],marginRight:20}}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    function renderSecondSection (){
        return(
            <View>
                <ScrollView style={{paddingTop:SIZES.padding2}} horizontal={true}>  
                    {
                    AllTag.map((d,i)=>(
                        <TouchableOpacity key={i} onPress={()=>{
                            setTagUpdate({name:d.name,color:d.color,id:d.id,index:i})
                        }}>
                            <Tag name={d.name} color={d.color}></Tag>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.alltag}>
                    {
                        TagColors.map((d,i)=>(
                            <TouchableOpacity key={i} onPress={()=>{
                                setTagUpdate({name:tagUpdate.name,color:d,id:tagUpdate.id,index:tagUpdate.index})
                            }}>
                                <View style={[styles.alltagcolor,{backgroundColor:d}]}></View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                {
                    tagUpdate.index !== null ?
                    <View style={{marginTop:10}}>
                        <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>{
                                Alert.alert(
                                    "정말 삭제하시겠습니까?",
                                    `${tagUpdate.name} 태그를 삭제합니다`,
                                    [
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    { text: "OK", onPress: () => deleteTag()}
                                    ],
                                    { cancelable: false }
                                );
                            }}>
                                <FontAwesome
                                    name="trash"
                                    style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],marginRight:10}}
                                />
                            </TouchableOpacity>
                            <View style={{height:20,backgroundColor:tagUpdate.color, borderRadius:SIZES.radius,justifyContent:'center'}}>
                                <View style={{paddingHorizontal:8}}>
                                    <TextInput
                                        style={{color:COLORS.lightWhite,fontFamily:'RobotoBold',fontSize:SIZES.body5}}
                                        onChangeText={(event)=>handleTagCustomizeUpdate(event,tagUpdate.color)}
                                        value={tagUpdate.name}
                                        // onEndEditing={()=>onEndEditing()}
                                        autoCompleteType='off'
                                        placeholder='태그명을 입력하세요'
                                        autoCorrect={false}
                                        placeholderTextColor='#ffffff'
                                    />
                                </View>
                            </View>
                            <TouchableOpacity
                                style={{marginLeft:10}}
                                onPress={()=>{
                                    updateTagCustom()
                                }}
                            >
                                {
                                    tagUpdate.name !== ''?
                                    <FontAwesome
                                    name="check"
                                    color={'#404040'}
                                    style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                                    />:
                                    <FontAwesome
                                    name="check"
                                    color={COLORS.gray}
                                    style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                                    />
                                }
                            </TouchableOpacity>
                        </View>
                    </View> :
                    <View></View>
                }
            </View>
        )
    }
    const renderbottomsheet = () => (
        <ScrollView style={styles.tagContainer}>
            <View style={styles.rowcontainer}>
                <View>
                    <Text style={{ fontSize:SIZES.h4,fontFamily:'RobotoRegular'}}>태그 관리</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                    setBottomSheetOpened(false)
                    TagSheet.current.snapTo(1)
                }}>
                    <FontAwesome
                        name="check"
                        style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.tagTitleContainer}>
                <Text style={styles.title}>태그 목록</Text>
                <Line3/>
                <ScrollView style={{paddingTop:SIZES.padding2}} horizontal={true}>  
                    {
                    AllTag.map((d,i)=>(
                        <TouchableOpacity key={i} onPress={()=>{
                            handleTagAdd(i)
                        }}>
                            <Tag name={d.name} color={d.color}></Tag>
                        </TouchableOpacity>
                    ))}  
                </ScrollView>
            </View>

            <View style={styles.tagTitleContainer}>
                <Text style={styles.title}>선택된 태그</Text>
                <Line3/>
                <ScrollView horizontal={true} style={{flexDirection:'row',paddingTop:SIZES.padding2}}>
                {
                    DATA[whichTag].tag.map((d,i)=>(
                        <TouchableOpacity key={i} onPress={()=>{
                            handleTagDelete(whichTag,i)
                        }}>
                            <Tag name={d.name} color={d.color}></Tag>
                        </TouchableOpacity>
                    ))
                }
                </ScrollView>
            </View>

            <View style={styles.tagTitleContainer}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>setFirstAngle(!firstAngle)}>
                        <Text style={styles.title}>태그 추가</Text>
                    </TouchableOpacity>
                    {
                        !firstAngle?
                        <TouchableOpacity style={{marginTop:5}} onPress={()=>setFirstAngle(!firstAngle)}>
                            <FontAwesome
                                name="angle-down"
                                style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{marginTop:5}} onPress={()=>setFirstAngle(!firstAngle)}>
                            <FontAwesome
                                name="angle-up"
                                style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
                            />
                        </TouchableOpacity>
                    }
                </View>
                <Line3/>
                {
                    firstAngle?
                    renderfirstSection():
                    <View></View>
                }
            </View>
            <View style={styles.tagTitleContainer}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>setSecondAngle(!secondAngle)}>
                        <Text style={styles.title}>태그 편집</Text>
                    </TouchableOpacity>
                        {
                            !secondAngle?
                            <TouchableOpacity style={{marginTop:5}} onPress={()=>setSecondAngle(!secondAngle)}>
                                <FontAwesome
                                    name="angle-down"
                                    style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{marginTop:5}} onPress={()=>setSecondAngle(!secondAngle)}>
                                <FontAwesome
                                    name="angle-up"
                                    style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
                                />
                            </TouchableOpacity>
                        }
                </View>
                <Line3/>
                {
                    secondAngle?
                    renderSecondSection():
                    <View></View>
                }
            </View>
            <View style={{height:350}}></View>
        </ScrollView>
    )
    const TagSheet = React.useRef(null);

    function renderAnglePressedForm(index,innerindex){
        return(
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                <View style={{marginLeft:'25%'}}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,1,0)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>- 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,1,0)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>+1</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,5,0)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>- 5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,5,0)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>+5</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginRight:'10%'}}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,1,1)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>- 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,1,1)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>+1</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,5,1)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>- 5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,5,1)
                        }}>
                            <Text style={[styles.text,{color:'#404040'}]}>+5</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    function rendersets(item,innerindex,index){
        //console.log(isPressed)
        return(
            <View key={innerindex}>
            <View style={styles.rowcontainer}>
                <TouchableOpacity onPress={()=>{
                        togglePressed(index,innerindex)
                    }}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        {
                            isPressed&&isPressed[index].data[innerindex]&&
                            <FontAwesome name="angle-up" color={COLORS.primary} style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}/>
                        }
                        {
                            isPressed&&!isPressed[index].data[innerindex]&&
                            <FontAwesome name="angle-down" style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}/>
                        }
                        <Text style={[styles.text,{marginLeft:SIZES.padding2*2}]}>{innerindex + 1}세트</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{alignItems:'center'}}>
                    <TextInput
                        keyboardType='numeric'
                        style={{ fontSize:SIZES.body4,fontFamily:'RobotoRegular'}}
                        onChangeText={(event)=>handleWeight(event,innerindex,index)}
                        value={DATA[index].data[innerindex].weight.toString()}
                        autoCompleteType='off'
                        placeholder='  '
                        autoCorrect={false}
                    />
                    <Line1/>
                    </View>
                    {
                        measure[index]?
                        <Text style={styles.text}>lb</Text>:
                        <Text style={styles.text}>kg</Text>
                    }
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{alignItems:'center'}}>
                        <TextInput
                            keyboardType='numeric'
                            style={{ fontSize:SIZES.body4,fontFamily:'RobotoRegular'}}
                            onChangeText={(event)=>handleReps(event,innerindex,index)}
                            value={DATA[index].data[innerindex].rep.toString()}
                            autoCompleteType='off'
                            placeholder='  '
                            autoCorrect={false}
                        />
                        <Line1/>
                    </View>
                    <Text style={[styles.text,{marginTop:4}]}>회</Text>
                </View>
                <TouchableOpacity style={{marginRight:SIZES.padding,marginTop:1}} onPress={()=>{
                    delSets(index,innerindex)
                }}>
                    <FontAwesome
                    name="minus"
                    style={{transform: [{ scaleX: 1 }, { scaleY: 0.5 }]}}
                    />
                </TouchableOpacity>
            </View>
            {
                isPressed&&isPressed[index].data[innerindex]&&
                renderAnglePressedForm(index,innerindex)
            }
            </View>
        )
    }

    function renderTagPlus(index){
        return(
            <TouchableOpacity onPress={()=>{
                    setWhichTag(index)
                    TagSheet.current.snapTo(0)
                    setBottomSheetOpened(!bottomSheetOpened)
                }}>
                <Tag name='+ 태그추가' color={COLORS.primary}></Tag>
            </TouchableOpacity>
        )
    }

    function renderAerobic(index){
        return(
            <View>
                <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body3}}>운동 시간</Text>
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={{alignItems:'center'}}>
                            <TextInput
                            keyboardType='numeric'
                            style={{ fontSize:SIZES.body4,fontFamily:'RobotoRegular'}}
                            onChangeText={(event)=>handleTime(event,index)}
                            value={DATA[index].data[0].time.toString()}
                            autoCompleteType='off'
                            placeholder='  '
                            autoCorrect={false}
                            />
                            <Line1/>
                        </View>
                        <Text style={styles.text}>분</Text>
                    </View>
                    </View>
            </View>
        )
    }

    function renderAddSets(index){
        return(
            <View style={{flexDirection:'row', alignItems:'center',marginTop:SIZES.padding}}>
                <TouchableOpacity onPress={()=>{
                    addSets(index)
                }}>
                    <FontAwesome
                        name="plus"
                        color={COLORS.primary}
                        style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    addSets(index)
                }}>
                    <Text style={{marginLeft:SIZES.padding2*2,fontSize:SIZES.body3,fontFamily:'RobotoRegular',color:'#C4C4C6'}}>세트추가</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function checkandRender(index) {
        if(DATA.length - index <= 1){
            return(
                <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}} onPress={()=>{
                    addNewWorkout(index)
                }}>
                    <Text style={[styles.text,{color:COLORS.primary}]} >새로운 운동 추가</Text>
                </TouchableOpacity>
            )
        }
    }

    function renderHeader(index){
        //console.log(DATA)
        return(
            <>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <TextInput
                        style={{ fontSize:SIZES.h4,fontFamily:'RobotoRegular'}}
                        onChangeText={(event)=>handelTitle(event,index)}
                        value={DATA[index].title}
                        placeholder='제목'
                        // onEndEditing={()=>onEndEditing()}
                        autoCompleteType='off'
                        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={()=>{
                        Alert.alert(
                            "정말 삭제하시겠습니까?",
                            `${DATA[index].title}을 삭제합니다`,
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                              },
                              { text: "OK", onPress: () => deleteWorkout(index) }
                            ],
                            { cancelable: false }
                          );
                    }}>
                        <FontAwesome
                            name="trash"
                            color={COLORS.gray}
                            style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],marginRight:10}}
                        />
                    </TouchableOpacity>
                </View>       
                <Line2/>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between', marginTop:SIZES.padding}}>
                    <ScrollView horizontal={true} contentContainerStyle={{alignItems:'center'}}>
                    {renderTagPlus(index)}
                    {
                        DATA[index].tag.map((item,j)=>(                        
                            <TouchableOpacity key={j} onPress={()=>{
                                handleTagDelete(index,j)
                            }}>
                                <Tag name={item.name} color={item.color}></Tag>
                            </TouchableOpacity>
                        ))
                    }
                    </ScrollView>
                </View>
            </>
        )
    }

    function renderBody(index){
        //console.log(DATA)
        return(
            <>
            <View style={{margin:'3%'}}>
                <View style={styles.rowcontainer}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <FontAwesome
                            name="fire"
                            color={COLORS.primary}
                            style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:10}}
                        />
                        <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body3}}>유산소</Text>
                    </View>
                    <Switch
                        trackColor={{true:COLORS.primary}}
                        onValueChange={()=>toggleSwitch(index)}
                        value={isEnabled[index]}
                        style={{transform: [{ scaleX: .7 }, { scaleY: .7 }]}}
                    />
                </View>
                {!isEnabled[index]?
                <View style={styles.rowcontainer}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <FontAwesome
                            name="wrench"
                            color={COLORS.primary}
                            style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:10}}
                        />
                        <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body3}}>단위변환</Text>
                    </View>
                    <Switch
                        trackColor={{true:COLORS.primary}}
                        onValueChange={()=>toggleMeasure(index)}
                        value={measure[index]}
                        style={{transform: [{ scaleX: .7 }, { scaleY: .7 }]}}
                    />
                </View>:<></>}
                {   
                    !isEnabled[index]?
                    DATA[index].data.map((item,innerindex)=>rendersets(item,innerindex,index)):
                    renderAerobic(index)
                }
                {
                    !isEnabled[index]?
                    renderAddSets(index):
                    <></>
                }
            </View>
            <View  style={{marginBottom:20}}/>
            {
                checkandRender(index)
            }
            </>
        )
    }

    // function renderForm(data,index){
    //     return(
    //         <View key={index}>
    //         {renderHeader(index)}
    //         {
    //             checkform(index)?
    //             (<>{
    //               isPressed&&renderBody(index)
    //             }</>):
    //             <></>
    //         }
    //         </View>
    //     )
    // }

    function showWorkout (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`SELECT * FROM workout`)
        .then((response) => {
            console.log(response.rows)
        })
    }
    function showSession (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`SELECT * FROM session`)
        .then((response) => {
            console.log(response.rows)
        })
    }
    function showSets (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`SELECT * FROM sets`)
        .then((response) => {
            console.log(response.rows)
        })
    }
    function showTag (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`SELECT * FROM tag`)
        .then((response) => {
            console.log(response.rows)
        })
    }
    function showWST (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`SELECT * FROM workout_session_tag`)
        .then((response) => {
            console.log(response.rows)
        })
    }
    function showSS (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(`SELECT * FROM session_set`)
        .then((response) => {
            console.log(response.rows)
        })
    }
    function showAll (){
        const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('upgradeDB.db'))
        databaseLayer.executeSql(GET_ALL_BY_WORKOUT_ID+`WHERE workout.id=2`)
        .then((response) => {
            console.log(response.rows)
        })
    }

    function renderForm(data,index){
        return(
            isRendered()?
            (<View key={index}>{
                isPressed?
                <View >
                    {renderHeader(index)}
                    {
                        checkform(index)?
                        renderBody(index):
                        <></>
                    }
                </View>:
                <Text>로딩중입니다</Text>
            }</View>)
            :<></>
        )
    }

    return (
        <>{bottomSheetOpened?
            <SafeAreaView style={{flex:1,backgroundColor:'#CCCCCC'}}>
                <ScrollView>
                    <View style={{margin:'5%',}}>
                        {
                            DATA.map((data,index)=>renderForm(data,index))
                        }
                    </View>
                    <View style={{height:600}}></View>
                </ScrollView>
            </SafeAreaView>
            :
            <SafeAreaView style={{flex:1}}>
                <ScrollView>
                    <View style={{margin:'5%',}}>
                        {
                            DATA.map((data,index)=>renderForm(data,index))
                        }
                    </View>
                    <Button
                        onPress={showWorkout}
                        title="show workout"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={showSession}
                        title="show Session"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={showSets}
                        title="show sets"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={showTag}
                        title="show tag"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={showWST}
                        title="show workout session tag"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={showSS}
                        title="show session set"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                        onPress={showAll}
                        title="show All"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                    <View style={{height:600}}></View>
                </ScrollView>
            </SafeAreaView>
            }
            <BottomSheet
                ref={TagSheet}
                snapPoints={[750, 0, 0]}
                borderRadius={20}
                renderContent={()=>renderbottomsheet()}
                initialSnap={1}
                enabledContentTapInteraction={false}
                onCloseEnd={()=>setBottomSheetOpened(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    primary: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tag:{
        color: COLORS.lightWhite,
        fontFamily:'RobotoBold',
        fontSize:SIZES.body4,
        textAlign:'center',
        padding:"0.5%",
        paddingRight:"2%",
        paddingLeft:"2%"
    },
    rowcontainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop:3,
        marginBottom:3
    },
    title: {
        fontSize: SIZES.body3,
        fontFamily: 'RobotoMedium',
        paddingRight: SIZES.base,
    },
    text:{
        fontFamily:'RobotoLight',
        fontSize:SIZES.body3
    },
    tagContainer:{
        backgroundColor: 'white',
        padding: SIZES.padding*2,
        height: 750,
    },
    tagTitleContainer:{
        marginTop:12,
        marginBottom:12,
        marginLeft:6
    },
    leftbuttonContainer:{
        backgroundColor:'#E9E9EB',
        borderRadius:SIZES.radius*3,
        margin:3,
        paddingHorizontal:15,
        paddingVertical:8,
        justifyContent:'center'
    },
    rightbuttonContainer:{
        backgroundColor:'#E9E9EB',
        borderRadius:SIZES.radius*3,
        margin:3,
        paddingHorizontal:15,
        justifyContent:'center'
    },
    alltag:{
        flexDirection:'row',
        marginTop:SIZES.padding2,
        marginLeft:'1%',
        flexWrap:'wrap',
        justifyContent:'center'
    },
    alltagcolor:{
        marginVertical:5,
        marginRight:SIZES.padding2,
        borderRadius:35,
        width:SIZES.h2,
        height:SIZES.h2
    }
})

export default Workout;