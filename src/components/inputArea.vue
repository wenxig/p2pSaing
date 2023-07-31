<script setup lang='ts'>
import { ref } from 'vue';
import { useFileDialog } from '@vueuse/core'
import { hashBinary } from "spark-md5";
import {linker} from '@/assets/linker';
const props= defineProps<{
  player: linker
}>()
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
            const md5 = hashBinary(e.target.result as string);
            const bl = new Blob([file])
            props.player.send(md5, "img", bl)
          }
        }
      }
    }
  })
}
</script>

<template>
  <div class=" fixed w-full md:!w-3/4 bottom-0 right-0 h-[12rem] md:h-[13rem] bg-white">
    <el-icon size="1.5rem" class=" !absolute z-30 right-2 top-2" @click="uploadFile">
      <PictureFilled :color="iconColor" class=" hover:!text-[#79bbff] !transition-colors duration-500 ease-in-out" />
    </el-icon>
    <el-input spellcheck="false" placeholder="massage" v-model="player.tomsg.value"
      class=" !m-0 h-40 !border-l-0 z-0 !w-full" @mouseenter="iconColor = '#c8c9cc'"
      @mouseleave="iconColor = '#e9e9eb'"></el-input>
    <el-button @click="player.send(player.tomsg.value)" class=" z-10 !m-0 h-9 w-full"
      :disabled="player.islink">发送</el-button>
  </div>
</template>

<style scoped lang='scss'>
:deep(.el-textarea>textarea) {
  resize: none;
  height: 100%;
  border-radius: 0%;
}
</style>