<script setup lang='ts'>
import { ref, inject, h } from 'vue';
import { Server } from '@/stores/server.ts';
import { useLinkStore } from '@/stores/link.ts';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { setTitleBar } from '@t/symbol';

const linkStore = useLinkStore()
const router = useRouter()

let linkId = ref("")
const setTitle = inject(setTitleBar)
if (setTitle) {
  setTitle(h('span', '群聊'))
}
async function link() {
  await linkStore.linkto(linkId.value, (id) => {
    router.push(`/room/${id}`)
    ElMessage("等待页面加载")
  }, () => { }, true)
}

function newServer() {
  const wattingReadyMsg = ElMessage({
    message: "等待服务程序启动",
    duration: 0
  })
  new Server(async (id) => {
    wattingReadyMsg.close()
    stop()
    await linkStore.linkto(id, () => {
      router.push(`/room/${id}`)
      ElMessage("等待页面加载")
    }, () => { alert("no") }, true)
  }, {})
}

</script>

<template>
  <el-main>
    <el-input type="text" placeholder="id" v-model="linkId" spellcheck="false" class="mb-1"></el-input>
    <el-button @click="link" class="w-full md:w-1/4 mt-2">加入</el-button>
    <el-divider class="!mb-4 !mt-4" />
    <el-button @click="newServer" class="w-full md:w-1/4">创建</el-button>
  </el-main>
</template>@/stores/server