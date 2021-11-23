import React,{useState} from 'react';
import {Modal, TouchableOpacity,View,Text, StyleSheet,Animated,Dimensions} from 'react-native';
import Agenda from 'react-native-vector-icons/AntDesign';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { connect } from "react-redux";
const CalendarComponent = (props) =>{

    LocaleConfig.locales['fr'] = {
  monthNames: ['Tháng một','Tháng hai','Tháng ba','Tháng tư','Tháng năm','Tháng sáu','Tháng bảy','Tháng tám','Tháng chín','Tháng mười','Tháng mười một','Tháng mười hai'],
  monthNamesShort: ['Th1','Th2','Th3','Th4','Th5','TH6','Th7','Th8','Th9','Th10','Th11','Th12'],
  dayNames: ['chủ nhật','Thứ hai','thứ ba','thứ tư','thứ năm','thứ sáu','thứ bảy'],
  dayNamesShort: ['CN','T.2','T.3','T.4','T.5','T.6','T.7'],
  today: 'hôm nay\'hn'
};
LocaleConfig.defaultLocale = 'fr';
const [isModalVisible,setModalVisible] = useState(false);
const [animation,setAnimation] =useState(new Animated.Value(0));
const [day, setday] = useState('');
const {height} = Dimensions.get("window");
const toggleModal = () =>{
    setModalVisible(!isModalVisible);
    modalTrigger();
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
  const arrDayNames = ['Chủ nhật','Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7']
  const sendCalendar = () =>{
    save();
   setTimeout(() => {
    setModalVisible(false);
    setday('');
   }, 3000); 
    props.dispatch({
      type:"NO_SEND_CALENDAR"
    })
  }
const getDate = (date) =>{
  //{"dateString": "2021-09-22", "day": 22, "month": 9, "timestamp": 1632268800000, "year": 2021}
  const message={dayName:'',week:'',month:'',year:''}
  message.week= new Date(date.year,date.month-1,date.day).getWeek()+1;
  message.month = date.month;
  message.year = `${date.year}-${date.year +1}`;
  const d = new Date(date.dateString);
  message.dayName = arrDayNames[d.getDay()];
 // {mine:true, data:{dayName:'',week:'',year:''},text:''}
  props.dataCalendar.data = message;
  const mesUser= `TKB ngày ${date.day} tháng ${date.month} năm ${date.year}`
  props.dataCalendar.textCalendar = mesUser;
  sendCalendar();
}

  const openModal =animation.interpolate({
      inputRange:[0,1],
      outputRange:[0,1],
      extrapolate:"clamp"
  });
  
  const saveModal =animation.interpolate({
    inputRange:[1,2],
    outputRange:[0,-height],
    extrapolate:"clamp"
 });
 
  const modalTrigger =()=>{
     Animated.timing(animation,{
       toValue:1,
       duration:500,
       useNativeDriver:true
     }).start();
  };
  const save =()=>{
    Animated.timing(animation,{
      toValue:2,
      duration:500,
      useNativeDriver:true
    }).start(()=>{
      animation.setValue(0)
    });
 };
 const close =()=>{
  Animated.timing(animation,{
    toValue:0,
    duration:500,
    useNativeDriver:true
  }).start();
};

  const open ={
    transform:[
      {scale:openModal},
     {translateY:saveModal}
    ]
       
  };

    return(
           
        <TouchableOpacity style={styles.container} onPress={toggleModal} >    
            <Agenda  name='calendar' color="white" size={30} /> 
            <Modal 
            transparent={true}
          visible={isModalVisible}
          onRequestClose={()=>setModalVisible(false)}
           >   
                  
            <Animated.View style={[styles.modalContainer,open]}>      
           
               <TouchableOpacity style={styles.modalContainer}  onPress={() => {close(), setTimeout(() => {
                   setModalVisible(false),
                   setday('');
                 }, 1500); }}>
                <Text style={styles.text}>Ấn giữ để chọn</Text>  
                        <TouchableOpacity style={styles.modal}  activeOpacity={1} >
                            <Calendar
                             style={styles.calendarView} 
                              pagingEnabled={true}                
                              horizontal={true} 
                              calendarWidth={320}                   
                              markedDates={{
                                [day]: { selected: true,  marked: true},
                               
                                }}
                              onDayPress ={day => setday(day.dateString)}
                              onDayLongPress={(day) =>{getDate(day)}}
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
                              selectedDayBackgroundColor: '#bfa3f7',
                             }}
                              />
                        </TouchableOpacity>
                    </TouchableOpacity> 
                    </Animated.View>               
                    </Modal>                                  
       </TouchableOpacity>
    );
}
function mapStateToProps(state) {
    return {
      dataCalendar: state.messCalendarReducer,
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
    left:0
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
  text: {
    flex:0.2,
    fontSize: 18,
    color: 'white'
  },
})