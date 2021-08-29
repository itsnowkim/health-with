import Workout from "../model/Workout"

export const createWorkout = async (date) => {
  const props = {
    date: date,
  }
  const workout = new Workout(props)
  await workout.save()
}

export const getWorkout = async ({setWorkouts}) => {
  workouts = await Workout.query()
  console.log(workouts)
  setWorkouts(workouts)
  return workouts
}