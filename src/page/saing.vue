<script setup lang="tsx">
import { ref } from 'vue';
import { useLinkStore, type userListType } from '@/stores/link.ts';
import { useRoute } from 'vue-router';
import saingPop from '@/components/saingPop.vue';
const route = useRoute()
const linkStore = useLinkStore()
const thisLink = linkStore.userList.find((d) => {
  return route.params.id == d.id
}) as userListType
let tomsg = ref("")
class peerMember {
  constructor() {
    thisLink.connForThey.off('data')
    thisLink.connForThey.on('data', (data: any) => {
      thisLink.msg.push({ text: data.toString(), index: thisLink.msg.length, type: "they" })
    });

    //连接断开监听
    thisLink.connForThey.off('close')
    thisLink.connForThey.once("close", () => {
      this.disconnected()
    })
  }
  send(str: string) {
    if (str != "") {
      tomsg.value = ""
      thisLink.connForThey.send(str)
      thisLink.msg.push({
        text: str,
        index: thisLink.msg.length,
        type: "my"
      })
    }
  }
  disconnected() {
    if (!thisLink.isDisconnected) {
      thisLink.connForThey.off('close')
      thisLink.connForThey.off('data')
      thisLink.isDisconnected = true
      thisLink.msg.push({ text: "<连接断开>", index: thisLink.msg.length, type: "sys" });
      thisLink.islink = false
      linkStore.endLink(thisLink.connForThey)
    }
  }
}
const player = new peerMember()
</script>

<template>
  <el-container>
    <el-header class=" flex items-center relative bg-[#FAFCFF]">
      {{ thisLink.id }}
      <el-button class=" absolute right-2" type="warning" plain @click="player.disconnected()">结束连接</el-button>
    </el-header>
    <el-main class="main relative !pb-[13rem] ">
      <saingPop :thisLink="thisLink" />
      <el-input spellcheck="false" placeholder="massage" v-model.trim="tomsg"
        class=" !fixed bottom-10 right-0 !m-0 h-40 !border-l-0 z-0 !w-3/4" type="textarea"></el-input>
      <el-button @click="player.send(tomsg)" class=" !fixed bottom-1 right-0 z-10 !m-0 h-9 w-3/4"
        :disabled="!thisLink.islink">发送</el-button>
    </el-main>
  </el-container>
</template>
<style scoped lang='scss'>
:deep(.el-textarea>textarea) {
  resize: none;
  height: 100%;
  border-radius: 0%;
}
</style>