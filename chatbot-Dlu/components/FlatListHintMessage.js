import React,{useState} from "react";
import {StyleSheet,FlatList ,Animated} from 'react-native'
import { connect } from "react-redux";
import HintMessage from "./HintMessage";

const FlatListHintMessage=(props) =>{
  const [fadeAnim] = useState(new Animated.Value(0));
       
  function fadeInFlatList(){
    Animated.timing(fadeAnim,{
      toValue:1,
      duration:1000,
      useNativeDriver:true,
    }).start();
  }
  function fadeOutFlatList(){
    Animated.timing(fadeAnim,{
      toValue:0,
      duration:1000,
      useNativeDriver:true,
    }).start();
  }

        if(props.init.display === 'flex'){      
          fadeInFlatList();
        }else{
          fadeOutFlatList()
        }  
    return(
      <Animated.View style={[{opacity:fadeAnim},styles.styleHintMessage,{display:props.init.display}]}>
      <FlatList      
       horizontal={true}
       data={props.data}
       renderItem={({ item }) => <HintMessage text={item} />}
       keyExtractor={(item) => item.id.toString()}
       showsHorizontalScrollIndicator={false}
      />
      </Animated.View>
    
     ); 
}

const styles = StyleSheet.create({
  styleHintMessage: {
    backgroundColor:"#1D1F2C"
  },
});

function mapStateToProps(state) {
  return {
    data: state.hintMessageReducer,
    init:state.initHintMessageReducer,
  };
}

export default connect(mapStateToProps)(FlatListHintMessage);