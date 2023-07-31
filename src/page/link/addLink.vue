<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { useLinkStore } from '@/stores/link.ts';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import ClipboardJS from 'clipboard';
const LinkStore = useLinkStore()
const router = useRouter()
let linkId = ref("")
let myIdSpan = ref<HTMLSpanElement | null>(null)
onMounted(() => {
  if (myIdSpan.value) {
    new ClipboardJS(myIdSpan.value, {
      text: function () {
        return LinkStore.myId;
      }
    });
  }
})

function link() {
  let waiting = ElMessage({
    message: '等待对方同意连接',
    duration: 0
  })
  let waitingTimeout = setTimeout(() => {
    waiting.close()
    ElMessage.error('等待连接超时')
    endWaitingLink()
  }, 10000);
  let endWaitingLink = LinkStore.linkto(linkId.value, (id) => {
    waiting.close()
    ElMessage.success('对方同意了连接')
    router.push(`/link/${id}`)
    clearTimeout(waitingTimeout)
    ElMessage("等待页面加载")
  }, () => {
    waiting.close()
    ElMessage.error('对方拒绝了连接')
    clearTimeout(waitingTimeout)
  })

  LinkStore.peerObj.once("error", () => {
    waiting.close()
    ElMessage.error('连接失败')
    clearTimeout(waitingTimeout)
    endWaitingLink()
  })
}
</script>

<template>
  <el-container>
    <el-header class="grid content-center bg-[#FAFCFF]">
      <el-tooltip effect="light" content="点击复制" placement="bottom-start">
        <span ref="myIdSpan" class="text-sm md:text-[1rem]">
          你的id: {{ LinkStore.myId }}
        </span>
      </el-tooltip>
    </el-header>
    <el-main>
      <el-input type="text" placeholder="id" v-model="linkId" spellcheck="false" class="mb-1"></el-input>
      <el-button @click="link" class="w-full md:w-1/4">连接</el-button>
    </el-main>
  </el-container>
</template>
