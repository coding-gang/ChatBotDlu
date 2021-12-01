import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    LogBox
} from 'react-native';
import { connect,useDispatch ,useSelector} from "react-redux";
import { moderateScale } from "react-native-size-matters";
import { SwipeListView } from 'react-native-swipe-list-view';

 function ScheduleListCalendar({data}) {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);
    const [listData, setListData] = useState([]);
    const [dataSchedule,setdataSchedule] =useState([])
    React.useEffect(() => {
        setdataSchedule(data);
        setListData
        setListData(Array(1)
        .fill('')
        .map((_, i) => ({
            data: 
                data.map((el,j)=>({             
                        key: `${i}.${j}`,
                        text: el.text             
                }))
        })))

      }, []);
      const dispatch =useDispatch();
    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };
    const callSchedule = () =>{
         return {
             type:'ĐÚNG'
         }
    }

    const updateSchedule = () =>{
        return {
            type:'MSSV_KHÁC'
        }
   }

   const deleteSchedule = () =>{
    return {
        type:'CANCLE'
    }
    }

    const updateListSchedule = (data) =>{
        return {
            type:'UPDATE_CALENDAR',
            data:data
        }
        }

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const [section] = rowKey.split('.');
        const newData = [...listData];
        const prevIndex = listData[section].data.findIndex(
            item => item.key === rowKey
        );
        newData[section].data.splice(prevIndex, 1);
        dataSchedule.splice(prevIndex,1)
        setdataSchedule(dataSchedule);
        setListData(newData);
        dispatch(updateListSchedule(dataSchedule));
    };

    const onRowDidOpen = rowKey => {
        console.log('This row opened', rowKey);
    };

    const renderItem = data => (
            <View style={styles.rowFront}
            underlayColor={'#AAA'}>
                <Text style={styles.textMessage}>{data.item.text}
            </Text>
            </View>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => closeRow(rowMap, data.item.key)}
            >
                <Text style={styles.backTextWhite}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => {deleteRow(rowMap, data.item.key)}}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            <SwipeListView
                useSectionList
                sections={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-85}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
             <Text style={styles.messageConfirm}>
                 Bạn muốn xem thời khóa biểu với mã số của bạn?
             </Text>
             <View style={styles.touchView}>     
             <TouchableOpacity style={styles.touch} onPress={()=> dispatch(callSchedule())}>
             <Text style={styles.textItem}>đúng</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.touch} onPress={()=>dispatch(deleteSchedule())}>
             <Text style={styles.textItem}>hủy</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.touch} onPress={()=> dispatch(updateSchedule())}>
             <Text style={styles.textItemMssv}>mã số khác</Text>
             </TouchableOpacity>
             </View>
        </View>
    );
}
export default ScheduleListCalendar

const styles = StyleSheet.create({
    container: {
        marginVertical: moderateScale(7, 2),
        flex: 1,
        maxWidth: moderateScale(350, 2),
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(20, 2),
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: "#272C3A",
        width:270,
        marginLeft:15
    },
    backTextWhite: {
        color: '#FFF',
    },
    textMessage: {
        color: "white",
        textAlign: "center",
      },

    rowFront: {
    maxWidth: moderateScale(250, 2),
    borderColor: "white",
    backgroundColor: "#272C3A",
    justifyContent: "center",
    fontSize: 12,
    marginRight: 8,
    marginLeft: 8,
    borderWidth: 1,
    marginTop:5,
    height: 40,
    width:150,
    right: -40,
   borderRadius: 10,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#272C3A',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
         paddingLeft: 10,
        width:200
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        marginTop:4
    },
    backRightBtnLeft: {
        right: 50
    },
    backRightBtnRight: {
        right: 1,
    },
    textItem: {
        marginTop:15,
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
      },
      textItemMssv: {
          marginTop:15,
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
      messageConfirm:{
        marginTop:15,
        color: "white",
        marginLeft:10,
        borderColor: "white",
        backgroundColor: "#272C3A",
        fontSize:15,
        padding:8
      }

});
