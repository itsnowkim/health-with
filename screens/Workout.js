import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, TextInput, Alert } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../constants';
import Line3 from '../components/Line3';
import Tag from '../components/Tag';
import Line2 from '../components/Line2';
import Line1 from '../components/Line1';
import { FontAwesome } from '@expo/vector-icons';

import Animated, { color } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

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
        del[index].data = [{rep:'',time:'',weight:''}]
        setDATA(del)
    }
    const [measure, setMeasure] = useState([false]);
    const toggleMeasure = (index) => {
        let temp = [...measure];
        temp[index] = !temp[index]
        setMeasure(temp)

        if(isEnabled[index]=== true){
            toggleSwitch(index)
        }
    }

    // angledown, angleup 판단하는 state - DATA.data 개수만큼 true,false 있어야 함
    const [isPressed, setIsPressed] = useState([{
        data:[false]
    }])
    const togglePressed = (index,innerindex) => {
        let temp = [...isPressed];
        console.log(index,innerindex)

        temp[index].data[innerindex] = !temp[index].data[innerindex]
        setIsPressed(temp)
    }
    

    const [bottomSheetOpened,setBottomSheetOpened] = useState(false)
    const [whichTag,setWhichTag] =useState(0)

    const TagColors = ["#B54B4B", "#DB6E15","#CC8042", "#FBBB0D", "#E6BA35", "#97D53F","#6A8B3A","#3A8B46","#3A8B86","#32BAB2","#3790C9","#576BCF","#7A5ACB","#B25ACB","#CB5A97"]

    const [tagCustomize,setTagCustomize] = useState({
        name:'',
        color:'#20C997'
    })
    const [tagUpdate,setTagUpdate] = useState({
        name: '',
        color: '',
        index: null
    })
    const [firstAngle,setFirstAngle] = useState(false)
    const [secondAngle,setSecondAngle] = useState(false)

    // 임시
    const [DATA,setDATA] = useState([
        {
            title:'',
            tag:[{name:'',color:''}],
            data:[{rep:'',weight:'',time:''}]
        }
    ])
    const [AllTag,setAllTag] = useState([
        {name:'등',color:COLORS.tag_darkblue},
        {name:'가슴',color:COLORS.tag_green},
        {name:'어깨',color:COLORS.tag_pink},
        {name:'하체',color:COLORS.tag_purple}
    ])
    // const [DATA, setDATA] = useState([
    //     {
    //       title: '랫풀다운',
    //       tag: [{name:'등',color:COLORS.tag_darkblue}],
    //       data: [
    //         {rep: 10, weight: 40, time: null},
    //         {rep: 10, weight: 40, time: null},
    //         {rep: 10, weight: 40, time: null},
    //         {rep: 10, weight: 40, time: null},
    //         {rep: 10, weight: 40, time: null}
    //       ]
    //     },
    //     {
    //       title: '데드리프트',
    //       tag: [{name:'등',color:COLORS.tag_darkblue},{name:'하체',color:COLORS.tag_purple}],
    //       data: [
    //         {rep: 10, weight: 80, time: null},
    //         {rep: 10, weight: 80, time: null},
    //         {rep: 10, weight: 80, time: null},
    //         {rep: 10, weight: 80, time: null},
    //         {rep: 10, weight: 100, time: null},
    //       ]
    //     }
    //   ])

    function fetchData(itemId){
        // local에서 DATA 가져와서 넣기
        console.log('fetchData')
    }

    useEffect(()=> {
        // 처음 마운트 되었을 때 넘어온 id로 local storage에서 get.
        const {itemId} = route.params;
        //console.log(itemId)

        if (itemId === 2){
            // no item id, 새로 작성하는 경우
            console.log('생성')
        }else{
            // get data from local storage
            console.log('수정')
            fetchData(itemId)
        }
        // 화면을 나갈 때 변경사항이 있는지 체크(저장할 경우 data가 바뀌므로)
        return () => {
            console.log('Workout Page 언마운트')
        }
    }, []);

    // useEffect(()=>{
    //     //DATA 길이가 변경되었을 경우 실행 - 토글 어디에 붙일지 모르니까 인덱싱 작업 필요
    //     if(DATA.LE)

    // },[DATA])

    function handleTagAdd(index){
        // 체크해서 이미 있으면 아무것도 안함.
        let color = AllTag[index].color
        let name = AllTag[index].name

        let temp = [...DATA];

        let istrue = false
        temp[whichTag].tag.map((i,j)=>{
            if(i.name === name){
                istrue = true
            }
        })

        // 찾는함수
        if(!istrue){
            //문제 없음
            if(temp[whichTag].tag.length === 0){
                temp[whichTag].tag = [...temp[whichTag].tag,{color:color,name:name}]
            }else{
                if(temp[whichTag].tag[0].name===''){
                    temp[whichTag].tag[0] = {...temp[whichTag].tag[index], color:color,name:name};
                }else{
                    temp[whichTag].tag = [...temp[whichTag].tag,{color:color,name:name}]
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
            temp[tagUpdate.index] = {...temp[tagUpdate.index], name:tagUpdate.name,color:tagUpdate.color}
            //console.log(temp)
            setAllTag(temp)
        }
    }
    function handleTagCustomizeAdd(event,color){
        setTagCustomize({name:event,color:color})
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
            time:DATA[index].data[count-1].time
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
        console.log(index,innerindex,number,flag)
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
    // db에 수정된 데이터 upload
    //setAllTag()에 수정된 데이터 push
    function addNewTag(){
        if(tagCustomize.name !== ''){
            setAllTag(prevArr => [...prevArr,{name:tagCustomize.name,color:tagCustomize.color}])
            setTagCustomize({name:'',color:'#20C997'})
        }
    }
    function handleTagCustomizeUpdate(event,color){
        setTagUpdate({name:event,color:color,index:tagUpdate.index})
    }
    function checkform(index){
        if(DATA[index].title !== ''){
            return true
        }else{
            return false
        }
    }
    function addNewWorkout(index){
        // 한번 클릭한 버튼은 다시 나오면 안됨
        if(DATA[index].title !== ''){
            const temp = {
                title:'',
                tag:[],
                data:[{rep:'',weight:'',time:''}]
            }
            let res = [...DATA];
            res[index + 1] = temp
            console.log(res)

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
            setDATA([{title:'',tag:[],data:[{rep:'',weight:'',time:''}]}])
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
                                setTagCustomize({name:tagCustomize.name,color:d})
                            }}>
                                <View style={[styles.alltagcolor,{backgroundColor:d}]}></View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={{marginTop:30}}>
                    <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-around'}}>
                        <TextInput
                            style={{ height:23, fontFamily:'RobotoBold',fontSize:SIZES.body4,color:COLORS.lightWhite,backgroundColor:tagCustomize.color,paddingRight:5,paddingLeft:5, borderRadius:SIZES.radius}}
                            onChangeText={(event)=>handleTagCustomizeAdd(event,tagCustomize.color)}
                            value={tagCustomize.name}
                            // onEndEditing={()=>onEndEditing()}
                            autoCompleteType='off'
                            placeholder='태그명을 입력하세요'
                            autoCorrect={false}
                            placeholderTextColor='#ffffff'
                        />
                        <TouchableOpacity
                            onPress={()=>{
                                addNewTag()
                            }}
                        >
                            {
                                tagCustomize.name !== ''?
                                <FontAwesome
                                name="check"
                                color={COLORS.primary}
                                style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
                                />:
                                <FontAwesome
                                name="check"
                                color={COLORS.gray}
                                style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
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
                            setTagUpdate({name:d.name,color:d.color,index:i})
                        }}>
                            <Tag name={d.name} color={d.color}></Tag>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.alltag}>
                    {
                        TagColors.map((d,i)=>(
                            <TouchableOpacity key={i} onPress={()=>{
                                setTagUpdate({name:tagUpdate.name,color:d,index:tagUpdate.index})
                            }}>
                                <View style={[styles.alltagcolor,{backgroundColor:d}]}></View>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                {
                    tagUpdate.index !== null ?
                    <View style={{marginTop:30}}>
                        <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-around'}}>
                            <TextInput
                                style={{ height:23, fontFamily:'RobotoBold',fontSize:SIZES.body4,color:COLORS.lightWhite,backgroundColor:tagUpdate.color,paddingRight:5,paddingLeft:5, borderRadius:SIZES.radius}}
                                onChangeText={(event)=>handleTagCustomizeUpdate(event,tagUpdate.color)}
                                value={tagUpdate.name}
                                // onEndEditing={()=>onEndEditing()}
                                autoCompleteType='off'
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={()=>{
                                    updateTagCustom()
                                }}
                            >
                                {
                                    tagUpdate.name !== ''?
                                    <FontAwesome
                                    name="check"
                                    color={COLORS.primary}
                                    style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
                                    />:
                                    <FontAwesome
                                    name="check"
                                    color={COLORS.gray}
                                    style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],marginRight:20}}
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
                <View style={{marginLeft:'22%'}}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,1,0)
                        }}>
                            <Text style={[styles.text,{color:COLORS.primary}]}>- 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,1,0)
                        }}>
                            <Text style={[styles.text,{color:'white'}]}>+1</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,5,0)
                        }}>
                            <Text style={[styles.text,{color:COLORS.primary}]}>- 5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,5,0)
                        }}>
                            <Text style={[styles.text,{color:'white'}]}>+5</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginRight:'10%'}}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,1,1)
                        }}>
                            <Text style={[styles.text,{color:COLORS.primary}]}>- 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,1,1)
                        }}>
                            <Text style={[styles.text,{color:'white'}]}>+1</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.leftbuttonContainer} onPress={()=>{
                            handleLeftButtonPressed(index,innerindex,5,1)
                        }}>
                            <Text style={[styles.text,{color:COLORS.primary}]}>- 5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rightbuttonContainer} onPress={()=>{
                            handleRightButtonPressed(index,innerindex,5,1)
                        }}>
                            <Text style={[styles.text,{color:'white'}]}>+5</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    function rendersets(item,innerindex,index){
        return(
            <View key={innerindex}>
            <View style={styles.rowcontainer}>
                <TouchableOpacity onPress={()=>{
                        togglePressed(index,innerindex)
                    }}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        {
                            isPressed[index].data[innerindex]?
                            <FontAwesome name="angle-up" color={COLORS.primary} style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}/>
                            :
                            <FontAwesome name="angle-down" style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}/>
                        }
                        <Text style={[styles.text,{marginLeft:SIZES.padding2*2}]}>{innerindex + 1}세트</Text>
                    </View>
                </TouchableOpacity>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{alignItems:'center'}}>
                    <TextInput
                        keyboardType='numeric'
                        style={{ fontSize:SIZES.body4,fontFamily:'RobotoBold'}}
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
                            style={{ fontSize:SIZES.body4,fontFamily:'RobotoBold'}}
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
                <TouchableOpacity style={{marginRight:SIZES.padding}} onPress={()=>{
                    delSets(index,innerindex)
                }}>
                    <FontAwesome
                    name="minus"
                    style={{transform: [{ scaleX: 1 }, { scaleY: 1 }]}}
                    />
                </TouchableOpacity>
            </View>
            {
                isPressed[index].data[innerindex]?
                renderAnglePressedForm(index,innerindex)
                :
                <></>
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
                            style={{ fontSize:SIZES.body4,fontFamily:'RobotoBold'}}
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
                        style={{ fontSize:SIZES.h4,fontFamily:'RobotoBold'}}
                        onChangeText={(event)=>handelTitle(event,index)}
                        value={DATA[index].title}
                        autoFocus={true}
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
                    <ScrollView horizontal={true}>
                    {
                        renderTagPlus(index)
                    }
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
                        {
                            !isEnabled[index]?
                            <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body3}}>웨이트 트레이닝</Text>:
                            <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body3}}>유산소 운동</Text>
                        }
                    </View>
                    <Switch
                        trackColor={{true:COLORS.primary}}
                        onValueChange={()=>toggleSwitch(index)}
                        value={isEnabled[index]}
                        style={{transform: [{ scaleX: .7 }, { scaleY: .7 }]}}
                    />
                </View>
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
                </View>
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

    function renderForm(data,index){
        return(
            <View key={index}>
            {renderHeader(index)}
            {
                checkform(index)?
                renderBody(index):
                <View/>
            }
            </View>
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
                    <View style={{height:600}}></View>
                </ScrollView>
            </SafeAreaView>
            }
            <BottomSheet
                ref={TagSheet}
                snapPoints={[680, 0, 0]}
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
        paddingBottom:10
    },
    text:{
        fontFamily:'RobotoRegular',
        fontSize:SIZES.body3
    },
    tagContainer:{
        backgroundColor: 'white',
        padding: SIZES.padding*2,
        height: 680,
    },
    tagTitleContainer:{
        marginTop:12,
        marginBottom:12
    },
    leftbuttonContainer:{
        backgroundColor:COLORS.secondary,
        borderRadius:SIZES.radius*3,
        margin:5,
        paddingHorizontal:10,
        justifyContent:'center'
    },
    rightbuttonContainer:{
        backgroundColor:COLORS.primary,
        borderRadius:SIZES.radius*3,
        margin:5,
        paddingHorizontal:10,
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