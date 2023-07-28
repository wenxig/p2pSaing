<script setup lang="tsx">
import leftBar from '@/components/leftBar.vue';
import { ElNotification } from 'element-plus';
import { provide } from 'vue';
import { useRouter } from 'vue-router';
provide("requitPleses", show)
function show(id: string, notreq: () => void, okreq: () => void) {
  let notificationEl = (<>
    <p>id:{id}</p>
    <el-button type="danger" plain onClick={() => {
      notreq()
      el.close()
    }}> 取消  </el-button>
    <el-button type="success" plain onClick={() => {
      okreq()
      el.close()
    }}> 同意  </el-button>
  </>)
  let el = ElNotification({
    title: '请求连接',
    dangerouslyUseHTMLString: true,
    message: notificationEl,
    duration: 10000,
    showClose: false,
  })
}

if (import.meta.env.DEV) {
  let r = useRouter()
  r.push('/addlink')
}

</script>

<template>
  <el-container class=" h-full w-full">
    <left-bar class=" !w-1/4"></left-bar>
    <router-view class=" !w-3/4" :key="($route.params.id as string)"></router-view>
  </el-container>
</template>
<style>
html,
body,
#app {
  height: 100vh;
  width: 100vw;
}
</style>