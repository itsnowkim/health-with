import React, {useEffect, useState} from "react";
import {View } from 'react-native';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { COLORS, SIZES } from "../constants";

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일', '월','화','수','목','금','토'],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = 'fr';

const CalendarBase = ({setSelectedDate}) => {

    const [markedDatesState, setMarkedDatesState] = useState({})

     return (
      <View>
        <Calendar
        //선택 날짜 마킹
        markedDates={markedDatesState}

        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
            day.selected = true
            day.selectedColor = COLORS.primary

            let newMarked = {}
            newMarked[day.dateString] = {selected: true, selectedColor: COLORS.primary}
            setMarkedDatesState(newMarked)

            setSelectedDate({
              month: day.month,
              date: day.day,
              day: new Date(day.dateString).getDay(),
              dateString: day.dateString
            })
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={'yyyy MM'}
        // Handler which gets executed when visible month changes in calendar. Default = undefined
        onMonthChange={(month) => {console.log('month changed', month)}}
        
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={0}
        
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={substractMonth => substractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={addMonth => addMonth()}
        // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
        disableAllTouchEventsForDisabledDays={false}
        /** Replace default month and year title with custom one. the function receive a date as parameter. */
        //renderHeader={(date) => {/*Return JSX*/}}
        theme={{
            textSectionTitleColor: 'black',
            textSectionTitleDisabledColor: 'gray',
            dayTextColor: 'black',
            todayTextColor: COLORS.blue,
            monthTextColor: 'black',
            arrowColor: COLORS.primary,
            'stylesheet.calendar.header': {
              week: {
                marginTop: SIZES.padding,
                marginHorizontal: SIZES.padding,
                flexDirection: 'row',
                justifyContent: 'space-between'
              },
              dayTextAtIndex0: {
                color: 'red'
              },
              dayTextAtIndex6: {
                color: COLORS.blue
              }
            }
          }}
        />
      </View>
     )
 }

export default CalendarBase;