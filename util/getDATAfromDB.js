export const getDATAfromDB = (responseList) => {
    let temp = []
    let index = 0
    let innerindex = 0
    responseList.map((data,idx) => {
        let resultobj = {
        title:data.name,
        tag:[{id:data.tag_id, name:data.tag_name, color: data.color}],
        data:[{rep:data.rep,weight:data.weight,time:data.time}]
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
            temp[index].data.push({rep:data.rep, weight:data.weight, time:data.time, lb:data.lb})
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