// import React
import React from "react";
import { connect } from "react-redux";
//import react native Component
import { StyleSheet, View, Text,Animated,TouchableOpacity } from "react-native";
// Import react-native-size-matters
import { moderateScale } from "react-native-size-matters";

class SpecifyScheduleBot extends React.Component {

  state = {
    animatedValue: new Animated.Value(0)
  };

  startAnimation() {
   return Animated.timing(this.state.animatedValue,
    {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
    });
  };
  componentDidMount(){
    this.startAnimation().start();
  }

  render() {
    
    const AnimationValue = this.state.animatedValue.interpolate(
      {
          inputRange: [ 0, 1 ],
          outputRange: [ -59, 0 ]
      });
    return (
          
         <Animated.View    
      style={[  styles.message,
                styles.not_mine, 
        {opacity: this.state.animatedValue, transform: [{ translateY: AnimationValue }] }]} >      
             <View style={[styles.cloudNotMine]}>       
             {this.props.text ? (
            <Text style={[styles.text]}>{this.props.text}
            </Text>
          ) : null}        
             </View> 
             <View style={styles.touchView}>     
             <TouchableOpacity style={styles.touch} onPress={()=> this.props.dispatch({ type: "ĐÚNG" })}>
             <Text style={styles.textItem}>đúng</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.touch} onPress={()=> this.props.dispatch({ type: "CANCLE" })}>
             <Text style={styles.textItem}>hủy</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.touch} onPress={()=> this.props.dispatch({ type: "MSSV_KHÁC" })}>
             <Text style={styles.textItemMssv}>mã số khác</Text>
             </TouchableOpacity>
             </View>
        </Animated.View>
       
    );
  }
}
export default connect()(SpecifyScheduleBot);

const styles = StyleSheet.create({
  message: {
    flexDirection: "column",
    marginVertical: moderateScale(7, 2),
  },
  not_mine: {
    marginLeft: 5,
  },
  cloudNotMine: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: (7, 2),
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: "#272C3A",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 35,
  },
  arrow_container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  textItemMssv: {
    color: "white",
    marginLeft:4,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "#272C3A",
    borderWidth:1,
    fontSize:15,
    padding:8,
    width:100
  },
  textItem: {
    color: "white",
    marginLeft:4,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "#272C3A",
    borderWidth:1,
    fontSize:15,
    padding:8
  },
  touchView:{
  flexDirection: "row",
  },
  touch:{
  paddingBottom: (7, 10),
  maxWidth: moderateScale(80, 2),
  paddingHorizontal: moderateScale(5, 2),
  paddingTop: moderateScale(5, 2),
  }

});
