<script setup lang="ts">
import { inject, nextTick, ref, Ref } from 'vue';
import { useLinkStore } from '@/stores/link.ts';
import { useRoute } from 'vue-router';
import saingPop from '@/components/saingPop.vue';
import { linker as Linker } from '@/assets/linker';
import inputArea from '@/components/inputArea.vue';
import { Room } from '@t/room';
const route = useRoute()
const linkStore = useLinkStore()
const thisRoom = linkStore.roomList.find((v) => {
  return v.id == route.params.id
})

class Roomer extends Linker {
  connForThey = thisRoom.connForThey
  islink?: boolean | undefined;
  id = route.params.id
  tomsg = ref("")
  msg = thisRoom.msg
  constructor() {
    super();
    this.connForThey.off('data')
    //@ts-ignore
    this.connForThey.on('data', (data: Room.MsgType) => {
      data.is = 'they'
      this.msg.push(data)
    });
  }
  public send(str: string, type?: "text" | "img", blob?: Blob) {
    str = str.trim();
    if (str !== "") {
      let msgObj = {
        msg: str,
        time: new Date(),
        type: type ?? "text",
        is: "my",
        blob
      } as Room.MsgType;
      this.connForThey.send(msgObj);
      this.msg.push(msgObj);
      nextTick(() => {
        const sayer = document.getElementById("saingMain");
        sayer?.scroll({
          top: sayer.clientHeight,
          left: 0,
          behavior: 'smooth'
        });
      });
    }
    this.tomsg.value = "";
    nextTick(() => this.tomsg.value = "");
  }
  public disconnected() {
    alert()
  }
}
const roomer = new Roomer()

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
      {{ roomer.id }}
      <el-button class=" absolute right-2" type="warning" plain @click.stop="roomer.disconnected()">结束连接</el-button>
    </el-header>
    <el-main class="main relative !pb-[13rem] ">
      <saingPop :msg="thisRoom.msg" />
      <inputArea :player="roomer" />
    </el-main>
  </el-container>
</template>
