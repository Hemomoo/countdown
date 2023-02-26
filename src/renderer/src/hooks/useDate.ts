import { ref, computed,watch } from "vue";
import { isHaveValue } from '../../../utiles/common';
import type { PickerProps } from "../types";
import { lunarToSolar } from "../../../utiles/index"

// import {Lunar,LunarMonth} from 'lunar-typescript';
const {Solar, Lunar, LunarMonth} = require('lunar-javascript')


export default (isDate: boolean,isLunar:boolean) => {
  if (!isDate) return {};
  const START_YEAR = 1920;
  const END_YEAR = 2050;
  const date = new Date();
  const defaultYear:any = date.getFullYear();
  const defaultMonth:any = date.getMonth() + 1;
  const defaultDay = date.getDate();
  const selectYear = ref(defaultYear);
  const selectMonth = ref(defaultMonth);
  const lunarDayss = [
    '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
    '十-','十二','十三','十四','十五','十六','十七','十八','十九','二十',
    '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
]
  const lunarMonthss = ['正','二','三','四','五','六','七','八','九','十','冬','腊']

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
  "9": "九"
}

  const yearList = generateList(START_YEAR, END_YEAR,'year');
  const monthList = generateList(1, 12,'month');
  const dayList = computed(() => {
    // 如果不是农历
    if(!isLunar){
      const thirty = [4, 6, 9, 11];
      const thirtyOne = [1, 3, 5, 7, 8, 10, 12];
      const days = thirty.includes(selectMonth.value)
        ? 30
        : thirtyOne.includes(selectMonth.value)
          ? 31
          : isLeapYear(selectYear.value) ? 29 : 28;
      return generateList(1,days,'day')
    }else{
      console.log('LunarMonth.fromYm(selectYear.value, selectMonth.value): ', LunarMonth.fromYm(2023, 2).getDayCount());

      // const days = LunarMonth.fromYm(selectYear.value, selectMonth.value).getDayCount()
      return generateList(1,30,'day')
    }
  });



  const dateList = computed(() => {
    return [yearList, monthList, dayList.value];
  });


  function isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  function generateList(start: number, end: number,type:string,) {
    let result: Array<number|string> = [];
    for (let index = start; index <= end; index++) {
      result.push(index);
    }
    // 农历转换
    if(isLunar){
      if(type === 'day'){
        if(result.length>lunarDayss.length){
          result = lunarDayss
        }else{
          result = lunarDayss.slice(0,result.length-1)
        }
      }
      if(type==='month'){
        result = result.map((item,index)=>lunarMonthss[index])
        console.log('result: ', result);
      }

      if(type==='year'){
        result = result.map((item=>{
          return `${zh[item.toString()[0]]}${zh[item.toString()[1]]}${zh[item.toString()[2]]}${zh[item.toString()[3]]}`
        }))
      }
    }
    return result;
  }

  function getDateAnchors(anchor: PickerProps['anchor']) {
    const anchors = isHaveValue(anchor) ? anchor : [defaultYear, defaultMonth, defaultDay];
    return anchors.map((target, index) => {
      const pos = dateList.value[index].indexOf(target);
      return pos > -1 ? pos : 0;
    });
  }

  function updateDateSelect(pickerAnchors: Array<number>) {
    const [year, month] = pickerAnchors;
    selectYear.value = dateList.value[0][year];
    selectMonth.value = dateList.value[1][month];
  }

  return {
    selectYear,
    selectMonth,
    dateList,
    updateDateSelect,
    getDateAnchors,
  };
}
