<template>
  <div class="mx-6">
    <div class="flex justify-end">
      <router-link to="/edite">
        <SvgIcon name="plus-circle"></SvgIcon>
      </router-link>
    </div>

    <div v-for="(item, index) in obj.anniversary" @click="to(item.id)" class="cursor-pointer ">
      <div :key="index" class="py-2 flex justify-between items-center">
        <!-- 进度条 -->
        <div class="radial-progress text-primary" :style="{ '--value': +(1 - item.remainingDays / 375) }">
          {{((1 - item.remainingDays / 375) * 100).toFixed(2)}}%
        </div>
        <div class="flex-1">
          <div class="title">{{ item.title }}</div>
          <div class="date">农历时间：{{ item.date }}</div>
          <div class="date">公历时间:{{ item.ldate }}</div>
          <div class="date">剩余时间:{{ item.remainingDays }}天</div>
        </div>
        <SvgIcon name="arrow-right-circle"></SvgIcon>
      </div>
      <!-- 分割线 -->
      <div class="divider"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from 'vue-router'
import { diffDay } from '../../../utiles/index'
import SvgIcon from '../components/SvgIcon.vue'
const router = useRouter()


const obj = reactive({
  anniversary: {}
});

onMounted(async () => {
  const anniversary = await window.api.electronStoreGetAll();
  obj.anniversary = Object.values(anniversary).map((item) => {
    return {
      ...item,
      remainingDays: diffDay(item.date),
    }
  });
});

function to(id) {
  router.push({
    path: "edite",
    params: {
      id
    }
  })
}
</script>

<style lang="scss" scoped>

</style>
