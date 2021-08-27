import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, TouchableOpacity} from "react-native";
import { COLORS, SIZES } from "../constants";

import Tag from "./Tag";

const WorkoutCard = ({sessionTitle, sessionBody}) => {
    const [DATA,setDATA] = useState([])

    const onPress = () => {
        console.log('hello')
    }


    function fetchData (sessionTitle,sessionBody){
        //console.log(sessionTitle[0].tag)
        // put data into DATA array and render it to list
        for(let i=0;i<sessionTitle.length;i++){
            let obj = {}
            obj=sessionBody[i]
            obj.tag=sessionTitle[i].tag

            setDATA(prevArr => [...prevArr, obj])
        }
    }

    //fetch data only mount - data 바뀔 일이 없음
    useEffect(()=>{
        fetchData(sessionTitle,sessionBody)
    },[])

    function rendersets(item) {
        return item.data.map((data,index)=>{
            //console.log(data)
            return(
                <View key={index} style={{flexDirection:'row', justifyContent:'space-around'}}>
                    <Text style={styles.text}>{index + 1}세트</Text>
                    <Text style={styles.text}>{data.weight}kg</Text>
                    <Text style={styles.text}>{data.rep}회</Text>
                </View>
            )
        })
    }

    return DATA.map((item,index)=>{
        //console.log(item)
        return(
            <View key={index} style={styles.container}>
                <TouchableOpacity onPress={onPress} style={styles.item}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.title}>{item.title}</Text>
                        <>{
                        item.tag.map((d,i)=>(
                            <Tag key={i} name={d.name} color={d.color}></Tag>
                        ))}
                        </>
                    </View>
                    <View
                        style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: COLORS.lightGray3,
                            marginTop:SIZES.padding/2
                        }}
                    />
                    <View style={{marginTop:SIZES.padding}}>
                        {rendersets(item)}
                    </View>
                </TouchableOpacity>
            </View>
        )
    })

}

export default WorkoutCard;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: COLORS.transparent,
      paddingHorizontal: SIZES.padding*2,
      //borderRadius: SIZES.radius,
      marginHorizontal: 10,
      paddingTop:SIZES.base*2
    },
    title: {
      fontSize: SIZES.body3,
      fontFamily: 'RobotoMedium',
      paddingRight: SIZES.base
    },
    text: {
        fontSize: SIZES.body3,
        fontFamily: 'RobotoRegular'
    }
  });