<template>
  <div>
    <div class="header flex justify-between bg-primary sticky p-4 top-0" @click="obj.menuShow = false">
      <router-link to="/edite">
        <SvgIcon name="plus-circle" color="#fff"></SvgIcon>
      </router-link>
      <div class="relative" @click.stop="obj.menuShow = true">
        <SvgIcon name="align-justify" color="#fff"></SvgIcon>
        <ul class="absolute right-0 w-30 h-52 bg-primary-focus rounded-md overflow-y-scroll" v-if="obj.menuShow">
          <template v-for="(theme, index) in obj.themes">
            <li class="text-white px-4 py-2  hover:bg-base-300  text-center cursor-pointer"
              @click="switchThemes(theme)">{{ theme }}</li>
          </template>
        </ul>
      </div>
    </div>

    <div class="w-full px-4">
      <div v-for="(item, index) in obj.anniversary" @click="to(item.id)" class="cursor-pointer ">
        <div :key="index" class="py-2 flex justify-between items-center" v-longpress:[item.id]="longpress">
          <!-- 进度条 -->
          <div class="radial-progress text-primary mr-2" :style="{ '--value': +(1 - item.remainingDays / 375) * 100 }">
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



    <!-- 弹窗 -->
    <div class="modal" :class="{ 'modal-open': obj.modalShow }">
      <div class="modal-box relative">
        <label @click="obj.modalShow = false" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 class="text-lg font-bold text-center">确定要删除吗?</h3>
        <p class="py-2 text-center">确定要删除这个纪念日吗！！！</p>
        <div @click="del"
          class="mx-auto  cursor-pointer mt-4 rounded-md p-1 text-white text-center w-32 bg-warning border-transparent">
          删除
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { async } from "postcss-js";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from 'vue-router'
import { diffDay } from '../../../utiles/index'
import SvgIcon from '../components/SvgIcon.vue'
const router = useRouter()

const selectItemId = ref('')

const obj = reactive({
  anniversary: [],
  menuShow: false,
  modalShow: false,
  themes: ['light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter'
  ]
});

onMounted(async () => {
  await getAll()
});


async function getAll(){
  const anniversary = await window.api.electronStoreGetAll();
  console.log('anniversary: ', anniversary);
  obj.anniversary = Object.values(anniversary).map((item) => {
    return {
      ...item,
      remainingDays: diffDay(item.date),
    }
  });
}



function switchThemes(theme) {
  document.getElementsByTagName("html")[0].setAttribute('data-theme', theme)
}

function longpress(id) {
  selectItemId.value = id
  obj.modalShow = true
}

async function del() {
   await window.api.electronStoreDel(selectItemId.value)
   obj.modalShow = false
   getAll()
}


function to(id) {
  console.log('id: ', id);
  router.push({
    path: 'edite',
    query: {
      id
    }
  })
}
</script>

<style lang="scss" scoped>

</style>
