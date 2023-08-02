<script setup lang='ts'>
import { ref } from 'vue';
import { Server, useRoomStore } from '@/stores/room.ts';
import { useLinkStore } from '@/stores/link.ts';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
const linkStore = useLinkStore()
const roomStore = useRoomStore()

const router = useRouter()
let linkId = ref("")

function link() {
  linkStore.linkto(linkId.value, (id) => {
    router.push(`/room/${id}`)
    ElMessage("等待页面加载")
  }, () => { },true)
}

function newServer() {
  const wattingReadyMsg = ElMessage({
    message: "等待服务程序启动",
    duration: 0
  })
  new Server((id) => {
    wattingReadyMsg.close()
    stop()
    linkStore.linkto(id, () => {
      router.push(`/room/${id}`)
      ElMessage("等待页面加载")
    }, () => { alert("no") }, true)
  }, roomStore)

}

</script>

<template>
  <el-container>
    <el-header class="grid content-center bg-[#FAFCFF]">
      <el-tooltip effect="light" content="点击复制" placement="bottom-start">
        <span ref="myIdSpan" class="text-sm md:text-[1rem]">
          群聊
        </span>
      </el-tooltip>
    </el-header>
    <el-main>
      <el-input type="text" placeholder="id" v-model="linkId" spellcheck="false" class="mb-1"></el-input>
      <el-button @click="link" class="w-full md:w-1/4 mt-2">加入</el-button>
      <el-divider class="!mb-4 !mt-4" />
      <el-button @click="newServer" class="w-full md:w-1/4">创建</el-button>
    </el-main>
  </el-container>
</template>