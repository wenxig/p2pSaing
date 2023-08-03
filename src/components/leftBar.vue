<script setup lang='ts'>
defineEmits<{
  (e: 'click', v: void): void
}>()
import { useLinkStore } from '@/stores/link.ts';
const linkStore = useLinkStore()

</script>

<template>
  <el-main class=" !p-0 md:!pl-[20px] md:!pr-[20px] md:!pt-[20px]">
    <el-card shadow="never" class=" !p-0 mb-1" v-for="(conn, index) in linkStore.userList" :key="index"
      :body-style="{ 'background-color': $route.params.id == conn.id ? '#d9ecff' : conn.isDisconnected ? '#E4E7ED' : '' }"
      @click="$emit('click', void $router.push(`/link/${conn.id}`))">{{ conn.id }}</el-card>
    <el-button class=" w-full !h-10 mt-2 mb-1" @click="$emit('click', void $router.push('/link'))">
      <el-icon>
        <i-ep-Plus />
      </el-icon>
      发起连接
    </el-button>

    <el-card shadow="never" class=" !p-0 mb-1 mt-3" v-for="(conn, index) in linkStore.roomList" :key="index"
      :body-style="{ 'background-color': $route.params.id == conn.id ? '#d9ecff' : '' }"
      @click="$emit('click', void $router.push(`/link/${conn.id}`))">{{ conn.id }}</el-card>

    <el-button class=" w-full !h-10 mt-2 !ml-0" @click="$emit('click', void $router.push('/room'))">
      <el-icon>
        <i-ep-Plus />
      </el-icon>
      连接群聊
    </el-button>
  </el-main>
</template>

<style scoped lang='scss'>
:deep(.el-card__body) {
  font-size: 10px !important;
  transition: background-color 300ms;
}
</style>