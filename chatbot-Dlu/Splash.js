import React from "react";
import {View,StyleSheet, ImageBackground,StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import {getDataStorage} from "./Storage/dataStorage";
const Splash =({navigation})=> {
   React.useEffect(()=>{
     StatusBar.setHidden(true);
     AsyncStorage.getItem('alreadyLaunched').then(value=>{
            if(value == null){
             AsyncStorage.setItem('alreadyLaunched','true');
             setTimeout(() => {
                navigation.navigate('OnboardingScreen');
            }, 3000);
            }else{           
                let items =[];
                getDataStorage().then(stores =>{
                    stores.map( (result,i,store)=>{   
                    if (store[i][1] !== null){
                     items = JSON.parse(store[i][1]);     
                    setTimeout(() => {
                        navigation.navigate('MessageBot',{items});
                    }, 2000);     
                    }else{
                        setTimeout(() => {
                            navigation.navigate('MessageBot',{items});
                        }, 2000);
                    }
                })   
                  });         
            }
     })
    },[]);
        return(
                <ImageBackground source={require('./Assets/bot.jpg')} style={styles.container}>
                      <View style={{flex:1}}>
                      </View>
                </ImageBackground>
        );
}
const styles = StyleSheet.create({
    container:{     
        height:'100%',
        width:'100%'
    }
})

export default Splash;