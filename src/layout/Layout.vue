<script setup>
import {RouterView} from "vue-router";

import {useUserStore} from "@/stores/user";
import router from "@/router";
import request from "@/utils/request";
import {ElMessage} from "element-plus";

const userStore = useUserStore()
const user = userStore.getUser
const logout = () => {
  request.get('/logout/' + user.uid).then(res => {
    if (res.code === '200') {
      userStore.logout()
      ElMessage.success("成功退出登录")
      location.reload()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const menus = userStore.getMenus

</script>

<!--顶部栏-->
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
            <el-dropdown>
              <el-avatar :size="40" :src="user.avatar" style="margin-top: 10px"/>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <div @click="router.push('/person')">个人信息</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="logout">退出登录</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <!--    侧面表单-->
    <div style="display: flex">
      <div style="width: 200px; min-height: calc(100vh - 60px); border-right: 1px solid #ccc">
        <el-menu
            :default-active="'home'"
            :default-openeds="menus.map(v => v.id + '')"
            class="el-menu-demo"
            style="border: none"
            router
        >
          <div v-for="item in menus" :key="item.id">
            <div v-if="item.type === 2">
              <el-menu-item :index="item.path" v-if="!item.hide">
                <el-icon v-if="item.icon">
                  <component :is="item.icon"></component>
                </el-icon>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </div>
            <div v-else>
              <el-sub-menu :index="item.id + ''" v-if="!item.hide">
                <template #title>
                  <el-icon v-if="item.icon">
                    <component :is="item.icon"></component>
                  </el-icon>
                  <span>{{ item.name }}</span>
                </template>
                <div v-for="subItem in item.children" :key="subItem.id">
                  <el-menu-item :index="subItem.path" v-if="!subItem.hide">
                    <template #title>
                      <el-icon v-if="subItem.icon">
                        <component :is="subItem.icon"></component>
                      </el-icon>
                      <span>{{ subItem.name }}</span>


                    </template>
                  </el-menu-item>
                </div>
              </el-sub-menu>
            </div>
          </div>
        </el-menu>
      </div>
      <!--   HomeView模块   -->
      <div style="flex: 1; padding: 10px">
        <RouterView/>
      </div>
    </div>

  </div>
</template>
