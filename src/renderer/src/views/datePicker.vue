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

    <div class="tabs tabs-boxed bg-white">
      <a :class="['tab',{'tab-active':isLunar}]" @click="switchType('lunar')">农历</a>
      <a :class="['tab',{'tab-active':!isLunar}]" @click="switchType('solar')">阳历</a>
    </div>
    <Picker
    ref="picker"
    v-model:isShowPicker="isShowDate"
    v-model:anchor="currentDate"
    type="date"
    :key="isLunar"
    :isLunar="isLunar"
    :options="{ titleText: '' }"
    @confirm="confirmDate"
  />

  </div>
</template>

<script setup>
import  Picker  from '../components/Picker.vue';
import SvgIcon from '../components/SvgIcon.vue'
import { ref,onMounted,nextTick,reactive } from 'vue';
import dayjs from 'dayjs'
import { dayToArray,solarToLunar,lunarToSolar } from '../../../utiles/index'
const isShowDate = ref(false);
const currentDate = ref(dayToArray(dayjs()));
const selectDate = ref([])
const picker = ref('')

// 是不是农历
const isLunar = ref(false)
 onMounted(() => {
    nextTick(()=>{
      isShowDate.value = true
    })
})

function confirmDate(date){
  console.log('date:>>>>> ', date);
  selectDate.value = date

}

function save(){

}

function switchType(type){
  picker.value.confirm()
  if(type==='lunar'){
     const [ y,m,d ] = selectDate.value
     console.log('selectDate.value: ', selectDate.value);
     isLunar.value = true
     isShowDate.value = false
     currentDate.value = solarToLunar(new Date(y,m-1,d))
     nextTick(()=>{
      isShowDate.value = true
     })
  }else{
     isLunar.value = false
     currentDate.value = lunarToSolar(selectDate.value)
     console.log('currentDate.value: ', currentDate.value);
     isShowDate.value = false
     nextTick(()=>{
       isShowDate.value = true
     })
  }
}


</script>

<style  lang="scss"  scoped>

</style>
