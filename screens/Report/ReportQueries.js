export const GET_TOTAL_DATA = `
SELECT workout.date, session.id, session.name, tag.name, sets.weight, sets.rep, sets.time
from workout
JOIN workout_session_tag
ON workout.id = workout_session_tag.workout_id
JOIN session
ON session.id = workout_session_tag.session_id
JOIN tag
ON tag.id = workout_session_tag.tag_id
JOIN session_set
ON session.id = session_set.session_id
JOIN sets
ON session_set.set_id = sets.id
`

export const GET_WORKOUT_SESSION_TAG = `
  SELECT workout.date, session.name, tag.name
  FROM workout
  JOIN workout_session_tag ON workout.id = workout_session_tag.workout_id
  JOIN session ON workout_session_tag.session_id = session.id
  JOIN tag ON workout_session_tag.tag_id = tag.id
`

export const GET_SESSION_SETS = `
  SELECT session_set.session_id,  session.name, sets.weight, sets.rep
  FROM session
  JOIN session_set
  ON session.id = session_set.session_id
  JOIN sets
  ON sets.id = session_set.set_id
`

export const GET_WORKOUT_TAG_SETS = `
  SELECT workout.date, tag.name, sets.weight, sets.rep
  FROM workout
  JOIN workout_session_tag ON workout.id = workout_session_tag.workout_id
  JOIN session ON workout_session_tag.session_id = session.id
  JOIN tag ON workout_session_tag.tag_id = tag.id
  JOIN session_set ON workout_session_tag.session_id = session_set.session_id AND workout_session_tag.workout_id = session_set.workout_id
  JOIN sets ON  session_set.set_id = sets.id
`

export const GET_WORKOUT_TAG = `
  SELECT  DISTINCT workout.date, tag.name, tag.color
  FROM workout
  JOIN workout_session_tag
  ON workout.id = workout_session_tag.workout_id
  JOIN tag
  ON workout_session_tag.tag_id = tag.id
`

export const GET_ALL_BY_WORKOUT_ID = `
SELECT session.id AS session_id, session.name, sets.id AS sets_id, sets.weight , sets.time, sets.rep, sets.lb, tag.name AS tag_name, tag.id AS tag_id,tag.color, session_set.id AS session_set_id
FROM workout
JOIN workout_session_tag ON workout.id = workout_session_tag.workout_id
JOIN session ON workout_session_tag.session_id = session.id
JOIN tag ON workout_session_tag.tag_id = tag.id
JOIN session_set ON workout_session_tag.session_id = session_set.session_id AND workout_session_tag.workout_id = session_set.workout_id
JOIN sets ON session_set.set_id = sets.id
`

/*
`
  SELECT workout.date,  tag.name,  sets.weight, sets.rep, sets.time
  from workout
  JOIN workout_session_tag
  ON workout.id = workout_session_tag.workout_id
  JOIN session
  ON session.id = workout_session_tag.session_id
  JOIN tag
  ON tag.id = workout_session_tag.tag_id
  JOIN session_set
  ON session.id = session_set.session_id
  JOIN sets
  ON session_set.set_id = sets.id
`
*/