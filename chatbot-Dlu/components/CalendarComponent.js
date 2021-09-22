import React,{useState} from 'react';
import {Modal, Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Agenda from 'react-native-vector-icons/AntDesign';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import { connect } from "react-redux";
const CalendarComponent = (props) =>{

    LocaleConfig.locales['fr'] = {
  monthNames: ['Tháng một','tháng hai','tháng ba','tháng tư','tháng năm','tháng sáu','tháng bảy','tháng tám','tháng chín','tháng mười','tháng mười một','tháng mười hai'],
  monthNamesShort: ['Th1','Th2','Th3','Th4','Th5','TH6','Th7','Th8','Th9','Th10','Th11','Th12'],
  dayNames: ['Thứ hai','thứ ba','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['T.2','T.3','T.4.','T.5.','T.6','T.7.','CN.'],
  today: 'hôm nay\'hn'
};
LocaleConfig.defaultLocale = 'fr';
const [isModalVisible,setModalVisible] = useState(false);
const toggleModal = () =>{
    setModalVisible(!isModalVisible);
}
    return(
        <View style={styles.container}>
        <TouchableOpacity >
            <Agenda  name='calendar' color="white" size={30} onPress={toggleModal}/> 
        </TouchableOpacity>
          <Modal animationType="fade" 
          transparent={true} 
          visible={isModalVisible}
          onRequestClose={()=>setModalVisible(false)}
             >
                 <TouchableOpacity style={styles.modalContainer} onPress={() => { setModalVisible(false)}}>
                        <TouchableOpacity style={styles.modal}  activeOpacity={1} >
                            <Calendar style={styles.calendarView}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
            </Modal>
        </View>
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
      height: 300,
  },  
})