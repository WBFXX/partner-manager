<script setup>

import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import {useUserStore} from "@/stores/user";
import router, {setRoutes} from "@/router";
import {User,Lock} from "@element-plus/icons-vue/global";


const loginData = reactive({})
const rules = reactive({
  username: [
    {required: true, message: '请输入账号', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 3, max: 20, message: '密码长度在3到20位之间', trigger: 'blur'},
  ],

})
const ruleFormRef = ref()
const login = () => {
  ruleFormRef.value.validate(valid => {
        if (valid) {
          //发送表单数据给后台
          request.post('/login', loginData).then(res => {
            if (res.code === '200') {
              ElMessage.success('登陆成功')
              const userStore = useUserStore()
              userStore.setManagerInfo(res.data)
              router.push('/')

            } else {
              ElMessage.error(res.msg)
            }
          })
        }
      }
  )
}
//回车登录
onMounted(() => {
  window.addEventListener('keydown', keyDown)
})
const keyDown = (e) => {
  //如果是回车则执行登录方法
  if (e.keyCode === 13) {
    login()
  }
}
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})
</script>


<template>
  <div style="height: 100vh;overflow: hidden;background-color: aliceblue">
    <div
        style="width: 400px;margin: 100px auto;border: 1px solid #ddd;padding: 30px;border-radius: 10px;background-color: white">
      <el-form
          ref="ruleFormRef"
          :model="loginData"
          :rules="rules"
          size="large"
          status-icon
      >
        <div style="text-align: center;color: dodgerblue;font-size: 25px;font-weight: bold;margin-bottom: 25px">登 录
        </div>
        <el-form-item prop="username">
          <el-input v-model="loginData.username" placeholder="请输入账号" :prefix-icon="User"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginData.password" placeholder="请输入密码" :prefix-icon="Lock"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @keyup.enter="keyDown" @click="login"> 登 录</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>


<style scoped>

</style>
