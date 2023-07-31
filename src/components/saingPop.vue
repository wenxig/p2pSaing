<script setup lang='ts'>
import { type UserListType } from '@/stores/link.ts';
import { reactive } from 'vue';
const props = defineProps<{
  thisLink: UserListType,
}>()
function blobToBase64(blob: Blob | undefined, callback: (base64: string) => void) {
  if (blob) {
    let r = new FileReader();
    r.onload = function (e) {
      if (e.target) {
        callback(e.target.result as string);
      }
    }
    r.readAsDataURL(blob);
  }
}

let imgSrcList: string[] = reactive([])
function addimg(index: number): boolean {
  let b64 = ArrayBufferToBase64(props.thisLink.msg[index].blob as unknown as ArrayBuffer)
  if (b64) {
    imgSrcList[index] = 'data:application/octet-stream;base64,' + b64
  } else {
    blobToBase64(props.thisLink.msg[index].blob, (b64) => {
      imgSrcList[index] = b64
    })
  }
  return true
}
function ArrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  for (let len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
</script>

<template>
  <div v-for="(msg, index) in thisLink.msg" :class="['relative mb-3', msg.type == 'my' ? 'justify-end flex' : '']"
    :key="index">
    <div v-if="msg.type == 'sys' && msg.is == 'text'" class=" text-sm text-gray-400 select-none text-center h-3 mb-0">
      {{ msg.text }}
    </div>
    <div v-else-if="msg.is == 'text'"
      class="max-w-[40%] inline-block rounded-md p-2 pl-3 pr-3 before:content-[''] before:w-2 before:h-2 before:block before:m-0 before:!absolute before:rotate-45"
      :class="{ 'bg-[#a0cfff] before:bg-[#a0cfff] right-0 before:right-0 before:translate-x-1/2': msg.type == 'my', 'bg-[#ecf5ff] before:bg-[#ecf5ff] left-0 before:left-0 before:-translate-x-1/2': msg.type == 'they' }">
      {{ msg.text }}
    </div>
    <el-image v-else-if="msg.is == 'img' && addimg(index)" :src="imgSrcList[index]" fit="contain" class=" w-[35%] rounded-xl">
      <template #error>
        <div
          class=" flex justify-center items-center w-full h-full bg-[var(--el-fill-color-light)] text-[var(--el-text-color-secondary)] text-[30px]">
          <el-icon size="30px"><Picture /></el-icon>
        </div>
      </template>
    </el-image>
  </div>
</template>