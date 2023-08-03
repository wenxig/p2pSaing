<script setup lang='ts'>
import { Link } from '@t/link';
import { Room } from '@t/room';
import { reactive } from 'vue';

const props = defineProps<{
  msg: Room.MsgType[] | Link.MsgType[],
}>()

//为什么ai是神，下面是chatgpt完成的
const imgSrcList = reactive<string[]>([]);

async function blobToBase64(blob: Blob | undefined): Promise<string> {
  if (!blob) {
    throw new Error('Blob is undefined');
  }
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsDataURL(blob);
  });
}

async function addimg(index: number): Promise<boolean> {
  const { blob } = props.msg[index];
  const b64 = arrayBufferToBase64(blob as unknown as ArrayBuffer);
  imgSrcList[index] = b64
    ? `data:application/octet-stream;base64,${b64}`
    : await blobToBase64(blob);
  return true;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binaryArray = Array.from(bytes);
  const binaryString = binaryArray.map(byte => String.fromCharCode(byte)).join('');
  return window.btoa(binaryString);
}
</script>

<template>
  <div v-for="(msgs, index) in msg" :class="['relative mb-3', msgs.is == 'my' ? 'justify-end flex' : '']" :key="index">
    <div v-if="msgs.is == 'sys' && msgs.type == 'text'"
      class=" text-sm text-gray-400 select-none text-center h-3 mb-0 relative">
      {{ msgs.msg }}
    </div>
    <div v-else-if="msgs.type == 'text'"
      class="max-w-[40%] inline-block rounded-md p-2 pl-3 pr-3 before:content-[''] before:w-2 before:h-2 before:block before:m-0 before:!absolute before:rotate-45 relative"
      :class="{ 'bg-[#a0cfff] before:bg-[#a0cfff] right-0 before:right-0 before:translate-x-1/2': msgs.is == 'my', 'bg-[#ecf5ff] before:bg-[#ecf5ff] left-0 before:left-0 before:-translate-x-1/2': msgs.is == 'they' }">
      {{ msgs.msg }}
    </div>
    <el-image v-else-if="msgs.type == 'img'" :src="imgSrcList[index]" fit="contain" :mk="addimg(index)"
      class=" w-[35%] rounded-xl">
      <template #error>
        <div
          class=" flex justify-center items-center w-full h-full bg-[var(--el-fill-color-light)] text-[var(--el-text-color-secondary)] text-[30px]">
          <el-icon size="30px">
            <i-ep-Picture />
          </el-icon>
        </div>
      </template>
    </el-image>
  </div>
</template>