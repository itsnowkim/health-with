import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, TouchableOpacity} from "react-native";
import { COLORS, SIZES } from "../constants";

import Tag from "./Tag";

const WorkoutCard = ({DATA}) => {
    //const [DATA,setDATA] = useState([])

    const onPress = () => {
        console.log('hello')
        
    }

    function rendersets(item) {
        return item.data.map((data,index)=>{
            //console.log(data)
            return(
                <View key={index} style={{flexDirection:'row',marginVertical:1, justifyContent:'space-around'}}>
                    <Text style={styles.text}>{index + 1}세트</Text>
                    {
                        data.lb?
                        <Text style={styles.text}>{data.weight}lb</Text>:
                        <Text style={styles.text}>{data.weight}kg</Text>
                    }
                    <Text style={styles.text}>{data.rep}회</Text>
                </View>
            )
        })
    }

    return DATA.map((item,index)=>{
        console.log(item)
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
      marginTop:10
    },
    item: {
      backgroundColor: COLORS.transparent,
      paddingHorizontal: SIZES.padding*2,
      //borderRadius: SIZES.radius,
      marginHorizontal: 10,
      paddingTop:SIZES.base*2
    },
    title: {
      fontSize: 15,
      fontFamily: 'RobotoMedium',
      paddingRight: SIZES.base
    },
    text: {
        fontSize: 15,
        fontFamily: 'RobotoLight'
    }
  });