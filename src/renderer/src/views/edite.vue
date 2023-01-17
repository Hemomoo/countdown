<template>
  <div class="flex flex-col items-center">
    <div class="header  bg-primary w-full sticky  p-4 top-0 flex justify-between">
      <router-link to="/" class="block">
        <SvgIcon class="rotate-180" name="arrow-right-circle"></SvgIcon>
      </router-link>
      <!-- 保存 -->
      <SvgIcon class="rotate-180" name="save" @click="save"></SvgIcon>
    </div>

    <!-- 标题 -->
    <div class="m-4 flex justify-start">
      <input type="text" placeholder="请输入标题" v-model="title" class="input w-full max-w-xs input-sm input-bordered" />
    </div>

    <!-- 日历 -->
    <Calendar ref="calendar" backgroundText class-name="select-mode" language="cn" @onSelect="select" :lunar="lunar"
      begin="1900-1-1" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Calendar from 'mpvue-calendar'
import lunar from 'mpvue-calendar/dist/lunar'
import { nanoid } from 'nanoid'
import SvgIcon from '../components/SvgIcon.vue'
import { useRoute, useRouter } from 'vue-router'


const calendar = ref('')
const anniversary = ref('')
const selectDate = ref('')
const id = ref('')
const title = ref("")
const commemorateType = ref("add") // add 增加  edit 修改
const route = useRoute()
const router = useRouter()

onMounted(() => {
  id.value = route.query.id
  console.log(' route.params.id: ',  route.query.id);
  commemorateType.value = id.value ? 'edit' : 'add'
  if (id.value) {
    getVal(id.value)
  }
})

function select(date) {
  selectDate.value = date
}

async function save() {
  const [year, month, day] = selectDate.value.split('-')
  const { lYear, IMonthCn, IDayCn } = lunar.solar2lunar(year, month, day)
  if(!title.value){
    alert("错误")
    return
  }

  if(!selectDate.value){
    alert("错误")
    return
  }
  console.log('commemorateType: ', commemorateType);
  if (commemorateType.value === 'add') {
    const id = nanoid(10)
    await window.api.electronStoreAdd(id, {
      id,
      date: selectDate.value,
      title: title.value,
      ldate: `${lYear} ${IMonthCn} ${IDayCn}`
    })
    router.push('/')
  } else {
    await window.api.electronStoreEdite(id.value, {
      id: id.value,
      date: selectDate.value,
      title: title.value,
      ldate: `${lYear} ${IMonthCn} ${IDayCn}`
    })
    router.push('/')
  }
}
async function getVal(id) {
  console.log('id: ', id);
  const obj = await window.api.electronStoreGet(id)
  console.log('obj: ', obj);
  anniversary.value = obj
  const [year, month, day] = anniversary.value.date.split('-')
  calendar.value.render(year, month, day)
  selectDate.value = obj.date
  title.value = obj.title
}
</script>

<style lang="scss" scoped>

</style>
