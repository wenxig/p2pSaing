<script setup lang='ts'>
import { type userListType } from '@/stores/link.ts';
defineProps<{
  thisLink: userListType
}>()
</script>

<template>
  <div v-for="(msg, index) in thisLink.msg" :class="['relative mb-3', msg.type == 'my' ? 'justify-end flex' : '']"
    :key="index">
    <div v-if="msg.type == 'sys'" class=" text-sm text-gray-400 select-none text-center h-3 mb-0">
      {{ msg.text }}
    </div>
    <div v-else
      class="max-w-[40%] inline-block rounded-md p-2 pl-3 pr-3 before:content-[''] before:w-2 before:h-2 before:block before:m-0 before:!absolute before:rotate-45"
      :class="{'bg-[#a0cfff] before:bg-[#a0cfff] right-0 before:right-0 before:translate-x-1/2' : msg.type == 'my','bg-[#ecf5ff] before:bg-[#ecf5ff] left-0 before:left-0 before:-translate-x-1/2': msg.type == 'they' }">
      {{ msg.text }}
    </div>
  </div>
</template>