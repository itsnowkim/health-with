export const getDATAfromDB = (responseList) => {
    let temp = []
    let index = 0
    let innerindex = 0
    responseList.map((data,idx) => {
        let resultobj = {
        title:data.name,
        tag:[{id:data.tag_id, name:data.tag_name, color: data.color}],
        data:[{rep:data.rep, weight:data.weight, time:data.time, lb:data.lb, id:data.session_set_id}]
        }
        if( idx === 0){
        temp[idx] = resultobj
        }else{
        if(temp[index].title === data.name){
            if(temp[index].tag[0].id !== data.tag_id){
            if(temp[index].tag[innerindex].id !== data.tag_id){
                innerindex = innerindex +1;
                temp[index].tag[innerindex] = {id:data.tag_id, name:data.tag_name, color: data.color}
            }
            }else{
            temp[index].data.push({rep:data.rep, weight:data.weight, time:data.time, lb:data.lb, id:data.session_set_id})
            }
        }else{
            index = index +1;
            innerindex = 0
            temp = [...temp,resultobj]
        }
        }
    })
    return temp
  }

export const GET_WORKOUT_SESSION_TAG_BY_DATESTRING = `
SELECT session.id AS session_id, session.name AS session_name, tag.name AS tag_name, tag.id AS tag_id, workout.id AS workout_id
FROM workout
JOIN workout_session_tag ON workout.id = workout_session_tag.workout_id
JOIN session ON workout_session_tag.session_id = session.id
JOIN tag ON workout_session_tag.tag_id = tag.id
WHERE workout.date
`