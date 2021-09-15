import React from "react";
import { View, StyleSheet, TextInput,TouchableOpacity ,Animated} from "react-native";
import MaterialIcons   from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import Voice from "./VoiceComponent";
import { moderateScale } from "react-native-size-matters";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state={ countShow :0}
  }
  pressIn = ()=>{
    this.props.dispatch({ type: "PRESS_IN" });
  }
  pressOut=()=>{
    this.props.dispatch({ type: "PRESS_OUT" });
  }

  OnInputText = (TextInputValue) => {
    
    if(this.props.myMessage.text ===''){
         this.state.countShow =0;  
       }
      this.state.countShow +=1;
    if (TextInputValue.trim() != '') {
      this.props.myMessage.text = TextInputValue;
      this.props.myMessage.mine =true;
      if( this.state.countShow === 1  ){
      this.props.dispatch({ type: "SHOW" });
      }
      this.props.dispatch({ type: "NOT" });
    }else {
      this.state.countShow =0;
      this.props.myMessage.text = TextInputValue;
      this.props.dispatch({ type: "NONE" });      
    }

  };

  onChangeText(event) {
    this.setState({
     fontSize: event.nativeEvent.text.length > 6 ? 40 : 80,
      inputValue: event.nativeEvent.text
    });
  }

  render() {
    const state = {
      animation: new Animated.Value(0)
    };

    function startAnimation() {
      Animated.timing(state.animation, {
       toValue:1,
       duration: 500,
       useNativeDriver: true
     }).start();
   }
    
     const rotateInterpolate = state.animation.interpolate({
       inputRange: [0, 1],
       outputRange: ["0deg", "180deg"],
       
     });
  
     const animationStyle = {
       transform: [{ rotate: rotateInterpolate }],
     };

     if (this.props.init.display === "flex") {     
      startAnimation();
      }
 
    return (
      <View style={styles.container}>
          <TouchableOpacity style={[styles.cancel,{display:this.props.init.display}]}>
            <Animated.View style={animationStyle}>
            <MaterialIcons onPress={()=>this.pressOut()} name="cancel" size={24} color="white" />
              </Animated.View>   
         </TouchableOpacity>
         
        <TextInput
          multiline
          onChange={(event) =>
            this.onChangeText(event)
          }
          placeholder="Nhập..."
          style={styles.input}
          onChangeText={(TextInputValue) => {
            this.OnInputText(TextInputValue);
          }}
         value={this.props.myMessage.text}
         keyboardAppearance="dark"
         onFocus={() => this.pressIn()}
        />
        
       <Voice/>
      </View>
    );
  }
}

  function mapStateToProps(state) {
    return {
      myMessage: state.sendMessageReducer,
      init: state.initHintMessageReducer,
    };
  }
export default connect(mapStateToProps)(Input);
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: responsiveWidth(70),
    position: "absolute",
    borderRadius: 60,
    backgroundColor: "#30384B",
    justifyContent: "center",
    marginHorizontal: 40,
    bottom:5,
     
  },
  input: {
    fontSize: responsiveFontSize(2),
    width: "80%",
    color: "white",
    borderColor: "transparent",
    alignItems: "center",
    height : 50
  },
  hintMess:{
    color:"white"
  },
  cancel:{
    padding:1,
    borderRadius: 60,
    backgroundColor: "#434959"
  }
});



