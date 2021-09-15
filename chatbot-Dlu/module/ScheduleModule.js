import { Schedule } from "../entities/Schedule";
import { ScheduleComponent } from "../entities/ScheduleComponent";

   const HAS_SCHEDULE=  1 ;
   const NO_SCHEDULE=  0 ;
   const MONRING = "sáng";
   const AFTERNOON ="chiều";
   const EVENING ="Tối";
   const NO_CLASS ="không có tiết";
   
export function renderSchedule(data) {

        const [, ...filterData] = [...data];
        const arrMessage = [];
        let messageBot =""; 

        for (const [key, value] of Object.entries(filterData)) {
        
        const { 0: thu, ...rest } = value;
        const schedule = new Schedule();
        
        for (const [key, value] of Object.entries(rest)) {
        
        const noon = key.toLocaleLowerCase();
        const scheduleComponent  = filterTitle(value);
        const isSchedule = hasShedule(scheduleComponent); 
        initNoon(schedule, isSchedule , thu, scheduleComponent, noon);        
        }
        const messageMonning = schedule.thu +":\n"+"Sáng: ";
              if(schedule.emptyMorning !== NO_CLASS){
                for(const morning of schedule.morning){
                  const scheduleMorning = 
                  "\n-Môn: " + morning.mon+"\n"+
                  "-Nhóm: "+ morning.nhom+"\n"+
                  "-Tiết: "+ morning.tiet+"\n"+
                  "-Phòng: "+ morning.phong+"\n"+
                  "-GV: "+ morning.gv+"\n"+
                  "-Đã học: "+ morning.dahoc+"\n";
                  
                  messageMonning += scheduleMorning;
                } 
               }else{
                messageMonning +=schedule.emptyMorning+"\n"
               }                          
          
        const messageBotAfternoon = "Chiều: ";
        if(schedule.emptyAfternoon !==NO_CLASS){
          for(const afternoon of schedule.afternoon){
            const scheduleAfterNoon = 
            "\n-Môn: " + afternoon.mon+"\n"+
            "-Nhóm: "+ afternoon.nhom+"\n"+
            "-Tiết: "+ afternoon.tiet+"\n"+
            "-Phòng: "+ afternoon.phong+"\n"+
            "-GV: "+ afternoon.gv+"\n"+
            "-Đã học: "+ afternoon.dahoc+"\n"
            messageBotAfternoon += scheduleAfterNoon;
          }
        }else{
          messageBotAfternoon +=schedule.emptyAfternoon+"\n";
        }
        const messageBotEvening = "Tối: ";
              if(schedule.emptyEveningNoon !==NO_CLASS){
                for(const evening of schedule.evening){
                  const scheduleEvening = 
                  "\n-Môn: " + evening.mon+"\n"+
                  "-Nhóm: "+ evening.nhom+"\n"+
                  "-Tiết: "+ evening.tiet+"\n"+
                  "-Phòng: "+ evening.phong+"\n"+
                  "-GV: "+ evening.gv+"\n"+
                  "-Đã học: "+ evening.dahoc+"\n";          
                messageBotEvening += scheduleEvening;
                }
              }else{
                messageBotEvening +=schedule.emptyEveningNoon+"\n";
              }
            messageBot = messageMonning + messageBotAfternoon + messageBotEvening;
    
        const scheduleMess = { mine: false, text: messageBot };  
        arrMessage.push(scheduleMess);
        }
        return arrMessage;
      }
     function hasShedule(schedule){
        if (Array.isArray(schedule)) {
                  return HAS_SCHEDULE;
        }else{
          return NO_SCHEDULE;
        }
         
     }
      function initNoon(schedule, flag, thu, scheduleComponent, noon) {
        switch (flag) {
          case NO_SCHEDULE: {
              schedule.setThu(thu);
            if (noon === MONRING) {
              schedule.displayMorningNoon(scheduleComponent);
            } else if (noon === AFTERNOON) {
              schedule.displayAfternoonNoon(scheduleComponent);
            } else {
              schedule.displayEveningNoon(scheduleComponent);
            }
            break;
          }
          case HAS_SCHEDULE: {
              schedule.setThu(thu);
            if (noon === MONRING) {
              schedule.setMorning(scheduleComponent);
            } else if (noon === AFTERNOON) {
              schedule.setAfternoon(scheduleComponent);
            } else {
              schedule.setEvening(scheduleComponent);
            }
            break;
          }
        }
      }
      
      function repalceTitleToComma(value){

        const filter = /-Môn: |-Nhóm: |-Lớp: |-Tiết: |-Phòng: |-GV: |-Đã học: /gi;
        const strFilter = value.replace(filter, function (x) {
            return (x = ",");

          });
         return strFilter; 
      }
      function filterTitle(value) {
        let strFilter;
        let scheduleArr = [];
        if (value !== "") { 
        const scheduleNoon =  value.split("   ");         
              for(const item of scheduleNoon){           
                if (item.includes("-Nhóm: ")) {
                  strFilter = repalceTitleToComma(item);
                const  scheduleComponent= initSchedule(strFilter);
                scheduleArr.push(scheduleComponent);    
               }
               else {
                  strFilter = repalceTitleToComma(item);
                  const  scheduleComponent= initSchedule(strFilter);
                  scheduleArr.push(scheduleComponent);
                }
              }     
             return scheduleArr;
            }
            else{
                strFilter = NO_CLASS;
            }
            return strFilter;
        }
   

     function initSchedule(scheduleFilter) {
     
        const items = scheduleFilter.split(",");
        // ScheduleComponent(mon,lop,tiet,phong,gv,dahoc,nhom = "");
        if (items.length >= 8) {
          
          const scheduleComponent = new ScheduleComponent(
            items[1],
            items[3],
            items[4],
            items[5],
            items[6],
            items[7],
            items[2]
          );
          return scheduleComponent;
        } else {
          const scheduleComponent = new ScheduleComponent(
            items[1],
            items[2],
            items[3],
            items[4],
            items[5],
            items[6]
          );
          return scheduleComponent;
        }
      }