<script setup>
import {RouterView} from "vue-router";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,

} from '@element-plus/icons-vue'
import HomeView from "@/views/HomeView.vue";
</script>


<template>
  <div>
    <div style="height: 60px;line-height: 60px;border-bottom: 1px solid #ccc;background-color: aliceblue">
      <div style="display: flex">
        <div style="width: 200px;color: dodgerblue;font-weight: bold;font-size: 24px;text-align: center">
          后台管理
        </div>

        <div style="flex: 1;display: flex">
          <div style="flex: 1">
            中间
          </div>
          <div style="width: 200px;text-align: right;padding-right: 20px">
            头像
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex">
      <div style="width: 200px;min-height: calc(100vh - 60px);border-right: 1px solid #ccc">
        <el-menu
            default-active="/home"
            class="el-menu-vertical-demo"

        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>Navigator One</span>
            </template>
            <el-menu-item index="/home">item one</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <span>Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <el-icon><document /></el-icon>
            <span>Navigator Three</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span>Navigator Four</span>
          </el-menu-item>
        </el-menu>
      </div>
<!--   HomeView模块   -->
      <div style="flex: 1;padding: 10px">
        <RouterView />
      </div>


    </div>
  </div>
</template>



<style scoped>

</style>
