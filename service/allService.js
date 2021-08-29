import Tag from "../components/Tag"
import Session from "../model/Session"
import Session_Set from "../model/Session_Set"
import Set from "../model/Set"
import Workout from "../model/Workout"
import Workout_Session_Tag from "../model/Workout_Session_Tag"

const createTables = async () => {
  await Session.createTable()
  await Session_Set.createTable()
  await Set.createTable()
  await Tag.createTable()
  await Workout.createTable()
  await Workout_Session_Tag.createTable()
}


const createWorkout = async (date) => {
  const props = {
    date: date,
  }

  const workout = new Workout(props)
  await workout.save()
}


const createSession = async ({name}) => {
  const props = {
    name: name,
  }

  const session = new Session(props)
  await session.save()
}


const createTag = async ({name}) => {
  const props = {
    name: name,
  }

  const tag = new Tag(props)
  await tag.save()
}

const createSet = async ({weight, rep, time}) => {
  const props = {
    weight: weight,
    rep: rep,
    time, time
  }

  const set = new Set(props)
  await set.save()
}

/*
      <View>
        <TouchableOpacity onPress={createTables}>
          <Text>테이블 생성</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => createWorkout('2021-01-01')}>
          <Text>Workout 생성 (2021-01-01)</Text>
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: SIZES.h3}}>Workout</Text>
          {
            workouts && workouts.map(workout => (
              <Text key={workout.id}>
                {JSON.stringify(workout)}
              </Text>
            ))
          }
        </View>
        <View>
          <Text style={{fontSize: SIZES.h3}}>Session</Text>
          {
            sessions && sessions.map(session => (
              <Text key={session.id}>
                {JSON.stringify(session)}
              </Text>
            ))
          }
        </View>
        <View>
          <Text style={{fontSize: SIZES.h3}}>Tags</Text>
          {
            tags && tags.map(tag => (
              <Text key={tag.id}>
                {JSON.stringify(tag)}
              </Text>
            ))
          }
        </View>
        <View>
          <Text style={{fontSize: SIZES.h3}}>Sets</Text>
          {
            sets && sets.map(set => (
              <Text key={set.id}>
                {JSON.stringify(set)}
              </Text>
            ))
          }
        </View>
      </View>
*/