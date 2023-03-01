<template>
  <div>
    <div class="header  bg-primary w-full sticky  p-4 top-0 flex justify-between ">
      <router-link to="/" class="block">
        <SvgIcon class="rotate-180" name="arrow-right-circle"></SvgIcon>
      </router-link>
      <!-- 保存 -->
      <SvgIcon class="rotate-180 cursor-pointer" name="save" @click="save"></SvgIcon>
    </div>
    <!-- 农历和阴历切换 -->
    <div>
      <div class="btn-group btn-group-horizontal sm:btn-group-horizontal w-full">
        <button :class="['btn', { 'btn-active': isLunar }]" @click="switchType('lunar')">农历</button>
        <button :class="['btn', { 'btn-active': !isLunar }]" @click="switchType('solar')">阳历</button>
      </div>
    </div>



    <!-- 输入框 -->
    <Field v-model="countDownValue" placeholder="请输入倒数日名称"></Field>

    <!--  -->
    <Picker ref="picker" v-model:isShowPicker="isShowDate" v-model:anchor="currentDate" type="date" :key="isLunar"
      :isLunar="isLunar" @confirm="confirmDate" />

  </div>
</template>

<script setup>
import Picker from '../components/Picker.vue';
import SvgIcon from '../components/SvgIcon.vue'
import { ref, onMounted, nextTick, reactive,toRaw } from 'vue';
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { dayToArray, solarToLunar, lunarToSolar } from '../../../utiles/index'
import { Field, showToast } from 'vant';
import { useRouter } from 'vue-router';
const isShowDate = ref(false);
const currentDate = ref(dayToArray(dayjs()));
const selectDate = ref([])
const countDownValue = ref("")
const picker = ref('')
const calendarType = ref('solar') // 日历类型 农历 阳历
const commemorateType = ref('add') // 修改还是新增

const router = useRouter()

// 是不是农历
const isLunar = ref(false)
onMounted(() => {
  nextTick(() => {
    isShowDate.value = true
  })
})

function confirmDate(date) {
  console.log('date: ', date);
  selectDate.value = date
}

async function save() {
  if (countDownValue.value.trim() === '') {
    showToast('请输入倒数日名称');
    return
  }
  const [y, m, d] = selectDate.value
  const date = calendarType.value === 'lunar' ? lunarToSolar(selectDate.value) : selectDate.value;// 选择的时间
  const ldate = calendarType.value === 'solar' ? solarToLunar(new Date(y, m - 1, d)) : selectDate.value; // 阴历时间
  if (commemorateType.value === 'add') {
    const id = nanoid(10) // 生成id保证唯一
    await window.api.electronStoreAdd(id, {
      id,// id
      date: toRaw(date).join("-"), // 选择的时间
      title: countDownValue.value, // 倒计时时间
      calendarType: calendarType.value, // 判断是农历还是阳历
      ldate: toRaw(ldate).join("\xa0"), // 阴历时间 增加了一个空格 保证后面好切割
    })
  } else {
    // 修改
    await window.api.electronStoreEdite(id.value, {
      id: id.value,
      date: toRaw(date).join("-"), // 选择的时间
      title: countDownValue.value, // 倒计时时间
      calendarType: calendarType.value, // 判断是农历还是阳历
      ldate: toRaw(ldate).join("\xa0"), // 阴历时间
    })
  }
  router.push('/')
}

// 切换农历与阳历
function switchType(type) {

  // 切换日历的时候
  if (calendarType.value !== type) {
    calendarType.value = type
  } else {
    return
  }
  picker.value.confirm()
  if (type === 'lunar') {
    const [y, m, d] = selectDate.value
    isLunar.value = true
    isShowDate.value = false
    currentDate.value = solarToLunar(new Date(y, m - 1, d))
    nextTick(() => {
      isShowDate.value = true
    })
  } else {
    isLunar.value = false
    currentDate.value = lunarToSolar(selectDate.value)
    console.log('currentDate.value: ', currentDate.value);
    isShowDate.value = false
    nextTick(() => {
      isShowDate.value = true
    })
  }
}


</script>

<style  lang="scss"  scoped></style>
