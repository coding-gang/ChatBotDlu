import React from 'react';
import {Modal, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Agenda from 'react-native-vector-icons/AntDesign'
const CalendarComponent = () =>{
    return(
        <TouchableOpacity style={styles.container}>
            <Agenda  name='calendar' color="white" size={30}/>
        </TouchableOpacity>
    );
}

export default CalendarComponent;

const styles = StyleSheet.create({
    container:{
    flexDirection: "row",
    marginHorizontal: 15,
    position: "absolute",
    bottom:15,
     left:0,
    borderRadius:60,
    backgroundColor:'#434959',
    }
})