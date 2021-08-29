import React from 'react';
import { useState, useCallback } from 'react';
import ReportPresenter from './ReportPresenter'
import { Alert } from 'react-native';
import { useEffect } from 'react';

//SQLite
import DatabaseLayer from 'expo-sqlite-orm/src/DatabaseLayer'
import * as SQLite from 'expo-sqlite'

//model
import Session from '../../model/Session';
import Session_Set from '../../model/Session_Set';
import Set from '../../model/Set';
import Tag from '../../model/Tag';
import Workout from '../../model/Workout';
import Workout_Session_Tag from '../../model/Workout_Session_Tag';

//queries
import { GET_WORKOUT_TAG_SETS, GET_WORKOUT_TAG } from './ReportQueries';
import { COLORS, SIZES } from '../../constants';


export default () => {
  const [loading, setLoading] = useState(true)
  const [volume, setVolume] = useState({})
  const [frequency, setFrequency] = useState([])
  const [selectedTag, setSelectedTag] = useState(null)

  const [isEnabled, setIsEnabled] = useState(false);

  const [page, setPage] = useState(0);

  const [workouts, setWorkouts] = useState([])
  const [sessions, setSessions] = useState([])
  const [tags, setTags] = useState([])
  const [sets, setSets] = useState([])

  useEffect(() => {
    const setData = async () => {
      setWorkouts(await Workout.query())
      setSessions(await Session.query())
      const tags = await Tag.query()
      setTags(tags)
      setSets(await Set.query())
      setSelectedTag(tags[0].name)    
    }
    setData()
  }, [])

  useEffect(() => {
    if (tags.length != 0){
      setVolumeWithTags()
      setFrequencyWithVolume()
      setLoading(false)
    }
  }, [tags])

  const setVolumeWithTags = () => {
    let totalVolume = {}
    workouts.map((workout) => {
      let prevVolume = {}
      tags.map((tag) => {
        prevVolume[tag.name] = 0
      })
      totalVolume[workout.date] = prevVolume
    })

    const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('testDB.db'))
    databaseLayer.executeSql(GET_WORKOUT_TAG_SETS)
    .then((response) => {
      const responseList = response.rows
      let volumeDict = totalVolume
      responseList.map((data) => {
        let day = data.date
        let tag = data.name
        let vol = data.weight*data.rep

        volumeDict[day][tag] += vol
      })
      setVolume(totalVolume)
    })
    .catch((err) => {
      console.log(err )
    })
  }

  const setFrequencyWithVolume = () => {
    const databaseLayer = new DatabaseLayer(async () => SQLite.openDatabase('testDB.db'))
    databaseLayer.executeSql(GET_WORKOUT_TAG)
    .then((response) => {
      const responseList = response.rows
      let frequencyDict = {}
      responseList.map((data) => {
        let tag = data.name
        let color = data.color
        if (tag in frequencyDict){
          frequencyDict[tag]['value'] += 1
        }
        else {
          frequencyDict[tag] = {'value': 1, 'color': color}
        }
      })
      let frequencyList = []
      frequencyTagsList = Object.keys(frequencyDict)
      frequencyTagsList.map((tag) => {
        let elem = {}
        elem['name'] = `${tag} (${frequencyDict[tag]['value']}회)`
        elem['freq'] = frequencyDict[tag]['value']
        elem['color'] = frequencyDict[tag]['color']
        elem['legendFontColor'] = '#3b3b3b'
        elem['legendFontSize'] = SIZES.body3
        frequencyList.push(elem)
      })
      setFrequency(frequencyList)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <ReportPresenter
      loading={loading}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      page={page}
      setPage={setPage}
      workouts={workouts}
      sessions={sessions}
      tags={tags}
      sets={sets}
      volume={volume}
      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}
      frequency={frequency}
    />
  )
}