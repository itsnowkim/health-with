import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, FlatList, Button, ScrollView, TouchableOpacity} from "react-native";
import { COLORS, SIZES } from "../constants";

const Tag = ({name,color, onPress}) => {
        return(
            <View style={styles.container}>
                <View style={{backgroundColor:color, borderRadius:SIZES.radius,height:23,justifyContent:'center',padding:2}}>
                    <Text style={styles.tag}>{name}</Text>
                </View>
            </View>
    )
}

export default Tag;

const styles = StyleSheet.create({
    tag:{
        color: COLORS.lightWhite,
        fontFamily:'RobotoBold',
        fontSize:SIZES.body4,
        paddingRight:5,
        paddingLeft:5,
    },
    container:{
        paddingLeft: SIZES.base/2
    }
  });