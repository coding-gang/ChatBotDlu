
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import MessageBubble from './components/MessageBubble';
import Input from './components/Input';
import Send from './components/Send';
import ConfirmBot from './components/ConfirmBot';
import FlatListHintMessage from './components/FlatListHintMessage';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {combineReducers} from 'redux';
import {renderSchedule} from './module/ScheduleModule';
import {ScheduleTableView} from './module/ScheduleTableViewModule';
import SpecifyScheduleBot from './components/SpecifyScheduleBot';
import ScheduleTabViewComponent from './components/ScheduleTabViewComponent';
import {
  getDataStorage,
  setDataStorage,
  removeDataStorage,
  getMSSVDataStorage,
  setMSSVDataStorage,
  removeMSSVStorage,
  checkExistMssv,
} from './Storage/dataStorage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import CalendarComponent from './components/CalendarComponent'

// socket-client
const io = require('socket.io-client/dist/socket.io.js');
const YES = 'có';
const NO = 'không';
const CANCEL = 'hủy';
const OK ="đúng";
const OTHERMSSV ="mã số khác"
class MessageBot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrMessage: [],
      data: [],
      deleteMessage: false,
      scheduleMessage: false,
      updateMSSV: false,
      specifySchedule: false,
      confirmUpdate: NO,
      dataSpecifySchedule:{},
      otherMssvFromCalendar :false,
      mssv:"",
      checkNumberMssvError:0,
      cancleCalendar:false,
      isInputMssv:false,
      saveCalendar:{}
    };

    //https://chatbot-dlu.herokuapp.com
    this.socket = io('https://chatbot-dlu.herokuapp.com', {
      transports: ['websocket', 'polling', 'flashsocket'],
      jsonp: false,
    });

    this.socket.on('connect', () => {
      console.log('socket connected from server chatbot-dlu');
    });
    this.socket.on('send-schedule', data => {
      if (Array.isArray(data)) {
        this.state.arrMessage.splice(-1,1);
          const messageBots =ScheduleTableView(data);
          this.renderFromBotTable(messageBots);
       // const messageBots = renderSchedule(data);
        // messageBots.forEach(e => {
        //   this.renderFromBot(e.text);
        // });
      } else {
        this.renderFromBot(data);
      }
    });
    const {items} = this.props.route.params;
    this.state.arrMessage = items;
    this.sendHelper();
  }

  sendHelper() {
    if (this.state.arrMessage.length === 0) {
      this.SendScheduleBot('hỗ trợ');
    }
  }

  TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
      if (str.length > 0) {
        if (!isNaN(str)) {
          retValue = parseInt(str);
        }
      }
    }
    return retValue;
  }

  addMessage = async message => {
    this.state.arrMessage.push(message);
    await setDataStorage(this.state.arrMessage);
  };

  add_view() {
    this.setState({arrMessage: this.state.arrMessage});
  }

  renderFromUser(isMine, text) {
    const newMess = {mine: isMine, text: text};
    this.addMessage(newMess);
    this.add_view();
  }

  renderFromBotTable(data) {
    this.addMessage(data);
    this.add_view();
  }

  renderFromBot(text, confirm = false) {
    const newMess = {mine: false, text: text, Confirm: confirm};
    this.addMessage(newMess);
    this.add_view();
  }
  renderFromSpecifyBot(text, specifySchedule = false) {
    const newMess = {mine: false, text: text, specifySchedule: specifySchedule};
    this.addMessage(newMess);
    this.add_view();
  }

  isDeleleMessageBot() {
    this.setState({deleteMessage: true});
    this.renderFromBot('Bạn có chắc xóa tin nhắn không?', true);
  }
  confrimIsDeleteMessageBot(confirm) {
    if (confirm === YES) {
      this.setState({deleteMessage: false});
      this.renderFromBot('Đang xử lý...!');
      setTimeout(() => {
        removeDataStorage();
        this.state.arrMessage = [];
        this.add_view();
        this.sendHelper();
      }, 2000);
    } else {
      this.setState({deleteMessage: true});
    }
  }

  isUpdateMessageBot() {
    this.renderFromBot('Bạn có chắc cập nhật lại mssv không?', true);
  }

  isMssvUpdateBot() {
    this.renderFromBot('Mã số bạn muốn cập nhật là gì?');
  }
  updateMSSVBot(mssv) {
    this.setState({updateMSSV: false});
    getMSSVDataStorage().then(kq => {
      const existMssv = checkExistMssv(kq, true); //clear storage mssv ;return null;
      if (existMssv === null) {
        this.renderFromBot('Đang xử lý...!');
        setTimeout(() => {
          setMSSVDataStorage(mssv);
        }, 1000);
        setTimeout(() => {
          this.renderFromBot('Cập nhật thành công!');
          this.renderFromBot(
            'Bạn đã có thể xem lại thời khóa biểu mới cập nhật!',
          );
          this.state.confirmUpdate = NO;
        }, 2000);
      }
    });
  }

  confrimIsUpdateMessageBot(confirm) {
    if (confirm === YES) {
      this.state.confirmUpdate = YES;
      this.isMssvUpdateBot();
    } else {
      this.setState({updateMSSV: true});
    }
  }
  provideMssv(isMssv) {
    getMSSVDataStorage().then(kq => {
      let existMssv = null;
      existMssv = checkExistMssv(kq, false);

      if (existMssv !== null) {
        this.setState({updateMSSV: true});
        this.renderFromBot(
          'Bạn đã cung cấp mssv rồi!\nBạn có muốn cập nhật lại không?',
          true,
        );
      } else {
        setMSSVDataStorage(isMssv);
        this.renderFromBot('Xin chào\nBạn đã có thể xem được thời khóa biểu!');
      }
    });
  }

  SendScheduleBot(mesageUser) {
    getMSSVDataStorage().then(kq => {
      const existMssv = checkExistMssv(kq);
      if (existMssv === null) {
        this.renderFromBot(
          "Bạn phải cung cấp MSSV trước khi xem thời khóa biểu(vd:1812866)!\nNhập 'trợ giúp' để được hỗ trợ",
        );
      } else {
        if (this.socket.connected) {
          this.socket.emit('scheduleWeek', {
            mssv: existMssv,
            message: mesageUser,
          });
        } else {
          Toast.show('Bot dlu không thể kết nối tới máy chủ', Toast.LONG);
        }
      }
    });
  }
  sendScheduleByMssv(filtered, inputText) {
    const mssv = filtered.filter(item => {
      return item.toString().length == 7;
    });
    if (mssv.length == 0) {
      this.renderFromBot('MSSV phải 7 chữ số!');
    } else {
      this.socket.emit('scheduleWeek', {mssv: mssv, message: inputText});
      return;
    }
  }

  processText(inputText) {
    const output = inputText.replace(/\'/g, '').split(/(\d+)/).filter(Boolean);

    const filtered = output.filter(function (item) {
      return parseInt(item) == item;
    });
    if (filtered.length == 2) {
      // có cả 1 chữ số và mssv
      this.sendScheduleByMssv(filtered, inputText);
    } else if (filtered.length == 1) {
      const noon = filtered.filter(item => {
        return item.toString().length == 1;
      });
      if (noon.length == 0) {
        this.sendScheduleByMssv(filtered, inputText);
      } else {
        this.SendScheduleBot(inputText);
        return;
      }
    } else {
      this.renderFromBot('Xin lỗi, tôi không hiểu ý bạn!');
      return;
    }
  }

  render() {
    const message = {mine: true, text: ''};

    const show = {
      display: 'none',
    };

    const voiceMessage = {mine: true, text: ''};
    const subst = `$1`;
    const regex = /(\d)\s+(?=\d)/g;
    const vocieMessageReducer = (state = voiceMessage, action) => {
      if (action.type === 'VOICE') {
        sendMessageReducer(
          {mine: state.mine, text: state.text},
          {type: 'SEND_MESSAGE'},
        );
        return state;
      }

      return state;
    };

    const dataHintMessage = [
      {id: 1, mine: true, text: 'TKB hôm nay'},
      {id: 2, mine: true, text: 'TKB ngày mai'},
      {id: 3, mine: true, text: 'TKB hôm qua'},
      {id: 4, mine: true, text: 'TKB tuần này'},
      {id: 5, mine: true, text: 'TKB tuần sau'},
      {id: 6, mine: true, text: 'TKB tuần trước'},
    ];
    const hintMessageReducer = (state = dataHintMessage, action) => {
      if (action.type === 'HINT_SENT_MESSAGE') {
        const arrBotFromMess = this.state.arrMessage.filter(x => {
          return x.mine === false;
        });
        if (arrBotFromMess.length > 0) {
          const hasWaiting = arrBotFromMess[arrBotFromMess.length - 1].text;
          if (hasWaiting.trim() == 'Bạn đợi tí...!') {
            Toast.show('Bạn hãy đợi trong giây lát khi có kết quả', Toast.LONG);
            return state;
          }
        }
        return state.map(e => {
          if (e.id === action.id) {
            this.renderFromUser(e.mine, e.text);
            this.SendScheduleBot(e.text);
          }
        });
      } else {
        return state;
      }
    };

    const confirmMessageReducer = (state = '', action) => {
      if (action.type === 'YES') {
        sendMessageReducer({mine: true, text: YES}, {type: 'SEND_MESSAGE'});
      } else if (action.type === 'NO') {
        sendMessageReducer({mine: true, text: NO}, {type: 'SEND_MESSAGE'});
      }else if(action.type === 'ĐÚNG'){
        sendMessageReducer({mine: true, text: OK}, {type: 'SEND_MESSAGE'});
      }else if(action.type === 'CANCLE'){
        sendMessageReducer({mine: true, text: CANCEL}, {type: 'SEND_MESSAGE'});
      }
      else if(action.type === "MSSV_KHÁC"){
        sendMessageReducer({mine: true, text: OTHERMSSV}, {type: 'SEND_MESSAGE'});
      }
      return state;
    };
    const displayHintMessage = {display: 'none'};

    const initHintMessageReducer = (state = displayHintMessage, action) => {
      if (action.type === 'PRESS_IN') {
        if (getMSSVDataStorage() !== null) {
          return {...state, display: 'flex'};
        }
      }
      if (action.type === 'PRESS_OUT') {
        return {...state, display: 'none'};
      }
      return state;
    };

    const sendMessageReducer = (state = message, action) => {
      if (action.type === 'SEND_MESSAGE') {
        const result = state.text.replace(regex, subst);
        const mesageUser = result.trim().toLocaleLowerCase();
        if (mesageUser !== '') {
          const arrBotFromMess = this.state.arrMessage.filter(x => {
            return x.mine === false;
          });
          if (arrBotFromMess.length > 0) {
            const hasWaiting = arrBotFromMess[arrBotFromMess.length - 1].text;

            if (hasWaiting.trim() == 'Bạn đợi tí...!') {
              Toast.show(
                'Bạn hãy đợi trong giây lát khi có kết quả',
                Toast.LONG,
              );
              return {mine: state.mine, text: state.text};
            }
          }
          this.renderFromUser(state.mine, mesageUser);
          // Delete MessageBot
          if (this.state.deleteMessage) {
            if (mesageUser === YES) {
              this.confrimIsDeleteMessageBot(mesageUser);
            } else if (mesageUser === NO) {
              this.renderFromBot('Bạn đã hủy xóa tin nhắn');
              this.setState({deleteMessage: false});
            } else {
              this.isDeleleMessageBot();
            }
            //Update mssv MessageBot
          } else if (this.state.updateMSSV) {
            const isMssv = this.TryParseInt(mesageUser, 0);
            if (
              isMssv !== 0 &&
              isMssv !== null &&
              this.state.confirmUpdate === YES
            ) {
              if (isMssv.toString().length === 7) {
                this.updateMSSVBot(isMssv);
              } else {
                this.renderFromBot('MSSV phải 7 chữ số!');
              }
            } else {
              if (mesageUser === YES) {
                this.confrimIsUpdateMessageBot(mesageUser);
              } else if (mesageUser === NO) {
                this.renderFromBot('Bạn đã hủy cập nhật mssv');
                this.setState({updateMSSV: false});
              } else {
                this.isUpdateMessageBot();
              }
            }
          }else if(this.state.cancleCalendar){
            if(mesageUser === YES){
              this.renderFromBot("Bạn đã hủy xem lịch tkb");
              resetStateCalendar();
              this.setState({cancleCalendar:false});
            }else if(mesageUser === NO){
              this.setState({cancleCalendar:false});
                this.setState({checkNumberMssvError:0});
             
            }else{
              this.renderFromBot("Bạn có muốn hủy xem lịch tkb?",true);
            }
      
                 
          } else if(this.state.specifySchedule){
                     
            if(mesageUser === OK ){
              sendCalendarToServer(this.state.mssv,this.state.dataSpecifySchedule);
            }else if(mesageUser === OTHERMSSV){        
                     if(this.state.isInputMssv){
                      otherMSSVFromCalendar(mesageUser);
                     }else{
                      this.renderFromBot("Bạn hãy nhập mssv");
                      this.setState({isInputMssv:true});
                     }   
            }   
            else if(mesageUser === CANCEL){
              this.renderFromBot("Bạn đã hủy xem lịch tkb");
              resetStateCalendar();
            }else{
              otherMSSVFromCalendar(mesageUser);
            }   
                 
          } else {
            if (mesageUser.includes('xoá') || mesageUser.includes('xóa')) {
              this.isDeleleMessageBot();
              this.confrimIsDeleteMessageBot(mesageUser);
              return {mine: state.mine, text: mesageUser};
            }

            if (
              mesageUser === 'cập nhật' ||
              (mesageUser.includes('cập nhật') &&
                mesageUser.includes('mssv')) ||
              (mesageUser.includes('cập nhật') &&
                mesageUser.includes('mã số sinh viên'))
            ) {
              this.isUpdateMessageBot();
              this.confrimIsUpdateMessageBot(mesageUser);
              return {mine: state.mine, text: mesageUser};
            }

            const isMssv = this.TryParseInt(mesageUser, 0);
            //check Ismssv exist
            if (isMssv !== 0 && isMssv !== null) {
              if (isMssv.toString().length === 7) {
                this.provideMssv(isMssv);
              } else {
                this.renderFromBot('MSSV phải 7 chữ số!');
              }
              return {mine: state.mine, text: mesageUser};
            }
            // check is mssv contain in string
            const matches = mesageUser.match(/\d+/g);
            if (matches != null) {
              this.processText(mesageUser);
            } else {
              this.SendScheduleBot(mesageUser);
            }
          }
        }
        return {mine: state.mine, text: mesageUser};
      }
      return {mine: state.mine, text: state.text};
    };
 const sendSpecifySchedule = (messFromUser)=>{
    const data = messFromUser.textCalendar;
   getMSSVDataStorage().then(kq => {
    const existMssv = checkExistMssv(kq);
    if (existMssv === null) {
      this.renderFromBot(
        "Bạn phải cung cấp MSSV trước khi xem thời khóa biểu(vd:1812866)!\nNhập 'trợ giúp' để được hỗ trợ",
      );
    }else {
      if (this.socket.connected) {    
      
          const confirmString = `Xem ${data.toLocaleLowerCase()} với mssv ${existMssv}` ;
          this.setState({specifySchedule:true});
          this.setState({mssv:existMssv})
          this.setState({dataSpecifySchedule:messFromUser.data});
          this.renderFromSpecifyBot(confirmString,true);       
      } else {
        Toast.show('Bot dlu không thể kết nối tới máy chủ', Toast.LONG);
      }
    }
  });
 }
 const sendCalendarToServer = (mssv , data) =>{
   
  if (this.socket.connected) {
    this.socket.emit('scheduleWeek', {
      mssv: mssv,
      dataCalendar:data
    });
    resetStateCalendar();
  } else {
    Toast.show('Bot dlu không thể kết nối tới máy chủ', Toast.LONG);
  }
 }

  const resetStateCalendar = () =>{
    this.setState({mssv:""});
    this.setState({otherMSSVFromCalendar:false});
    this.setState({dataSpecifySchedule:{}});
    this.setState({specifySchedule:false});
  }

 const otherMSSVFromCalendar =(numberMSSV) =>{
    this.setState({checkNumberMssvError:this.state.checkNumberMssvError+1});
       if(this.state.checkNumberMssvError >3){
                 this.setState({cancleCalendar:true});
                 this.renderFromBot("Bạn có muốn hủy xem lịch tkb?",true);
           }else{

                let isnum = /^\d+$/.test(numberMSSV);
                if(isnum){
                  if(numberMSSV.length === 7){
                   this.setState({mssv:numberMSSV});
                   this.socket.emit('scheduleWeek', {
                    mssv: numberMSSV,
                    dataCalendar: this.state.dataSpecifySchedule
                  });
                  this.setState({isInputMssv:false});               
                  resetStateCalendar();
                  }else{
                   this.renderFromBot('MSSV phải 7 chữ số!');
                 }     
                }else{
                   this.renderFromBot("Bạn chỉ được nhập số");
                }
               }
 }
    const displaysReducer = (state = show, action) => {
      if (action.type === 'SHOW') {
        return {display: (state.display = 'flex')};
      }
      if (action.type === 'NONE') {
        return {display: (state.display = 'none')};
      }
      return state;
    };

    const SendMesCalendar={mine:true, data:{dayName:'ds',week:'',month:'',year:''},textCalendar:''};

    const messCalendarReducer = (state = SendMesCalendar, action) =>{
      if(action.type ==='SEND_CALENDAR'){
     //   sendSpecifySchedule(state);
        return state;
      } 
        return state;
    }
    const reducer = combineReducers({
      displaysReducer,
      sendMessageReducer,
      confirmMessageReducer,
      hintMessageReducer,
      initHintMessageReducer,
      vocieMessageReducer,
      messCalendarReducer
    });

    const store = createStore(reducer);

    store.subscribe(  () => {
      const empty = '';
      const voiceMess = store.getState().vocieMessageReducer.text;
      if (voiceMess !== '') {
        sendMessageReducer(
          {mine: true, text: voiceMess},
          {type: 'SEND_MESSAGE'},
        );
      }
      store.getState().vocieMessageReducer.text = empty;
     
      const calendarMess = store.getState().messCalendarReducer; 
      if(calendarMess.textCalendar !== ""){
        sendSpecifySchedule(calendarMess);
        store.getState().messCalendarReducer.textCalendar = empty;
      }
     
    });

    let renderMessage = this.state.arrMessage.map((item, key) => {
      if (item.mine) {
        return <MessageBubble key={key} mine text={item.text} />;
      } else if (!item.mine && item.Confirm) {
        return <ConfirmBot key={key} not_mine text={item.text} />;
      }
      else if (!item.mine && item.specifySchedule) {
        return <SpecifyScheduleBot key={key} not_mine text={item.text} />;
      }
      else if(Array.isArray(item)){
         return <ScheduleTabViewComponent key={key} not_mine schedules={item} />
      }  
      return <MessageBubble key={key} not_mine text={item.text} />;
    });

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.textHeader}>Bot Dlu</Text>
            <View style={styles.ViewOnline}>
              <Icon name="circle" size={10} color="#A0DEAC" />
              <Text style={styles.textOnline}>Online</Text>
            </View>
          </View>
          <View style={styles.body}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
              ref={ref => {
                this.scrollView = ref;
              }}
              onContentSizeChange={() =>
                this.scrollView.scrollToEnd({animated: true})
              }>
              {
              renderMessage
              }
            </ScrollView>
          </View>
          <View style={styles.flatList}>
            <FlatListHintMessage />
          </View>
          <View style={styles.footer}>
            <KeyboardAvoidingView
              style={styles.voidingView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'undefined'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
              <CalendarComponent/>
              <Input />
              <Send />
            </KeyboardAvoidingView>
          </View>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  voidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  footer: {
    height: responsiveHeight(10),
    backgroundColor: '#1D1F2C',
  },
  header: {
    height: responsiveHeight(15),
    backgroundColor: '#1D1F2C',
    alignItems: 'center',
  },
  body: {
    flex: 6,
    backgroundColor: '#1D1F2C',
  },
  scrollView: {
    marginHorizontal: 10,
  },
  textHeader: {
    color: 'white',
    fontSize: 20,
    marginTop: 25,
  },
  ViewOnline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textOnline: {
    color: '#777980',
    fontSize: 14,
    left: 2,
    position: 'relative',
  },
  hintText: {
    color: '#777980',
    fontSize: 14,
    position: 'relative',
    justifyContent: 'center',
  },
  flatList: {
    backgroundColor: '#1D1F2C',
  },
});

export default MessageBot;
