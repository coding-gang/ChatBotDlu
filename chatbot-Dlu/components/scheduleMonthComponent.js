import React from 'react'
import { StyleSheet, View} from 'react-native'
import Swiper from 'react-native-swiper'
 import ScheduleTabViewComponent from './ScheduleTabViewComponent';
export default function ScheduleMonthComponent({schedules}) {
  
    return(
        <Swiper style={styles.wrapper} showsButtons={false}
        paginationStyle = {styles.pagination}
        activeDotColor = "#5E56BD"
        dotColor="#fff"
        >
            {
            
                schedules.filter(obj => obj[0][Object.keys(obj[0])[0]].length !== 0).map((item,key)=>{
                   return <View>
                     <ScheduleTabViewComponent key={key} not_mine schedules={item} />
                    </View>
                })
            }
      </Swiper>
    )

}

const styles = StyleSheet.create({
  wrapper: {
   height :420
  },
  pagination: {
     marginLeft:-50
   },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
    
  }
})
 
