import MicroIcons from "react-native-vector-icons/Feather";
import {Modal,Text,View,TouchableOpacity,StyleSheet} from "react-native";
import React, {useState, useEffect} from 'react';
import Voice from 'react-native-voice';
import { connect } from "react-redux";
import LottieView from 'lottie-react-native';
const Voices = (props) => {
    const [pitch, setPitch] = useState('');
	const [error, setError] = useState('');
	const [end, setEnd] = useState('');
	const [started, setStarted] = useState('');
	const [results, setResults] = useState([]);
	const [partialResults, setPartialResults] = useState([]);
	const [Isvisible, setVisible] = useState(false);
  const [voiceMess, setVoiceMess] = useState('');
    useEffect(() => {
		//Setting callbacks for the process status
		Voice.onSpeechStart = onSpeechStart;
		Voice.onSpeechEnd = onSpeechEnd;
		Voice.onSpeechError = onSpeechError;
		Voice.onSpeechResults = onSpeechResults;
		Voice.onSpeechPartialResults = onSpeechPartialResults;
	//	Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
     
		return () => {
			//destroy the process after switching the screen
			Voice.destroy().then(Voice.removeAllListeners);
			
		};
	}, []);

    const onSpeechStart = (e) => {
		//Invoked when .start() is called without error
		console.log('onSpeechStart: ', e);
		setStarted("Listening...");
	};

	const onSpeechEnd = (e) => {
		//Invoked when SpeechRecognizer stops recognition
		console.log('onSpeechEnd: ', e);
    setEnd('√');
    setTimeout(() => {      
      setVisible(false);         
    }, 1500);
	};

	const onSpeechResults = (e) => {
		//Invoked when SpeechRecognizer is finished recognizing
		console.log('onSpeechResults: ', e);
        setResults(e.value);
        setVoiceMess(e.value[0]);     
        props.myValue.text = e.value[0];  
        props.dispatch({ type: "VOICE" });     
      
	};

	const onSpeechPartialResults = (e) => {
		//Invoked when any results are computed
		console.log('onSpeechPartialResults: ', e);
        setPartialResults(e.value);
	};

	const onSpeechVolumeChanged = (e) => {
		//Invoked when pitch that is recognized changed
		console.log('onSpeechVolumeChanged: ', e);
		setPitch(e.value);
	};
    const onSpeechError = (e) => {
		//Invoked when an error occurs.
		console.log('onSpeechError: ', e);
		setError(e.error.message);
		setVisible(false);
	};
    

	const startRecognizing = async () => {
                 
		try {         	       
			             setVisible(true);
                   await Voice.start('vi-VN');	
                    setPitch('');
                    setResults([]);
                    setPartialResults([]);
                    setEnd('');	   
                    setVoiceMess('')    
		} catch (e) {
			console.error(e);
		}
	};

return(

    <TouchableOpacity style={styles.micro} onPress={startRecognizing}>
    <MicroIcons    
      name="mic"
      color="white"
      size={20}
    />    
	  <Modal animationType = "slide" 
        transparent={true} visible={Isvisible} 
        >
          <View style={styles.container}>  
          <Text style ={styles.text}>Bot Dlu</Text>     
          <LottieView  style={styles.gifBot} source={require('../Assets/28832-bot.json')}  autoPlay loop />                 
          <View  style={styles.containerWatting}>
          <Text style ={styles.text}>Đang nghe</Text>  
          <LottieView style={styles.gifWatting} source={require('../Assets/13531-loading-bar-dotted-bar-colorful.json')}  autoPlay loop />
          </View>
           <Text style ={styles.textResult}>{voiceMess}</Text>
             <LottieView style={styles.gifImg} source={require('../Assets/7833-voice.json')}  autoPlay loop />
          </View>
        </Modal>
   </TouchableOpacity>
   
)
}
const styles = StyleSheet.create({
    micro: {
        flexDirection: "row",
        position: "absolute",
        right: 3,
        padding:10,
        borderRadius: 60,
        backgroundColor: "#434959",
      },
	  container:{
        backgroundColor:"#000000aa",
        flex:1,
        alignItems:"center",
        
      },
    text: {
        fontSize:26,
        color:"white",
        fontFamily:"Glory"
      },
        textResult: {
        fontSize:24,
        color:"white",
        top:90,
      },
      gifImg:{
        width: 150,
        height: 150,
        top:100
      },
      gifBot:{
        width: 150,
        height: 150,
      },
      gifWatting:{
        width: 50,
      },
      containerWatting:{
        flexDirection:'row',
        top:10
      }

})

function mapStateToProps(state) {
  return {
    myValue: state.vocieMessageReducer,
  };
}
export default connect(mapStateToProps)(Voices);