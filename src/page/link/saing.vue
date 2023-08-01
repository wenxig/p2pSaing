<script setup lang="ts">
import { ref, inject, Ref, nextTick } from 'vue';
import { useLinkStore } from '@/stores/link.ts';
import { useRoute } from 'vue-router';
import saingPop from '@/components/saingPop.vue';
import { linker } from '@/assets/linker';
import inputArea from '@/components/inputArea.vue';
import { DataConnection } from 'peerjs';
import { Link } from '@/link';
const route = useRoute()
const linkStore = useLinkStore()
const thisLink = linkStore.userList.find((d) => {
  return route.params.id == d.id
})
class peerMember extends linker {
  connForThey = thisLink.connForThey as DataConnection
  tomsg = ref("")
  msg = thisLink.msg
  isDisconnected = thisLink.isDisconnected as boolean
  islink = false
  endLink = useLinkStore().endLink
  constructor() {
    super()
    this.connForThey.off('data')
    //@ts-ignore
    this.connForThey.on('data', (data: Link.MsgType) => {
      data.is = "they"
      this.msg.push(data)
    });

    //连接断开监听
    this.connForThey.off('close')
    this.connForThey.once("close", () => {
      this.disconnected()
    })
  }
  public send(str: string, type?: "text" | "img", blob?: Blob) {
    str = str.trim()
    if (str != "") {
      let msgObj: Link.MsgType = {
        msg: str,
        index: this.msg.length,
        is: "my",
        type: type ?? "text",
        blob
      } as any
      this.connForThey.send(msgObj)
      this.msg.push(msgObj)
      nextTick(() => {
        const sayer = document.getElementById("saingMain")
        if (sayer) {
          sayer.scroll({
            top: sayer.clientHeight,
            left: 0,
            behavior: 'smooth'
          })
        }
      })
    }
    this.tomsg.value = ""
    nextTick(() => this.tomsg.value = "")
  }
  public disconnected() {
    if (!this.isDisconnected) {
      this.connForThey.off('close')
      this.connForThey.off('data')
      this.isDisconnected = true
      this.msg.push({ msg: "<连接断开>", index: this.msg.length, is: "sys", type: "text" });
      this.islink = false
      this.endLink(this.connForThey)
    }
  }
}
const player = new peerMember()



const leftBarShow = inject('leftBarShow') as Ref<boolean>
function showLeftbar() {
  if (screen.availWidth < 768) {
    leftBarShow.value = true
  }
}
</script>

<template>
  <el-container>
    <el-header class=" flex items-center relative bg-[#FAFCFF] text-sm md:text-lg" @click="showLeftbar()">
      {{ thisLink.id }}
      <el-button class=" absolute right-2" type="warning" plain @click.stop="player.disconnected()"
        :disabled="thisLink.isDisconnected">结束连接</el-button>
    </el-header>
    <el-main class="main relative !pb-[13rem] " id="saingMain">
      <saingPop :msg="thisLink.msg" />
      <inputArea :player="player" />
    </el-main>
  </el-container>
</template>
