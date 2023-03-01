// import { current } from 'daisyui/src/colors';
import dayjs from 'dayjs'
import toArray from 'dayjs/plugin/toArray'
var _ = require('lodash');

const {Solar, Lunar, HolidayUtil} = require('lunar-javascript')
dayjs.extend(toArray)

// import {Lunar,LunarMonth, Solar} from 'lunar-typescript';

// const {Solar,Lunar} = require('lunar.js')




const lunarDays = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十-','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
]
const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊']

const zh =
{"0": "〇",
"1": "一",
"2": "二",
"3": "三",
"4": "四",
"5": "五",
"6": "六",
"7": "七",
"8": "八",
"9": "九",
length:10
}


// 两个日期相距天数
export function diffDay(calendarType,date) {
  console.log('date: ', date);
  // 阴历
  if(calendarType==='lunar'){
    // 获取当前阴历年,
    const lunarYear =new Date().toLocaleString('zh-Hans-u-ca-chinese').slice(0,4)
    // console.log('currentData: ', currentData.slice(0,4));
    let dateCopy = _.cloneDeep(date)
    let dateArra = dateCopy.split("\xa0")
    dateArra.splice(0,1, numberToChinese(lunarYear) )
    const [year,month,day] =  lunarToSolar(dateArra) as Array<number>
    return +dayjs(dayjs().format('YYYY-MM-DD')).diff(dayjs([year,month-1,day].join()).format('YYYY-MM-DD'), 'day')
  }else{
    return +dayjs(dayjs().format('MM-DD')).diff(dayjs(date).format('MM-DD'), 'day')
  }
}

// 日期转位数组
export function dayToArray(date:any){
  const [y,m,d] = dayjs(date).toArray()
  return  [y,m+1,d]
}

// 数字转中文
export function numberToChinese(val:string|number){
  return  val.toString().split("").reduce((total,current)=>{
      return `${total}` + zh[current]
    },'')
}

// 阳历转阴历
export function  solarToLunar(date:any){
   const d = Lunar.fromDate(date);
   const cd = d.getDayInChinese()
   const cm = d.getMonthInChinese()
   const cy = d.getYearInChinese()
   console.log('[`${cy}`,`${cm}`,cd]: ', [`${cy}`,`${cm}`,cd]);
   return [`${cy}`,`${cm}`,cd]
}


// 阴历中文日期转数字转阳历
export function lunarToSolar(date:Array<string>){
  // console.log('date: ', date);
     const ny = + date[0].split("").reduce((total,current)=>{
        return `${total}` + Array.from(zh).findIndex( (item)=>item === current)
      },'')
      let arrLength = date.length
      if(arrLength===1){
        return ny
      }else if(arrLength===2){
        const nm =lunarMonths.findIndex((item)=>item === date[1])+1
        return  dayjs(Lunar.fromYmd(ny,nm).getSolar().toString()).format("YYYY-M").split("-").map(item=>Number(item))
      }else{
        const nm =lunarMonths.findIndex((item)=>item === date[1])+1
        const nd =lunarDays.findIndex((item)=>item === date[2])+1
        return  dayjs(Lunar.fromYmd(ny,nm,nd).getSolar().toString()).format("YYYY-M-D").split("-").map(item=>Number(item))
      }
}

