<script setup lang='ts'>
import { useLinkStore } from '@/stores/link.ts';
const linkStore = useLinkStore()

</script>

<template>
  <el-aside class="aside border-r-[1px] border-solid border-[#79bbff] h-full relative">
    <el-main class=" pl-0 pr-0">
      <el-card shadow="never" class=" !p-0 mb-2" v-for="(conn, index) in linkStore.userList" :key="index"
        :body-style="{'background-color': $route.params.id == conn.id ?'#d9ecff':conn.isDisconnected?'#E4E7ED':''}" @click="$router.push(`/saing/${conn.id}`)">{{ conn.id }}</el-card>
      <el-button icon="Plus" class=" w-full !h-10 mt-2" @click="$router.push('/addlink')">发起连接</el-button>
    </el-main>
  </el-aside>
</template>

<style scoped lang='scss'>
:deep(.el-card__body) {
  font-size: 10px !important;
  transition: background-color 300ms;
}
</style>