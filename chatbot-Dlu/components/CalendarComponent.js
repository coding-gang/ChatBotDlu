import React,{useState} from 'react';
import {Modal, Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Agenda from 'react-native-vector-icons/AntDesign';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { connect } from "react-redux";
const CalendarComponent = (props) =>{

    LocaleConfig.locales['fr'] = {
  monthNames: ['Tháng một','Tháng hai','Tháng ba','Tháng tư','Tháng năm','Tháng sáu','Tháng bảy','Tháng tám','Tháng chín','Tháng mười','Tháng mười một','Tháng mười hai'],
  monthNamesShort: ['Th1','Th2','Th3','Th4','Th5','TH6','Th7','Th8','Th9','Th10','Th11','Th12'],
  dayNames: ['chủ nhật','Thứ hai','thứ ba','thứ 4','thứ năm','thứ sáu','thứ bảy'],
  dayNamesShort: ['CN','T.2','T.3','T.4.','T.5.','T.6','T.7.'],
  today: 'hôm nay\'hn'
};
LocaleConfig.defaultLocale = 'fr';
const [isModalVisible,setModalVisible] = useState(false);
const toggleModal = () =>{
    setModalVisible(!isModalVisible);
}
Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
    dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() - 
    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
        weeknum = Math.floor((daynum+day-1)/7) + 1;
        if(weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1,0,1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
};

const getDate = (date) =>{
  //{"dateString": "2021-09-22", "day": 22, "month": 9, "timestamp": 1632268800000, "year": 2021}
  const message={dayName:'',week:'',year:''}
  message.week= new Date(date.year,date.month-1,date.day).getWeek()+1;
  message.year = `${date.year}-${date.year +1}`;
  const arrDayNames = ['chủ nhật','thứ hai','thứ ba','thứ 4','thứ năm','thứ sáu','thứ bảy',]
  const d = new Date(date.dateString);
  message.dayName = arrDayNames[d.getDay()];
  console.log(message);
}

    return(
        <TouchableOpacity style={styles.container} onPress={toggleModal} >   
            <Agenda  name='calendar' color="white" size={30} /> 
          <Modal animationType="fade" 
          transparent={true} 
          visible={isModalVisible}
          onRequestClose={()=>setModalVisible(false)}
             >
                 <TouchableOpacity style={styles.modalContainer} onPress={() => { setModalVisible(false)}}>
                        <TouchableOpacity style={styles.modal}  activeOpacity={1} >
                            <Calendar
                            onDayPress={(day) =>{getDate(day)}}
                             style={styles.calendarView} 
                              pagingEnabled={true} 
                              horizontal={true} 
                              calendarWidth={320}
                             onDayLongPress={(day) =>{getDate(day)}}
                              // dayComponent={({date, state}) => {
                              //   return (
                              //      <View>
                              //        <Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>
                              //          {date.day}
                              //        </Text>
                              //      </View>
                              //    );
                              //   }}
                             theme={{
                               backgroundColor:'#fffff',
                               textMonthFontWeight: 'bold',
                               textDayHeaderFontWeight: '300',
                               arrowColor: '#8961D8',
                               textDayFontSize: 17,
                              textMonthFontSize: 20,
                              textDayHeaderFontSize: 19,
                              todayBackgroundColor:'#8961D8',
                              todayTextColor: '#ffffff',
                              monthTextColor: '#8961D8',
                              selectedDotColor: '#ffffff',
                              dayTextColor: 'black',
                             }}
                              />
                        </TouchableOpacity>
                    </TouchableOpacity>
            </Modal>
       </TouchableOpacity>
    );
}
function mapStateToProps(state) {
    return {
      init: state.initHintMessageReducer,
    };
  }
export default connect(mapStateToProps) (CalendarComponent);

const styles = StyleSheet.create({
    container:{
    flex:1,
    flexDirection: "row",
    marginHorizontal: 15,
    position: "absolute",
    bottom:15,
    left:0,
    borderRadius:60,
    backgroundColor:'#434959',
    },
    calendarView:{
        justifyContent:'center',
        height:400,
        borderRadius:30,
        borderColor: '#8961D8',
        borderWidth:3
    },
     modalContainer: {
         flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modal:{
        width:'90%' ,
      height: 400,
  },  
})