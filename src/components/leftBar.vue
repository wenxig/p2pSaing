<script setup lang='ts'>
defineEmits<{
  (e: 'click', v: void): void
}>()
import { useLinkStore } from '@/stores/link.ts';
const linkStore = useLinkStore()

</script>

<template>
  <el-main class=" !p-0 md:!pl-[20px] md:!pr-[20px] md:!pt-[20px]">
    <el-card shadow="never" class=" !p-0 mb-2" v-for="(conn, index) in linkStore.userList" :key="index"
      :body-style="{ 'background-color': $route.params.id == conn.id ? '#d9ecff' : conn.isDisconnected ? '#E4E7ED' : '' }"
      @click="$emit('click', void $router.push(`/saing/${conn.id}`))">{{ conn.id }}</el-card>
    <el-button icon="Plus" class=" w-full !h-10 mt-2"
      @click="$emit('click', void $router.push('/addlink'))">发起连接</el-button>
  </el-main>
</template>

<style scoped lang='scss'>
:deep(.el-card__body) {
  font-size: 10px !important;
  transition: background-color 300ms;
}
</style>