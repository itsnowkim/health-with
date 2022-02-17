import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Button,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS, SIZES } from '../constants';
import Line3 from '../components/Line3';
import Tag from '../components/Tag';
import Line2 from '../components/Line2';
import Line1 from '../components/Line1';

import Animated, { color } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

//db
import DatabaseLayer from 'expo-sqlite-orm/src/DatabaseLayer';
import * as SQLite from 'expo-sqlite';
import { GET_ALL_BY_WORKOUT_ID } from './Report/ReportQueries';
import {
  getDATAfromDB,
  GET_SESSION_SET_BY_WORKOUTID,
  GET_WORKOUT_SESSION_TAG_BY_DATESTRING,
} from '../util/getDATAfromDB';
import TagDb from '../model/Tag';
import WorkoutDb from '../model/Workout';
import SetsDb from '../model/Set';
import SessionDb from '../model/Session';
import Workout_Session_Tag from '../model/Workout_Session_Tag';
import Session_Set from '../model/Session_Set';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import {
  AngleDown,
  AngleUp,
  Check,
  ColorCheck,
  Fire,
  Minus,
  Plus,
  TrashCan,
  Wrench,
} from '../components/Icons';

const Workout = ({ route }) => {
  const [isEnabled, setIsEnabled] = useState([false]);
  const toggleSwitch = (index) => {
    let temp = [...isEnabled];
    temp[index] = !temp[index];
    setIsEnabled(temp);

    if (measure[index] === true) {
      toggleMeasure(index);
    }
    //DATA 비우기
    let del = [...DATA];
    del[index].data = [
      { rep: '', time: '', weight: '', lb: 0, session_set_id: 0, sets_id: 0 },
    ];
    setDATA(del);
  };
  const [measure, setMeasure] = useState([false]);
  const toggleMeasure = (index) => {
    let temp = [...measure];
    temp[index] = !temp[index];
    setMeasure(temp);

    let arr = [...DATA];
    arr[index].data.map((i, j) => {
      if (i.lb === 0) {
        arr[index].data[j].lb = 1;
      } else {
        arr[index].data[j].lb = 0;
      }
    });
    console.log(arr);
    setDATA(arr);

    if (isEnabled[index] === true) {
      toggleSwitch(index);
    }
  };

  // angledown, angleup 판단하는 state - DATA.data 개수만큼 true,false 있어야 함
  const [isPressed, setIsPressed] = useState(null);

  const togglePressed = (index, innerindex) => {
    let temp = [...isPressed];
    //console.log(index,innerindex)

    temp[index].data[innerindex] = !temp[index].data[innerindex];
    setIsPressed(temp);
  };

  const [bottomSheetOpened, setBottomSheetOpened] = useState(false);
  const [whichTag, setWhichTag] = useState(0);

  const TagColors = [
    '#39D9A9',
    '#FB5253',
    '#FFEC99',
    '#BF4CDB',
    '#66D9E8',
    '#3138FF',
  ];

  const [tagCustomize, setTagCustomize] = useState({
    name: '',
    color: '#39D9A9',
    id: 1,
  });
  const [tagUpdate, setTagUpdate] = useState({
    name: '',
    color: '',
    id: 1,
    index: null,
  });
  const [firstAngle, setFirstAngle] = useState(false);
  const [secondAngle, setSecondAngle] = useState(false);
  const [itemId, setItemId] = useState();
  let organized = [];

  // 화면에서 보고 있는 데이터
  const [DATA, setDATA] = useState([
    {
      title: '',
      id: 0,
      tag: [{ name: '', color: '', id: 1 }],
      data: [
        {
          lb: 0,
          rep: '',
          weight: '',
          time: null,
          session_set_id: 0,
          sets_id: 0,
        },
      ],
    },
  ]);
  // db에 있는 데이터
  const [prevDATA, setprevDATA] = useState([
    {
      title: '',
      id: 0,
      tag: [{ name: '', color: '', id: 1 }],
      data: [{ lb: 0, rep: '', weight: '', time: null, id: 0 }],
    },
  ]);
  // db에 추가될 데이터
  const [addDATA, setaddDATA] = useState([]);
  // db에서 삭제될 데이터
  const [delDATA, setdelDATA] = useState([]);
  const [AllTag, setAllTag] = useState([]);

  const getTag = async () => {
    let tags = await TagDb.query({ order: 'id ASC' });
    tags.shift();
    setAllTag(tags);
  };

  function fetchData(itemId) {
    // db에서 DATA 가져와서 넣기
    const databaseLayer = new DatabaseLayer(async () =>
      SQLite.openDatabase('upgradeDB.db')
    );
    databaseLayer
      .executeSql(GET_ALL_BY_WORKOUT_ID + `WHERE workout.id=${itemId}`)
      .then((response) => {
        console.log('몇번?');
        const responseList = response.rows;
        let temp = getDATAfromDB(responseList);
        setDATA(temp);
        setprevDATA(temp);
        // angledown, angleup 판단하는 state - DATA.data 개수만큼 true,false 있어야 함
        let pressedlist = [];
        temp.map((i, idx) => {
          if (i.data[0].time !== null) {
            // 유산소 운동
            let temp = isEnabled;
            temp[idx] = true;
            setIsEnabled(temp);
          }

          let aaa = { data: [] };
          pressedlist.push(aaa);
          i.data.map((j) => {
            pressedlist[idx].data.push(false);
          });
        });
        setIsPressed(pressedlist);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    // 처음 마운트 되었을 때 넘어온 id로 local storage에서 get.
    const { itemId } = route.params;
    setItemId(itemId);
    getTag();

    if (itemId === 0) {
      // no item id, 새로 작성하는 경우
      console.log('생성');
    } else {
      // get data from local storage
      console.log('수정');
      fetchData(itemId);
    }
    // 화면을 나갈 때 변경사항이 있는지 체크(저장할 경우 data가 바뀌므로)
    return () => {
      setIsPressed(null);
      console.log('Workout Page 언마운트');
    };
  }, []);

  function organizeDATA() {
    // 세트 개수만큼 for loop 돌면서 organize.
    let dataArr = [];
    let temp = organized;
    DATA.map((element) => {
      element.data.map((sets) => {
        dataArr = [...dataArr, sets];
      });
    });

    dataArr.map((element) => {
      let index = -1;
      if (element.time !== null) {
        index = dataArr.findIndex((value) => value.time === element.time);
        temp = [...temp, index];
      } else {
        index = dataArr.findIndex(
          (value) =>
            value.lb === element.lb &&
            value.weight === element.weight &&
            value.rep === element.rep
        );
        temp = [...temp, index];
      }
    });
    organized = temp;
  }

  useEffect(() => {
    if (route.params.saveButton) {
      organizeDATA();
      console.log('savebutton 누름(true)');
      // DATA에 있는 값 db에 저장
      saveDATAtoDB();
    }
  }, [route.params.saveButton]);

  async function saveWorkout(itemId, targetdate) {
    if (itemId === 0) {
      let res = await WorkoutDb.findBy({ date_eq: targetdate });
      if (res === null) {
        let response = await WorkoutDb.create({ date: targetdate });
        return response.id;
      } else {
        return res.id;
      }
    } else return itemId;
  }
  async function saveSession(title) {
    //존재하지 않는 title일 경우 추가후 해당 id 리턴
    let response = await SessionDb.findBy({ name_eq: title });
    if (response === null) {
      let res = await SessionDb.create({ name: title });
      return res.id;
    } else {
      return response.id;
    }
  }
  async function saveSets(data) {
    // 새치기 막아야됨
    return new Promise((resolve) => {
      function getdata() {
        let result = [];
        let temp_organized = organized;

        data.map(async (i, j) => {
          if (temp_organized[j] !== j) {
            console.log('이전에 나옴');
            //이전에 나온거.
            result[j] = { key: true, value: temp_organized[j] };
          } else {
            //처음 나온거.
            console.log('처음 나옴');
            if (i.time !== null) {
              // 유산소 운동의 경우
              let response = await SetsDb.findBy({ time_eq: i.time });
              if (response === null) {
                response = await SetsDb.create({
                  weight: i.weight,
                  rep: i.rep,
                  time: i.time,
                  lb: i.lb,
                });
              }
              result = [...result, response.id];
              result[j] = { key: false, value: response.id };
            } else {
              // 무산소 운동의 경우
              let response = await SetsDb.findBy({
                weight_eq: i.weight,
                rep_eq: i.rep,
                lb_eq: i.lb,
              });
              if (response === null) {
                response = await SetsDb.create({
                  weight: i.weight,
                  rep: i.rep,
                  time: i.time,
                  lb: i.lb,
                });
              }
              result[j] = { key: false, value: response.id };
            }
            if (result.length === data.length) {
              resolve(result);
            }
          }
        });
      }
      getdata();
    });
  }
  async function saveWorkoutSessionTag(title, tag, exist, workoutId) {
    const title_id = await saveSession(title);
    // ok
    let tagId = [1];
    if (tag.length !== 0) {
      tagId = [];
      tag.map((i) => {
        tagId = [...tagId, i.id];
      });
    }

    tagId.map(async (i) => {
      const props = {
        workout_id: workoutId,
        session_id: title_id,
        tag_id: i,
      };
      await Workout_Session_Tag.create(props);
    });

    return title_id;
  }

  async function checkWorkoutSessionTag(date) {
    // 해당 날짜에 workout_session_tag rows가 있으면 리턴, 없으면 []리턴
    const databaseLayer = new DatabaseLayer(async () =>
      SQLite.openDatabase('upgradeDB.db')
    );
    let response = await databaseLayer.executeSql(
      GET_WORKOUT_SESSION_TAG_BY_DATESTRING + `WHERE workout.date='${date}'`
    );
    let rows = await response.rows;
    return rows;
  }
  async function checkSessionSets(id) {
    const databaseLayer = new DatabaseLayer(async () =>
      SQLite.openDatabase('upgradeDB.db')
    );
    let response = await databaseLayer.executeSql(
      GET_SESSION_SET_BY_WORKOUTID + `WHERE workout_id=${id}`
    );
    let rows = await response.rows;
    return rows;
  }
  async function saveSessionSet(data, title_id, workoutid, itemId) {
    let target;
    if (itemId !== 0) {
      //비교시작해라
      //checkSessionSets
    } else {
      //비교할 필요 없이 새로 넣는거라서 그냥 무지성때려박기

      //set 개수만큼 map -> 한 줄씩 넣기.
      saveSets(data).then((set_id) => {
        set_id.map(async (i) => {
          console.log(i);
          if (i.key === false) {
            target = i.value;
          } else {
            target = set_id[i.value].value;
          }
          const props = {
            session_id: title_id,
            set_id: target,
            workout_id: workoutid,
          };
          await Session_Set.create(props);
        });
      });
    }
  }

  async function saveDATAtoDB() {
    const target = [...DATA];
    const { itemId } = route.params;
    const { date } = route.params;

    const workout_session_tag_prev = await checkWorkoutSessionTag(date);
    let workoutid = await saveWorkout(itemId, date);

    // session 개수만큼 map
    target.map(async (item, index) => {
      const title_id = await saveWorkoutSessionTag(
        item.title,
        item.tag,
        workout_session_tag_prev,
        workoutid
      );
      saveSessionSet(item.data, title_id, workoutid, itemId);
    });
  }

  // 태그 자체를 지움
  function deleteTag() {
    TagDb.destroy(tagUpdate.id);
    const databaseLayer = new DatabaseLayer(async () =>
      SQLite.openDatabase('upgradeDB.db')
    );
    databaseLayer.executeSql(
      `DELETE FROM workout_session_tag WHERE tag_id=${tagUpdate.id}`
    );

    const temp = AllTag.filter((i, j) => j !== tagUpdate.index);
    setAllTag(temp);
    setTagUpdate({
      name: '',
      color: '',
      id: 1,
      index: null,
    });
    handleTagDelete(whichTag, tagUpdate.index);
  }

  // 새로운 태그를 등록
  function handleTagAdd(index) {
    // 체크해서 이미 있으면 아무것도 안함.
    const color = AllTag[index].color;
    const name = AllTag[index].name;
    const tagId = AllTag[index].id;
    const resultobj = {
      color: color,
      name: name,
      id: tagId,
    };

    let temp = [...DATA];
    let addtemp = [...addDATA];

    let istrue = false;
    temp[whichTag].tag.map((i, j) => {
      if (i.id === AllTag[index].id) {
        istrue = true;
      }
    });

    // 찾는함수
    if (!istrue) {
      //길이가 0인 경우 그냥 바꿔끼기
      if (temp[whichTag].tag.length === 0) {
        temp[whichTag].tag = [...temp[whichTag].tag, resultobj];
      } else {
        //이미 태그가 존재하면 그 뒤에 이어붙이기
        if (temp[whichTag].tag[0].name === '') {
          temp[whichTag].tag[0] = {
            ...temp[whichTag].tag[index],
            color: color,
            name: name,
            id: tagId,
          };
        } else {
          temp[whichTag].tag = [...temp[whichTag].tag, resultobj];
        }
      }

      addtemp = [
        ...addtemp,
        { workout_id: itemId, session_id: temp[whichTag].id, tag_id: tagId },
      ];

      setDATA(temp);
      setaddDATA(addtemp);
      console.log(addtemp);
    }
  }
  function checkAdded(target) {
    // addDATA에 있는 값이면 return 0
    let addTemp = [...addDATA];
    const result = addDATA.findIndex(
      (element) =>
        element.session_id === target.session_id &&
        element.tag_id === target.tag_id &&
        element.workout_id === target.workout_id
    );

    if (result === -1) return 0;
    else {
      addTemp.splice(result, 1);
      setaddDATA(addTemp);
      return 1;
    }
  }
  function handleTagDelete(index, innerindex) {
    // addDATA에 없다면 delDATA에만 지워진 태그 넣어주고, addDATA에 있다면 그것도 지워줘야 함.
    let deltemp = [...delDATA];
    const target = {
      workout_id: itemId,
      session_id: DATA[index].id,
      tag_id: DATA[index].tag[innerindex].id,
    };
    if (checkAdded(target) !== 1) {
      deltemp = [...deltemp, target];
      setdelDATA(deltemp);
    }

    const temp = DATA[index].tag.filter((item, j) => j !== innerindex);

    // 다 가져와서 tag만 temp로 갈아끼우네
    let result = [...DATA];
    result[index] = { ...result[index], tag: temp };
    setDATA(result);
  }

  function handelTitle(event, index) {
    let temp = [...DATA];
    temp[index] = { ...temp[index], title: event };
    setDATA(temp);
  }
  function handleWeight(event, innerindex, index) {
    let temp = [...DATA];
    temp[index].data[innerindex] = {
      ...temp[index].data[innerindex],
      weight: event,
    };
    setDATA(temp);
  }
  function handleReps(event, innerindex, index) {
    let temp = [...DATA];
    temp[index].data[innerindex] = {
      ...temp[index].data[innerindex],
      rep: event,
    };
    setDATA(temp);
  }

  function updateTagCustom() {
    if (tagUpdate.name !== '') {
      let temp = [...AllTag];
      temp[tagUpdate.index] = {
        ...temp[tagUpdate.index],
        name: tagUpdate.name,
        color: tagUpdate.color,
        id: tagUpdate.id,
      };
      setAllTag(temp);
      // db에 있는 태그 테이블에 변경된 점 반영.
      TagDb.update({
        id: tagUpdate.id,
        name: tagUpdate.name,
        color: tagUpdate.color,
      });
      // 이미 등록된 태그도 같이 변경해 주어야 함.
      let addedTag = [...DATA];

      addedTag.map((data, index) => {
        data.tag.map((t, j) => {
          if (t.id === tagUpdate.id) {
            addedTag[index].tag[j] = {
              name: tagUpdate.name,
              color: tagUpdate.color,
              id: tagUpdate.id,
            };
          }
        });
      });
      setDATA(addedTag);
    }
  }
  function handleTagCustomizeAdd(event, color) {
    const id = AllTag.length + 2;
    setTagCustomize({ name: event, color: color, id: id });
  }

  function delSets(index, innerindex) {
    let count = DATA[index].data.length;

    if (count !== 1) {
      const temp = DATA[index].data.filter((item, j) => j !== innerindex);
      let result = [...DATA];
      result[index] = { ...result[index], data: temp };
      setDATA(result);

      //angle state 처리
      const angle = isPressed[index].data.filter((item, j) => j !== innerindex);
      let an_res = [...isPressed];
      an_res[index] = { ...an_res[index], data: angle };
      setIsPressed(an_res);
    }
  }
  function addSets(index) {
    let count = DATA[index].data.length;
    let push = {
      rep: DATA[index].data[count - 1].rep,
      weight: DATA[index].data[count - 1].weight,
      time: DATA[index].data[count - 1].time,
      lb: DATA[index].data[count - 1].lb,
      session_set_id: 0,
      sets_id: 0,
    };
    let temp = [...DATA];
    temp[index].data[count] = push;

    setDATA(temp);

    //angle state 처리
    let angle = [...isPressed];
    angle[index].data[count] = false;
    setIsPressed(angle);
  }

  //flag =>1 일 경우 rep 조절, 0일 경우 kg 조절
  function handleLeftButtonPressed(index, innerindex, number, flag) {
    let temp = [...DATA];

    if (flag === 1) {
      let result = Number(temp[index].data[innerindex].rep) - number;
      if (result <= 0) {
        result = 0;
      }
      temp[index].data[innerindex] = {
        ...temp[index].data[innerindex],
        rep: result,
      };
      setDATA(temp);
    } else {
      let result = Number(temp[index].data[innerindex].weight) - number;
      if (result <= 0) {
        result = 0;
      }
      temp[index].data[innerindex] = {
        ...temp[index].data[innerindex],
        weight: result,
      };
      setDATA(temp);
    }
  }

  function handleRightButtonPressed(index, innerindex, number, flag) {
    if (flag === 1) {
      let temp = [...DATA];
      temp[index].data[innerindex] = {
        ...temp[index].data[innerindex],
        rep: Number(temp[index].data[innerindex].rep) + number,
      };
      setDATA(temp);
    } else {
      let temp = [...DATA];
      temp[index].data[innerindex] = {
        ...temp[index].data[innerindex],
        weight: Number(temp[index].data[innerindex].weight) + number,
      };
      setDATA(temp);
    }
  }
  // 태그를 새로 만드는 함수
  //setAllTag()에 수정된 데이터 push
  function addNewTag() {
    if (tagCustomize.name !== '') {
      console.log(tagCustomize);
      setAllTag((prevArr) => [
        ...prevArr,
        {
          name: tagCustomize.name,
          color: tagCustomize.color,
          id: tagCustomize.id,
        },
      ]);
      setTagCustomize({ name: '', color: '#B54B4B', id: 1 });
      // db에 수정된 데이터 upload
      TagDb.create({ name: tagCustomize.name, color: tagCustomize.color });
    }
  }
  function handleTagCustomizeUpdate(event, color) {
    setTagUpdate({
      name: event,
      color: color,
      index: tagUpdate.index,
      id: tagUpdate.id,
    });
  }
  function checkform(index) {
    if (DATA[index].title !== '') {
      return true;
    } else {
      return false;
    }
  }
  function isRendered() {
    // data가 없을 경우는 setisPressed안에 초기값 넣고
    // data가 있을 때는 아무것도 안함
    if (route.params.itemId === 0) {
      if (!isPressed) {
        setIsPressed([{ data: [false] }]);
      }
    }
    return true;
  }
  function addNewWorkout(index) {
    // 한번 클릭한 버튼은 다시 나오면 안됨
    if (DATA[index].title !== '') {
      const temp = {
        title: '',
        id: 0,
        tag: [{ name: '', color: '', id: 1 }],
        data: [
          {
            rep: '',
            weight: '',
            time: null,
            lb: 0,
            session_set_id: 0,
            sets_id: 0,
          },
        ],
      };
      let res = [...DATA];
      res[index + 1] = temp;
      //console.log(res)

      setDATA(res);

      // 토글도 새로 만들어 주자
      let toggle = [...isEnabled];
      toggle[index + 1] = false;
      setIsEnabled(toggle);

      // 단위 변환도 새로 만들어 주자
      let m_toggle = [...measure];
      m_toggle[index + 1] = false;
      setMeasure(m_toggle);

      //angle state 처리
      let angle = [...isPressed];
      const an_res = {
        data: [false],
      };
      angle[index + 1] = an_res;
      setIsPressed(angle);

      return true;
    } else {
      return false;
    }
  }
  function deleteWorkout(index) {
    console.log('삭제버튼 누름');
    if (DATA.length === 1) {
      setDATA([
        {
          title: '',
          id: 0,
          tag: [{ name: '', color: '', id: 1 }],
          data: [{ rep: '', weight: '', time: '' }],
        },
      ]);
      //angle state 처리
      setIsPressed([{ data: [false] }]);
      setMeasure([false]);
      setIsEnabled([false]);
      measure;
    } else {
      setWhichTag(0);
      setDATA((prevArr) => prevArr.filter((value, i) => i !== index));
      //angle state 처리
      setIsPressed((prevArr) => prevArr.filter((value, i) => i !== index));
      setMeasure((prevArr) => prevArr.filter((value, i) => i !== index));
      setIsEnabled((prevArr) => prevArr.filter((value, i) => i !== index));
    }
  }

  function handleTime(event, index) {
    let temp = [...DATA];
    temp[index].data[0].time = event;
    setDATA(temp);
  }

  function renderfirstSection() {
    return (
      <View>
        <View style={{ alignItems: 'center' }}>
          <View horizontal={true} style={styles.alltag}>
            {TagColors.map((d, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setTagCustomize({
                    name: tagCustomize.name,
                    color: d,
                    id: tagCustomize.id,
                  });
                }}
              >
                <View
                  style={[styles.alltagcolor, { backgroundColor: d }]}
                ></View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextInput
              style={{
                height: 25,
                fontFamily: 'RobotoBold',
                fontSize: SIZES.body4,
                color: COLORS.lightWhite,
                backgroundColor: tagCustomize.color,
                paddingHorizontal: 12,
                borderRadius: SIZES.radius,
                marginRight: 20,
              }}
              onChangeText={(event) =>
                handleTagCustomizeAdd(event, tagCustomize.color)
              }
              value={tagCustomize.name}
              autoCompleteType="off"
              placeholder="태그명을 입력하세요"
              autoCorrect={false}
              placeholderTextColor="#ffffff"
            />
            <TouchableOpacity
              onPress={() => {
                addNewTag();
              }}
            >
              {tagCustomize.name !== '' ? (
                <ColorCheck color={'#404040'} />
              ) : (
                <ColorCheck color={COLORS.gray} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  function renderSecondSection() {
    return (
      <View>
        <ScrollView style={{ paddingTop: SIZES.padding2 }} horizontal={true}>
          {AllTag.map((d, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setTagUpdate({
                  name: d.name,
                  color: d.color,
                  id: d.id,
                  index: i,
                });
              }}
            >
              <Tag name={d.name} color={d.color}></Tag>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.alltag}>
            {TagColors.map((d, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setTagUpdate({
                    name: tagUpdate.name,
                    color: d,
                    id: tagUpdate.id,
                    index: tagUpdate.index,
                  });
                }}
              >
                <View
                  style={[styles.alltagcolor, { backgroundColor: d }]}
                ></View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {tagUpdate.index !== null ? (
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    '정말 삭제하시겠습니까?',
                    `${tagUpdate.name} 태그를 삭제합니다`,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      { text: 'OK', onPress: () => deleteTag() },
                    ],
                    { cancelable: false }
                  );
                }}
              >
                <TrashCan />
              </TouchableOpacity>
              <View
                style={{
                  height: 25,
                  backgroundColor: tagUpdate.color,
                  borderRadius: SIZES.radius,
                  justifyContent: 'center',
                  marginHorizontal: 30,
                }}
              >
                <View style={{ paddingHorizontal: 12 }}>
                  <TextInput
                    style={{
                      color: COLORS.lightWhite,
                      fontFamily: 'RobotoBold',
                      fontSize: SIZES.body4,
                    }}
                    onChangeText={(event) =>
                      handleTagCustomizeUpdate(event, tagUpdate.color)
                    }
                    value={tagUpdate.name}
                    // onEndEditing={()=>onEndEditing()}
                    autoCompleteType="off"
                    placeholder="태그명을 입력하세요"
                    autoCorrect={false}
                    placeholderTextColor="#ffffff"
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  updateTagCustom();
                }}
              >
                {tagUpdate.name !== '' ? (
                  <ColorCheck color={'#404040'} />
                ) : (
                  <ColorCheck color={COLORS.gray} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
  const renderbottomsheet = () => (
    <ScrollView style={styles.tagContainer}>
      <View style={styles.rowcontainer}>
        <View>
          <Text style={{ fontSize: SIZES.h4, fontFamily: 'RobotoRegular' }}>
            태그 관리
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setBottomSheetOpened(false);
            TagSheet.current.snapTo(1);
          }}
        >
          <Check />
        </TouchableOpacity>
      </View>
      <View style={styles.tagTitleContainer}>
        <Text style={styles.title}>태그 목록</Text>
        <Line3 />
        <ScrollView style={{ paddingTop: SIZES.padding2 }} horizontal={true}>
          {AllTag.map((d, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                handleTagAdd(i);
              }}
            >
              <Tag name={d.name} color={d.color}></Tag>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tagTitleContainer}>
        <Text style={styles.title}>선택된 태그</Text>
        <Line3 />
        <ScrollView
          horizontal={true}
          style={{ flexDirection: 'row', paddingTop: SIZES.padding2 }}
        >
          {DATA[whichTag].tag.map((d, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                handleTagDelete(whichTag, i);
              }}
            >
              <Tag name={d.name} color={d.color}></Tag>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.tagTitleContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={() => setFirstAngle(!firstAngle)}>
            <Text style={styles.title}>태그 추가</Text>
          </TouchableOpacity>
          {!firstAngle ? (
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => setFirstAngle(!firstAngle)}
            >
              <AngleDown />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => setFirstAngle(!firstAngle)}
            >
              <AngleUp />
            </TouchableOpacity>
          )}
        </View>
        <Line3 />
        {firstAngle ? renderfirstSection() : <View></View>}
      </View>
      <View style={styles.tagTitleContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity onPress={() => setSecondAngle(!secondAngle)}>
            <Text style={styles.title}>태그 편집</Text>
          </TouchableOpacity>
          {!secondAngle ? (
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => setSecondAngle(!secondAngle)}
            >
              <AngleDown />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => setSecondAngle(!secondAngle)}
            >
              <AngleUp />
            </TouchableOpacity>
          )}
        </View>
        <Line3 />
        {secondAngle ? renderSecondSection() : <View></View>}
      </View>
      <View style={{ height: 350 }}></View>
    </ScrollView>
  );
  const TagSheet = React.useRef(null);

  function renderAnglePressedForm(index, innerindex) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <View style={{ marginLeft: '25%' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.leftbuttonContainer}
              onPress={() => {
                handleLeftButtonPressed(index, innerindex, 1, 0);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>- 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightbuttonContainer}
              onPress={() => {
                handleRightButtonPressed(index, innerindex, 1, 0);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>+1</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.leftbuttonContainer}
              onPress={() => {
                handleLeftButtonPressed(index, innerindex, 5, 0);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>- 5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightbuttonContainer}
              onPress={() => {
                handleRightButtonPressed(index, innerindex, 5, 0);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>+5</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginRight: '10%' }}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.leftbuttonContainer}
              onPress={() => {
                handleLeftButtonPressed(index, innerindex, 1, 1);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>- 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightbuttonContainer}
              onPress={() => {
                handleRightButtonPressed(index, innerindex, 1, 1);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>+1</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.leftbuttonContainer}
              onPress={() => {
                handleLeftButtonPressed(index, innerindex, 5, 1);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>- 5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightbuttonContainer}
              onPress={() => {
                handleRightButtonPressed(index, innerindex, 5, 1);
              }}
            >
              <Text style={[styles.text, { color: '#404040' }]}>+5</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const focusToText = () => {
    console.log('focus');
  };

  function rendersets(item, innerindex, index) {
    //console.log(isPressed)
    return (
      <View key={innerindex}>
        <View style={styles.rowcontainer}>
          <TouchableOpacity
            onPress={() => {
              togglePressed(index, innerindex);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isPressed && isPressed[index].data[innerindex] && <AngleUp />}
              {isPressed && !isPressed[index].data[innerindex] && <AngleDown />}
              <Text style={[styles.text, { marginLeft: SIZES.padding2 * 2 }]}>
                {innerindex + 1}세트
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', paddingHorizontal: 15 }}>
              <TextInput
                keyboardType="numeric"
                style={{
                  flex: 1,
                  fontSize: SIZES.body4,
                  fontFamily: 'RobotoRegular',
                }}
                onChangeText={(event) => handleWeight(event, innerindex, index)}
                value={DATA[index].data[innerindex].weight.toString()}
                autoCompleteType="off"
                placeholder="0"
                autoCorrect={false}
              />
              <Line1 />
            </View>
            {measure[index] ? (
              <Text style={styles.text}>lb</Text>
            ) : (
              <Text style={styles.text}>kg</Text>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <TextInput
                keyboardType="numeric"
                style={{ fontSize: SIZES.body4, fontFamily: 'RobotoRegular' }}
                onChangeText={(event) => handleReps(event, innerindex, index)}
                value={DATA[index].data[innerindex].rep.toString()}
                autoCompleteType="off"
                placeholder="0"
                autoCorrect={false}
              />
              <Line1 />
            </View>
            <Text style={[styles.text, { marginTop: 4 }]}>회</Text>
          </View>
          <TouchableOpacity
            style={{ marginRight: SIZES.padding, marginTop: 1 }}
            onPress={() => {
              delSets(index, innerindex);
            }}
          >
            <Minus />
          </TouchableOpacity>
        </View>
        {isPressed &&
          isPressed[index].data[innerindex] &&
          renderAnglePressedForm(index, innerindex)}
      </View>
    );
  }

  function renderTagPlus(index) {
    return (
      <TouchableOpacity
        onPress={() => {
          setWhichTag(index);
          TagSheet.current.snapTo(0);
          setBottomSheetOpened(!bottomSheetOpened);
        }}
      >
        <Tag name="+ 태그추가" color={COLORS.primary}></Tag>
      </TouchableOpacity>
    );
  }

  function renderAerobic(index) {
    return (
      <View>
        <Text style={{ fontFamily: 'RobotoRegular', fontSize: SIZES.body3 }}>
          운동 시간
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <TextInput
                keyboardType="numeric"
                style={{ fontSize: SIZES.body4, fontFamily: 'RobotoRegular' }}
                onChangeText={(event) => handleTime(event, index)}
                value={DATA[index].data[0].time.toString()}
                autoCompleteType="off"
                placeholder="  "
                autoCorrect={false}
              />
              <Line1 />
            </View>
            <Text style={styles.text}>분</Text>
          </View>
        </View>
      </View>
    );
  }

  function renderAddSets(index) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZES.padding,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            addSets(index);
          }}
        >
          <Plus />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            addSets(index);
          }}
        >
          <Text
            style={{
              marginLeft: SIZES.padding2 * 2,
              fontSize: SIZES.body3,
              fontFamily: 'RobotoRegular',
              color: '#C4C4C6',
            }}
          >
            세트추가
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function checkandRender(index) {
    if (DATA.length - index <= 1) {
      return (
        <TouchableOpacity
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onPress={() => {
            addNewWorkout(index);
          }}
        >
          <Text style={[styles.text, { color: COLORS.primary }]}>
            새로운 운동 추가
          </Text>
        </TouchableOpacity>
      );
    }
  }

  function renderHeader(index) {
    //console.log(DATA)
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            style={{ fontSize: SIZES.h4, fontFamily: 'RobotoRegular' }}
            onChangeText={(event) => handelTitle(event, index)}
            value={DATA[index].title}
            placeholder="제목"
            autoCompleteType="off"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                '정말 삭제하시겠습니까?',
                `${DATA[index].title}을 삭제합니다`,
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'OK', onPress: () => deleteWorkout(index) },
                ],
                { cancelable: false }
              );
            }}
          >
            <TrashCan />
          </TouchableOpacity>
        </View>
        <Line2 />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: SIZES.padding,
          }}
        >
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {renderTagPlus(index)}
            {DATA[index].tag.map((item, j) => (
              <TouchableOpacity
                key={j}
                onPress={() => {
                  handleTagDelete(index, j);
                }}
              >
                <Tag name={item.name} color={item.color}></Tag>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </>
    );
  }

  function renderBody(index) {
    return (
      <>
        <View style={{ margin: '3%' }}>
          <View style={styles.rowcontainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Fire />
              <Text style={styles.title}>유산소</Text>
            </View>
            <Switch
              trackColor={{ true: COLORS.primary }}
              onValueChange={() => toggleSwitch(index)}
              value={isEnabled[index]}
              style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
            />
          </View>
          {!isEnabled[index] ? (
            <View style={styles.rowcontainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Wrench />
                <Text style={styles.title}>단위변환</Text>
              </View>
              <Switch
                trackColor={{ true: COLORS.primary }}
                onValueChange={() => toggleMeasure(index)}
                value={measure[index]}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </View>
          ) : (
            <></>
          )}
          {!isEnabled[index]
            ? DATA[index].data.map((item, innerindex) =>
                rendersets(item, innerindex, index)
              )
            : renderAerobic(index)}
          {!isEnabled[index] ? renderAddSets(index) : <></>}
        </View>
        <View style={{ marginBottom: 20 }} />
        {checkandRender(index)}
      </>
    );
  }

  function renderForm(index) {
    return isRendered() ? (
      <View key={index}>
        {isPressed ? (
          <View>
            {renderHeader(index)}
            {checkform(index) ? renderBody(index) : <></>}
          </View>
        ) : (
          <Text>로딩중입니다</Text>
        )}
      </View>
    ) : (
      <></>
    );
  }

  return (
    <>
      <SafeAreaView
        style={bottomSheetOpened ? { backgroundColor: '#CCCCCC' } : {}}
      >
        <ScrollView>
          <View style={{ margin: '5%' }}>
            {DATA.map((data, index) => renderForm(index))}
          </View>
          <View style={{ height: 600 }}></View>
        </ScrollView>
      </SafeAreaView>

      <BottomSheet
        ref={TagSheet}
        snapPoints={[750, 0, 0]}
        borderRadius={20}
        renderContent={() => renderbottomsheet()}
        initialSnap={1}
        enabledContentTapInteraction={false}
        onCloseEnd={() => setBottomSheetOpened(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  primary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    color: COLORS.lightWhite,
    fontFamily: 'RobotoBold',
    fontSize: SIZES.body4,
    textAlign: 'center',
    padding: '0.5%',
    paddingRight: '2%',
    paddingLeft: '2%',
  },
  rowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 3,
  },
  title: {
    fontSize: SIZES.body3,
    fontFamily: 'RobotoMedium',
  },
  text: {
    fontFamily: 'RobotoRegular',
    fontSize: SIZES.body3,
  },
  tagContainer: {
    backgroundColor: 'white',
    padding: SIZES.padding * 2,
    height: 750,
  },
  tagTitleContainer: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 6,
  },
  leftbuttonContainer: {
    backgroundColor: '#E9E9EB',
    borderRadius: SIZES.radius * 3,
    margin: 3,
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  rightbuttonContainer: {
    backgroundColor: '#E9E9EB',
    borderRadius: SIZES.radius * 3,
    margin: 3,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  alltag: {
    flexDirection: 'row',
    marginVertical: 30,
    width: SIZES.width * 0.7,
    justifyContent: 'space-around',
  },
  alltagcolor: {
    marginVertical: 5,
    marginRight: SIZES.padding2,
    borderRadius: 35,
    width: SIZES.h2,
    height: SIZES.h2,
  },
});

export default Workout;
