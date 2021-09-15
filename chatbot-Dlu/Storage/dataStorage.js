import AsyncStorage from "@react-native-async-storage/async-storage"; 
const DATA ="data";
const MSSV ="mssv";

 export  function getDataStorage (){
    const data = AsyncStorage.multiGet([DATA]);
     return data;
 }

export async function setDataStorage(arrMessage){
    let item = [DATA,JSON.stringify(arrMessage)];
           await AsyncStorage.multiSet([item]);
 }

 export function removeDataStorage(){
    AsyncStorage.removeItem(DATA);
  }


export function getMSSVDataStorage(){
    const mssv = AsyncStorage.multiGet([MSSV]);
     return mssv;
   }

export async function setMSSVDataStorage(mssv){
  let value = [MSSV,JSON.stringify(mssv)];
         await AsyncStorage.multiSet([value]);
}

export function removeMSSVStorage(){
    AsyncStorage.removeItem(MSSV);
  }


export function checkExistMssv(mssv,isUpdate){
   if(mssv !== null){
      let value =null;
     mssv.map((result,i,store)=>{   
        if (store[i][1] !== null && isUpdate == true){     
        removeMSSVStorage();
        }else{
         value =store[i][1]; 
        }
     })
     return value;
    }
     return null;       
  }