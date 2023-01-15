import dayjs from 'dayjs'

// 两个日期相距天数
export function diffDay(date) {
  return +dayjs(dayjs().format('MM-DD')).diff(dayjs(date).format('MM-DD'), 'day')
}
