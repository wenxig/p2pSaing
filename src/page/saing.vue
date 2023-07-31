<script setup lang="tsx">
import { ref, inject, Ref } from 'vue';
import { useLinkStore, type UserListType, type MsgType } from '@/stores/link.ts';
import { useRoute } from 'vue-router';
import saingPop from '@/components/saingPop.vue';
import { useFileDialog } from '@vueuse/core'

const route = useRoute()
const linkStore = useLinkStore()
const thisLink = linkStore.userList.find((d) => {
  return route.params.id == d.id
}) as UserListType
let tomsg = ref("")
class peerMember {
  constructor() {
    thisLink.connForThey.off('data')
    //@ts-ignore
    thisLink.connForThey.on('data', (data: MsgType) => {
      data.type="they"
      thisLink.msg.push(data)
    });

    //连接断开监听
    thisLink.connForThey.off('close')
    thisLink.connForThey.once("close", () => {
      this.disconnected()
    })
  }
  send(str: string, type?: "text" | "img", blob?: Blob) {
    str=str.trim()
    if (str != "") {
      tomsg.value = ""
      let msgObj= {
        text: str,
        index: thisLink.msg.length,
        type: "my",
        is: type ?? "text",
        blob
      } as any
      thisLink.connForThey.send(msgObj)
      thisLink.msg.push(msgObj)
    }
  }
  disconnected() {
    if (!thisLink.isDisconnected) {
      thisLink.connForThey.off('close')
      thisLink.connForThey.off('data')
      thisLink.isDisconnected = true
      thisLink.msg.push({ text: "<连接断开>", index: thisLink.msg.length, type: "sys", is: "text" });
      thisLink.islink = false
      linkStore.endLink(thisLink.connForThey)
    }
  }
}
const player = new peerMember()

let iconColor = ref("#e9e9eb")
function uploadFile() {
  //@ts-ignore
  const { onChange, open, files } = useFileDialog()
  open({
    accept: 'image/*'
  })
  onChange(() => {
    if (files.value && files.value.length == 1) {
      let file = files.value[0]
      if (file.type.includes('image/')) {
        const fileReader = new FileReader()
        fileReader.readAsBinaryString(file);
        fileReader.onload = e => {
          if (e.target) {
            const md5 = (window as any).SparkMD5.hashBinary(e.target.result);
            const bl = new Blob([file])
            player.send(md5, "img", bl)
          }
        }
      }
    }
  })
}

const leftBarShow = inject('leftBarShow') as Ref<boolean>
function showLeftbar(){
  if(screen.availWidth < 768){
    leftBarShow.value=true
  }
}
</script>

<template>
  <el-container>
    <el-header class=" flex items-center relative bg-[#FAFCFF] text-sm md:text-lg" @click="showLeftbar()">
      {{ thisLink.id }}
      <el-button class=" absolute right-2" type="warning" plain @click.stop="player.disconnected()" :disabled="thisLink.isDisconnected">结束连接</el-button>
    </el-header>
    <el-main class="main relative !pb-[13rem] ">
      <saingPop :thisLink="thisLink" />
      <div class=" fixed w-full md:!w-3/4 bottom-0 right-0 h-[12rem] md:h-[13rem] bg-white">
        <el-icon size="1.5rem" class=" !absolute z-30 right-2 top-2" @click="uploadFile">
          <PictureFilled :color="iconColor" class=" hover:!text-[#79bbff] !transition-colors duration-500 ease-in-out" />
        </el-icon>
        <el-input spellcheck="false" placeholder="massage" v-model="tomsg" class=" !m-0 h-40 !border-l-0 z-0 !w-full"
          type="textarea" @mouseenter="iconColor = '#c8c9cc'" @mouseleave="iconColor = '#e9e9eb'"></el-input>
        <el-button @click="player.send(tomsg)" class=" z-10 !m-0 h-9 w-full" :disabled="!thisLink.islink">发送</el-button>
      </div>

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