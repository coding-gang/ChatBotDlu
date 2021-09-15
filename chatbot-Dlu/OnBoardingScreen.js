import React from "react";
import {Image} from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const OnboardingScreen = ({navigation})=>{
       
   return( <Onboarding onSkip={()=> navigation.navigate('MessageBot')}
                       onDone={()=> navigation.navigate('MessageBot')}
                       nextLabel ={"Tiếp tục"} skipLabel={"Bỏ qua"}
    pages={[
        {
        backgroundColor: '#fff',
        image: <Image style={{resizeMode: 'stretch', width:400,height:300}} source={require('./Assets/ChatbotWelcome.png')} />,
        title: 'Xin chào bạn',
        subtitle: 'Tôi là bot dlu giúp sinh viên Đại Học Đà Lạt xem thời khóa biểu',
        },
        {
        backgroundColor: '#1D1F2C',
        image: <Image  style={{resizeMode: 'stretch',width:300,height:300}} source={require('./Assets/7d8e80dfe0cabf2d7bc8548585d967a2.png')} />,
        title: 'Giới thiệu',
        subtitle: 'Ứng dụng giúp sinh viên dễ dàng, '+ 
                  'nhanh chóng, xem thời khóa biểu học hằng ngày bằng cách trò chuyện mọi lúc với ChatBot theo từ khóa '+
                  '(thời khóa biểu)',
        },
        {
        backgroundColor: '#5E56BD',
        image: <Image style={{resizeMode: 'stretch', width:300,height:300}} source={require('./Assets/34198cf5-a136-4e70-ad68-274f5b9b9404.png')} />,
        title: 'Hướng dẫn',
        subtitle: 'Để xem thời khóa biểu bạn hãy cung cấp mã số sinh viên cho Bot '+
                  'sau đó hỏi đáp Bot thông qua văn bản hoặc giọng nói'
        },
        {
        backgroundColor: '#fff',
        image:<Image  style={{resizeMode: 'stretch', width:200,height:200}} source={require('./Assets/botWC.png')} />,
        title: 'Chúc bạn trải nghiệm vui vẻ',
        subtitle: 'DALAT UNIVERSITY'
        }
    ]}
    />
   )
}
export default OnboardingScreen
