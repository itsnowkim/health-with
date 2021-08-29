import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SIZES } from '../../constants';
import { MaterialIcons, Entypo } from '@expo/vector-icons'

//components
import LineChart from '../../components/LineChart';
import SwitchBtn from '../../components/SwitchBtn';
import Tag from '../../components/Tag'
import PieChart from '../../components/PieChart';
import Spinner from '../../components/Spinner';

export default ({
  loading,
  isEnabled,
  setIsEnabled,
  page,
  setPage,
  workouts,
  sessions,
  tags,
  sets,
  volume,
  selectedTag,
  setSelectedTag,
  frequency
}) => {
  
  const ReportCard = ({title}) => {
    
    const onPressTagHandler = (name) => {
      setSelectedTag(name)
    }

    return (
      <View style={style.cardContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 0}}>
          <Text style={style.cardSubTitle}>{title}</Text>
          <SwitchBtn isEnabled={isEnabled} setIsEnabled={setIsEnabled} />
        </View>
        {
          loading && (
            <View style={{height: 220, justifyContent: 'center', alignItems: 'center'}}>
              <Spinner />
            </View>
          )
        }
        {
          !loading && page == 0 && (
            <>
            <LineChart volume={volume} tags={tags} selectedTag={selectedTag} />
            </>
          )
        }
        {
          !loading && page == 1 && (
            <>
            <PieChart frequency={frequency} />
            </>
          )
        }
        <View style={{flexDirection: 'row', justifyContent:'space-between', backgroundColor: '#ffffff', margin: SIZES.padding, borderRadius: 16}}>
            <TouchableOpacity onPress={() => setPage(0)}>
              <MaterialIcons name="arrow-back-ios" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={{justifyContent:'center', flexDirection:'row'}}>
              <Entypo name="dot-single" size={30} color={page == 0 ? COLORS.primary : COLORS.gray} />
              <Entypo name="dot-single" size={30} color={page == 1 ? COLORS.primary : COLORS.gray} />
            </View>
            <TouchableOpacity onPress={() => setPage(1)}>
              <MaterialIcons name="arrow-forward-ios" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        <View style={{flexDirection: 'row', padding: SIZES.padding}}>
          {
            page == 0 && tags && tags.map((tag) => 
              (
                <TouchableOpacity key={tag.id} onPress={() => onPressTagHandler(tag.name)}>
                  <Tag key={tag.id} name={tag.name} color={tag.name == selectedTag ? tag.color : COLORS.gray} />
                </TouchableOpacity>
            ))
          }
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: COLORS.lightGray4}}>
      <View style={style.container}>
        <Text style={style.cardTitle}>운동 부위별 분석</Text>
            <ReportCard
              loading={loading}
              tags={tags}
              volume={volume}
              page={page}
              setPage={setPage}
              isEnabled={isEnabled} 
              etIsEnabled={setIsEnabled}
              title={page == 0 ? '볼륨별 분석(kg)' : '전체 빈도별 분석(회)'}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container:{
    width: '100%',
  },
  cardContainer:{
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: SIZES.padding2,
  },
  cardTitle:{
    fontSize: SIZES.h3,
    fontWeight: '600',
    margin: SIZES.padding3,
  },
  cardSubTitle:{
    fontSize: SIZES.h4,
    fontWeight: '600',
    margin: SIZES.padding,
  },
})