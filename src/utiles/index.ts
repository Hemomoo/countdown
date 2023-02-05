import { current } from 'daisyui/src/colors';
import dayjs from 'dayjs'
import toArray from 'dayjs/plugin/toArray'
import {Lunar,LunarMonth, Solar} from 'lunar-typescript';

dayjs.extend(toArray)


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
export function diffDay(date) {
  return +dayjs(dayjs().format('MM-DD')).diff(dayjs(date).format('MM-DD'), 'day')
}

// 日期转位数组
export function dayToArray(date:any){
  const [y,m,d] = dayjs(date).toArray()
  return  [y,m+1,d]
}

// 阳历转阴历
export function  solarToLunar(date:any){
  console.log('date: ', date);
   const d = Lunar.fromDate(date);
   const cd = d.getDayInChinese()
   const cm = d.getMonthInChinese()
   const cy = d.getYearInChinese()
   console.log('[`${cy}`,`${cm}`,cd]: ', [`${cy}`,`${cm}`,cd]);
   return [`${cy}`,`${cm}`,cd]
}


// 阴历中文日期转数字转阳历
export function lunarToSolar(date:Array<any>){
  console.log('date: ', date);
     const ny = + date[0].split("").reduce((total,current)=>{
        return `${total}` + Array.from(zh).findIndex( (item)=>item === current)
      },'')
      console.log('ny: ', ny);

      const nm =lunarMonths.findIndex((item)=>item === date[1])+1
      console.log('nm: ', nm);
      const nd =lunarDays.findIndex((item)=>item === date[2])+1
      console.log('nd: ', nd);
      console.log('Lunar.fromYmd(ny,nm,nd): ',dayjs(Lunar.fromYmd(ny,nm,nd).getSolar().toString()).format("YYYY-M-D"));

      // 转阳历
      return  dayjs(Lunar.fromYmd(ny,nm,nd).getSolar().toString()).format("YYYY-M-D").split("-").map(item=>Number(item))

}

