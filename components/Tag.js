import React, {useEffect, useState} from "react";
import { StyleSheet, View, Text, FlatList, Button, ScrollView, TouchableOpacity} from "react-native";
import { COLORS, SIZES } from "../constants";

const Tag = ({name,color, onPress}) => {
        return(
<<<<<<< HEAD
            <View style={styles.container}>
                <View style={{backgroundColor:color, borderRadius:SIZES.radius,height:23,justifyContent:'center',padding:2}}>
=======
            <TouchableOpacity style={styles.container} onPress={() => onPress(name)}>
                <View style={{backgroundColor:color, borderRadius:SIZES.radius}}>
>>>>>>> 2f5b955879b6603d83f1feef0b994fc25acbd41e
                    <Text style={styles.tag}>{name}</Text>
                </View>
            </TouchableOpacity>
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