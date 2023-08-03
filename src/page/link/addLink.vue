<script setup lang='tsx'>
import { ref, onMounted, inject, watch } from 'vue';
import { useLinkStore } from '@/stores/link.ts';
import ClipboardJS from 'clipboard';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { setTitleBar } from '@t/symbol';
import { storeToRefs } from 'pinia';
const router = useRouter()
const linkStore = useLinkStore()
const linkStoreRef = storeToRefs(linkStore)
let linkId = ref("")
onMounted(() => {
  const setTitle = inject(setTitleBar)
  watch(linkStoreRef.myId, (v) => {
    if (setTitle) {
      setTitle(<el-tooltip effect="light" content="点击复制" placement="bottom-start">
        <span class="text-sm md:text-[1rem]" onClick={(e) => {
          const el = e.target as HTMLSpanElement
          new ClipboardJS(el, {
            text: function () {
              return linkStore.myId;
            }
          });
          el.click()
        }}>
          你的id: {v}
        </span>
      </el-tooltip>)
    }
  }, { immediate: true })

})
async function link() {
  let waiting = ElMessage({
    message: '等待对方同意连接',
    duration: 0
  })
  let waitingTimeout = setTimeout(() => {
    ElMessage.error('等待连接超时')
    endWite()
  }, 10000);
  let endWaitingLink = await linkStore.linkto(linkId.value, (id) => {
    ElMessage.success('对方同意了连接')
    ElMessage("等待页面加载")
    router.push(`/link/${id}`)
    waiting.close()
    clearTimeout(waitingTimeout)
  }, () => {
    ElMessage.error('对方拒绝了连接')
    endWite()
  })

  linkStore.peerObj.once("error", () => {
    ElMessage.error('连接失败')
  })
  const endWite = () => {
    waiting.close()
    clearTimeout(waitingTimeout)
    endWaitingLink()
  }
}


</script>

<template>
  <el-main>
    <el-input type="text" placeholder="id" v-model="linkId" spellcheck="false" class="mb-1"></el-input>
    <el-button @click="link" class="w-full md:w-1/4">连接</el-button>
  </el-main>
</template>
