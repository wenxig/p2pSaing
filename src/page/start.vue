<script setup lang='ts'>
import { ElMessage } from 'element-plus'
import { useLinkStore } from '@/stores/link.ts';
useLinkStore()
let isWebrtcOk = false
try {
  //@ts-ignore
  isWebrtcOk = !!mozRtcPeerConnection
} catch (error) {
  try {
    //@ts-ignore
    isWebrtcOk = !!webkitRTCPeerConnection
  } catch (error) {
    try {
      isWebrtcOk = !!RTCPeerConnection
    } catch (error) {
      isWebrtcOk=false
    }
  }
}
if (!isWebrtcOk) {
  ElMessage.error('你的浏览器不支持webrtc')
}
</script>

<template>
  <el-container>
    <el-header class=" grid content-center bg-[#FAFCFF]">欢迎</el-header>
    <el-main>
      <h1 class=" text-2xl mb-5">你好</h1>
      <p>这是一个基于webrtc实现的在线聊天工具</p>
      <p>本产品有以下特点</p>
      <ul class=" pl-8">
        <li>安全：纯前端实现，没有任何监听或数据收集</li>
        <li>隐私：去中心化，没有唯一用户id</li>
        <li>简洁：没有除了聊天之外的冗余功能</li>
        <li>无痕：不会向用户的电脑存储任何数据</li>
      </ul>
    </el-main>
  </el-container>
</template>

<style scoped lang='scss'>
p {
  margin-bottom: 0.5rem;
}

li {
  list-style-type: disc;
}
</style>