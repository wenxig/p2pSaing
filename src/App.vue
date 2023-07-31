<script setup lang="tsx">
import leftBar from '@/components/leftBar.vue';
import { ElNotification } from 'element-plus';
import { provide, ref } from 'vue';
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
    duration: 0,
    showClose: false,
    position: screen.availWidth < 768 ? 'bottom-right' : undefined
  })
}

let leftBarShow = ref(false)
provide('leftBarShow', leftBarShow)

</script>

<template>
  <el-container class=" h-full w-full">
    <el-aside class="aside border-r-[1px] border-solid border-[#79bbff] h-full relative !w-1/4 hidden md:block">
      <left-bar></left-bar>
    </el-aside>
    <router-view class=" !w-3/4" :key="($route.params.id as string)"></router-view>
    <el-icon class=" !fixed right-1 top-[1.875rem] translate-y-[-50%] md:!hidden block" size="2rem"
      @click="leftBarShow = true" v-if="!$route.path.includes('/saing/')">
      <MoreFilled />
    </el-icon>
  </el-container>
  <el-drawer v-model="leftBarShow" title="菜单" direction="ltr" class=" md:!hidden">
    <left-bar class=" !w-full md:hidden block" @click="leftBarShow = false"></left-bar>
  </el-drawer>
</template>
<style lang="scss">
html,
body,
#app {
  height: 100vh;
  width: 100vw;
}

.el-drawer {
  &.open {
    width: 100% !important;
  }

  .el-drawer__header {
    margin-bottom: 1rem;
  }

  .el-drawer__body {
    padding-top: 0rem;
  }
}

@media (max-width: 768px) {
  .el-notification {
    width: 100vw !important;
    right: 0 !important;
  }

  .el-drawer {
    &.open {
      width: 100% !important;
    }

    .el-drawer__header {
      margin-bottom: 1rem;
    }

    .el-drawer__body {
      padding-top: 0rem;
    }
  }
}
</style>