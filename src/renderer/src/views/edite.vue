<template>
  <div>
    <router-link to="/" class="my-4 block">
      <SvgIcon class="rotate-180" name="arrow-right-circle"></SvgIcon>
    </router-link>
    <Calendar ref="calendar"  backgroundText class-name="select-mode" language="cn" @onSelect="select" :lunar="lunar"
      begin="1900-1-1" />
    <div class="flex justify-center mt-5">
      <div v-if="id" class="btn btn-success" @click="edite">修改</div>
      <button v-else @click="add" class="btn btn-success">新增加</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Calendar from 'mpvue-calendar'
import lunar from 'mpvue-calendar/dist/lunar'
import { nanoid } from 'nanoid'
import SvgIcon from '../components/SvgIcon.vue'
import { useRoute, useRouter } from 'vue-router'

import router from '../router'

const calendar = ref('')
const anniversary = ref('')
const selectDate = ref('')
const id = ref('')
const route = useRoute()

onMounted(() => {
  id.value = route.params.id
  if (id.value) {
    getVal(id.value)
  }
})

function select(date) {
  selectDate.value = date
}

function edite() {
  const [year, month, day] = selectDate.value.split('-')
  const { lYear, IMonthCn, IDayCn } = lunar.solar2lunar(year, month, day)
  window.api.electronStoreEdite(id.value, {
    id: id.value,
    date: selectDate.value,
    title: anniversary.value?.title,
    ldate: `${lYear} ${IMonthCn} ${IDayCn}`
  })
}

async function add() {
  const [year, month, day] = selectDate.value.split('-')
  const { lYear, IMonthCn, IDayCn } = lunar.solar2lunar(year, month, day)
  const id = nanoid(10)
  await window.api.electronStoreAdd(id, {
    id,
    date: selectDate.value,
    title: anniversary.value?.title,
    ldate: `${lYear} ${IMonthCn} ${IDayCn}`
  })

  // 跳转到首页
  router.push('/')
}

async function getVal(id) {
  const Obj = await window.api.electronStoreGet(id)
  anniversary.value = Obj
  const [year, month, day] = anniversary.value.date.split('-')
  calendar.value.render(year, month, day)
}
</script>

<style lang="scss" scoped>

</style>
