import * as React from 'react';
import { View, useWindowDimensions,StyleSheet,Text,Animated} from 'react-native';
import { TabView, SceneMap ,TabBar } from 'react-native-tab-view';
import PagerView from 'react-native-pager-view';
import ScheduleRouteComponent from './ScheduleRouteComponent';
import { moderateScale } from "react-native-size-matters";
  export default function ScheduleTabViewComponent({schedules}) {
    const [routes, setarrRoutes] = React.useState([]);
    
    const [index, setIndex] = React.useState(0);
    
    const [renScene,setrenScene] =React.useState({});

    const [itemArr,setItemArr] =React.useState([]);

    const [animatedValue,setanimatedValue] = React.useState(new Animated.Value(0))

   const startAnimation =() =>{
      return Animated.timing(animatedValue,
       {
           toValue: 1,
           duration: 400,
           useNativeDriver: true
       });
     };


    const initTableView =(schedules)=>{
       
         const tmpArr =[]
         const tmpItem = [];
         schedules = schedules.filter(el => el[Object.keys(el)[0]].length !==0)
         
         schedules.forEach((el,index)=>{   
            const dateSchedule = Object.keys(el)[0];
            tmpItem.push(el[Object.keys(el)[0]]); 
            let getDate = dateSchedule.substring(0,1).concat('.')
            .concat(dateSchedule.replace( /^\D+/g, ''));           
            tmpArr.push({key:index,title:getDate})
          })
          setItemArr(tmpItem);
          setarrRoutes(tmpArr);
    }

    React.useEffect(() => {
      initTableView(schedules);
      startAnimation().start();
    }, []);

    const number =[]
      itemArr.forEach(el =>{   
          const ScheduleRoute = () => <ScheduleRouteComponent item={el}/>
          number.push(ScheduleRoute)
      })
    let objRenderScene = Object.assign({}, number);
      
   
    const renderScene = SceneMap(
      objRenderScene
    );
    const layout = useWindowDimensions();

    const AnimationValue = animatedValue.interpolate(
      {
          inputRange: [ 0, 1 ],
          outputRange: [ -59, 0 ]
      });
  
    return (
      <Animated.View style={[ styles.container,
           {opacity: animatedValue, transform: [{ translateY: AnimationValue }] }]} >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ height: layout.height }}
        renderTabBar={props => <TabBar {...props}
        indicatorStyle={{ backgroundColor: '#5E56BD' }}
        style={{backgroundColor: '#272C3A'}}/>}
      />
      </Animated.View>
    
    );
  }

  const styles = StyleSheet.create({
        container:{
            marginTop:10,
            marginBottom:20,
            height:350,
            paddingBottom: (7, 2),
            maxWidth: moderateScale(250, 2),
            paddingHorizontal: moderateScale(10, 2),
            paddingTop: moderateScale(5, 2)
        }
  })