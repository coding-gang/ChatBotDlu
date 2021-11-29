import * as React from 'react';
import { View,StyleSheet,Text} from 'react-native';
import PagerView from 'react-native-pager-view';
import { moderateScale } from "react-native-size-matters";

export default function ScheduleRouteComponent({item}) {
    console.log(item);
    return (
        <PagerView  style={{ flex:1 }} orientation="vertical"  initialPage={0}>
         {  
            item.map((el,key)=>{
              return (
              <View style={styles.cloudMine} key={key}>
                <Text  style={styles.text}>{el}</Text>
               </View>
               )          
            })
         } 
    </PagerView> 
      );

}
const styles = StyleSheet.create({
  cloudMine: {
    backgroundColor: "black",
    paddingLeft:10
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 35,
  },
})