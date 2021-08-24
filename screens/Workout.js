import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch, TextInput } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../constants';
import Line3 from '../components/Line3';
import Tag from '../components/Tag';
import Line2 from '../components/Line2';
import Line1 from '../components/Line1';
import { FontAwesome } from '@expo/vector-icons';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

const Workout = ({ route }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [bottomSheetOpened,setBottomSheetOpened] = useState(false)
    const [whichTag,setWhichTag] =useState(0)

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
    // const [DATA,setDATA] = useState([
    //     {
    //         title: '랫풀다운',
    //         tag: [{name:'등',color:COLORS.tag_orange}],
    //         data: [
    //             {rep: 10, weight: 40, time: null},
    //             {rep: 10, weight: 40, time: null},
    //             {rep: 10, weight: 40, time: null},
    //             {rep: 10, weight: 40, time: null},
    //             {rep: 10, weight: 40, time: null}
    //         ]
    //     },
    //     {
    //         title: '데드리프트',
    //         tag: [{name:'등',color:COLORS.tag_darkblue},{name:'하체',color:COLORS.tag_purple}],
    //         data: [
    //             {rep: 10, weight: 80, time: null},
    //             {rep: 10, weight: 80, time: null},
    //             {rep: 10, weight: 80, time: null},
    //             {rep: 10, weight: 80, time: null},
    //             {rep: 10, weight: 100, time: null},
    //         ]
    //     }
    // ])

    function fetchData(){
        // get data from local storage
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
            //temp[whichTag].tag[index] = {...temp[whichTag].tag[index], color:color,name:name};
            //아예 빈 배열이라면?
            // if(temp[whichTag].tag[index].name===''){
            //     temp[whichTag].tag[index] = {...temp[whichTag].tag[index], color:color,name:name};
            // }else{
            //     temp[whichTag].tag = [...temp[whichTag].tag,{color:color,name:name}]
            // }

            //temp[whichTag].tag = [...temp[whichTag].tag,{color:color,name:name}]
            setDATA(temp)
        }
        console.log(temp)
    }
    function handleTagDelete(index){        
        const temp = DATA[whichTag].tag.filter((item,j)=>j!==index);
        console.log(temp)
        let result = [...DATA];
        result[whichTag] = {...result[whichTag],tag:temp}
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

    // useEffect(()=>{
    //     if (bottomSheetOpened === true){
    //         //change background color
    //         console.log('opened!')
    //         let backgroundColor = 'red'
    //         styles.container.backgroundColor = backgroundColor
    //     }else{
    //         console.log('closed!')
    //         let backgroundColor = 'blue'
    //         styles.container.backgroundColor = backgroundColor
    //     }
    // },[bottomSheetOpened])

    function bottomSheetController (){
        setBottomSheetOpened(!bottomSheetOpened)
    }

    const renderbottomsheet = () => (
        <View style={styles.tagContainer}>
            <View style={styles.tagTitleContainer}>
                <Text style={styles.title}>태그 목록</Text>
                <View style={{flexDirection:'row',paddingTop:SIZES.padding2}}>
                    {
                    AllTag.map((d,i)=>(
                        <TouchableOpacity key={i} onPress={()=>{
                            handleTagAdd(i)
                        }}>
                        <Tag name={d.name} color={d.color}></Tag>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <Line3/>

            <View style={styles.tagTitleContainer}>
                <Text style={styles.title}>선택된 태그</Text>  
                <View style={{flexDirection:'row',paddingTop:SIZES.padding2}}>
                {
                    DATA[whichTag].tag.map((d,i)=>(
                        <TouchableOpacity key={i} onPress={()=>{
                            handleTagDelete(i)
                        }}>
                            <Tag name={d.name} color={d.color}></Tag>
                        </TouchableOpacity>
                    ))
                }
                </View>
            </View>
            <Line3/>

            <View style={styles.tagTitleContainer}>
                <Text style={styles.title}>태그 관리</Text>    
            </View>
        </View>
    )
    
    const TagSheet = React.useRef(null);

    function rendersets(item,innerindex,index){
        return(
            <View key={innerindex} style={styles.rowcontainer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <FontAwesome
                    name="arrow-right"
                    backgroundColor={COLORS.transparent}
                    color={COLORS.primary}
                    style={{transform: [{ scaleX: 1.2 }, { scaleY: 1 }]}}
                    />
                    <Text style={[styles.text,{marginLeft:SIZES.padding2*2}]}>1세트</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={{alignItems:'center',marginRight:SIZES.padding}}>
                    <TextInput
                        style={{ fontSize:SIZES.body3,fontFamily:'RobotoBold'}}
                        onChangeText={(event)=>handleWeight(event,innerindex,index)}
                        value={DATA[index].data[innerindex].weight}
                        // onEndEditing={()=>onEndEditing()}
                        autoCompleteType='off'
                        placeholder='  '
                        autoCorrect={false}
                    />
                    <Line1/>
                    </View>
                    <Text style={styles.text}>kg</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <View style={{alignItems:'center',marginRight:SIZES.padding}}>
                    <TextInput
                        style={{ fontSize:SIZES.body3,fontFamily:'RobotoBold'}}
                        onChangeText={(event)=>handleReps(event,innerindex,index)}
                        value={DATA[index].data[innerindex].rep}
                        // onEndEditing={()=>onEndEditing()}
                        autoCompleteType='off'
                        placeholder='  '
                        autoCorrect={false}
                    />
                    <Line1/>
                    </View>
                    <Text style={styles.text}>회</Text>
                </View>
                <TouchableOpacity><Text style={{color:COLORS.primary, fontSize:SIZES.body1,fontFamily:'RobotoBold',marginRight:'3%',marginBottom:3}}>-</Text></TouchableOpacity>
            </View>
        )
    }

    function renderTagPlus(index){
        return(
            <TouchableOpacity onPress={()=>{
                    setWhichTag(index)
                    TagSheet.current.snapTo(0)
                }}>
                <Tag name='+ 태그추가' color={COLORS.primary}></Tag>
            </TouchableOpacity>
        )
    }

    function renderHeader(index){
        console.log(DATA)
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
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                    {
                        DATA[index].tag.map((item,index)=>(                        
                            <TouchableOpacity key={index} onPress={()=>{
                                handleTagDelete(index)
                            }}>
                                <Tag name={item.name} color={item.color}></Tag>
                            </TouchableOpacity>
                        ))
                    }
                    {
                        renderTagPlus(index)
                    }
                    </View>
                    
                </View>
                <Line2/>
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
                        <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body4}}>아이콘</Text>
                        <Text style={{fontFamily:'RobotoRegular',fontSize:SIZES.body4}}>고급기능</Text>
                    </View>
                    <Switch
                        trackColor={{true:COLORS.primary}}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                        style={{transform: [{ scaleX: .8 }, { scaleY: .8 }]}}
                    />
                </View>
                {
                    DATA[index].data.map((item,innerindex)=>rendersets(item,innerindex,index))
                }
                <View style={{flexDirection:'row', alignItems:'center',marginTop:SIZES.padding}}>
                    <FontAwesome
                    name="plus"
                    backgroundColor={COLORS.transparent}
                    color={COLORS.primary}
                    style={{transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }]}}
                    />
                    <TouchableOpacity>
                    <Text style={{marginLeft:SIZES.padding2*2,fontSize:SIZES.body3,fontFamily:'RobotoRegular',color:'#C4C4C6'}}>세트추가</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{marginTop:40, marginBottom:40}}>
                <Line3/>
            </View>
            </>
        )
    }

    function renderForm(data,index){
        return(
            <View key={index}>
            {renderHeader(index)}
            {renderBody(index)}
            </View>
        )
    }

    return (
        <>{bottomSheetOpened?
            <SafeAreaView style={{flex:1,backgroundColor:'#E8E8E8'}}>
                <ScrollView>
                    <View style={{margin:'5%',}}>
                        {
                            DATA.map((data,index)=>renderForm(data,index))
                        }
                        {/* {renderForm('','')}
                        {renderForm('','')} */}
                    </View>
                </ScrollView>
            </SafeAreaView>
            :
            <SafeAreaView style={{flex:1}}>
            <ScrollView>
                <View style={{margin:'5%',}}>
                    {
                        DATA.map((data,index)=>renderForm(data,index))
                    }
                    {/* {renderForm('','')}
                    {renderForm('','')} */}
                </View>
            </ScrollView>
        </SafeAreaView>}
            <BottomSheet
                ref={TagSheet}
                snapPoints={[600, 0, 0]}
                borderRadius={20}
                renderContent={renderbottomsheet}
                initialSnap={1}
                onOpenStart={bottomSheetController}
                onCloseEnd={bottomSheetController}             
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
        alignItems:'center'
    },
    title: {
        fontSize: SIZES.body3,
        fontFamily: 'RobotoMedium',
        paddingRight: SIZES.base
    },
    text:{
        fontFamily:'RobotoRegular',
        fontSize:SIZES.body3
    },
    tagContainer:{
        backgroundColor: 'white',
        padding: SIZES.padding*2,
        height: 600,
    },
    tagTitleContainer:{
        marginTop:10,
        marginBottom:10
    }
})

export default Workout;