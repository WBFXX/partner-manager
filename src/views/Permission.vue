<script setup>
import {
  Search,
  RefreshLeft,
  Plus, Bottom, Top, Remove
} from '@element-plus/icons-vue'
import {nextTick, reactive, ref} from "vue";
import request from "@/utils/request";

import {ElMessage} from "element-plus";
import config from "../../config";
import {useUserStore} from "@/stores/user";

const state = reactive({
  tableData: [],
  form: {}
})
const multipleSelection = ref([])


// 多选
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
// 批量删除
const confirmDelBatch = () =>{
  //当value为0或者长度为0
  if (!multipleSelection.value || !multipleSelection.value.length ){
    ElMessage.warning("请选择数据")
    return
  }
  const idArr = multipleSelection.value.map(v => v.id)
  request.post('/permission/del/batch',idArr).then(res => {
    if (res.code === '200') {
      ElMessage.success("操作成功")
      load() //刷新表格数据
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const load = () => {
  request.get('/permission/tree'
  ).then(res => {
    state.tableData = res.data
  })
}
load()//调用load方法拿到数据

const reset = () => {
  name.value = ''
  load()

}

const currentChange = (num) => {
  pageNum.value = num
  load()
}
const sizeChange = (size) => {
  pageSize.value = size
  load()
}

const dialogFormVisible = ref(false)



const ruleFormRef = ref()
//新增
const handleAdd = () => {
  dialogFormVisible.value = true
  nextTick(() => {
    ruleFormRef.value.resetFields()
    state.form = {type: 1, orders: 1}
  })


}
const rules = reactive({

  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ]
})
//保存
const save = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {//valid就是检验的结果
      request.request({
        url: '/permission',
        method: state.form.id ? 'put' : 'post',//根据id进行判断请求哪个接口
        data: state.form
      }).then(res => {
        if (res.code === '200') {
          ElMessage.success("操作成功")
          dialogFormVisible.value = false
          load() //刷新表格数据
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}
//编辑
const handleEdit = (raw) => {
  dialogFormVisible.value=true
  nextTick(() => {
    ruleFormRef.value.resetFields()
    state.form = JSON.parse(JSON.stringify(raw));
  })


}
//删除
const del = (id) => {
  request.delete('/permission/'+ id).then(res => {
        if (res.code === '200') {
          ElMessage.success("操作成功")
          load() //刷新表格数据
        } else {
          ElMessage.error(res.msg)
        }
      }
  )
}
// 导出
const exportData = () => {
  window.open(`http://${config.serverUrl}/permission/export`)
}


const userStore = useUserStore()
const token = userStore.getBearerToken

const handleImportSuccess = () => {
  //刷新表格
  load()
  ElMessage.success("导入成功")
}

//权限树状数据
const options = ref([])
const icons = ref([])
</script>

<template>
  <div>
    <!--搜索-->
    <div>
      <el-input v-model="name" placeholder="请输入名称" style="width: 300px "/>
      <el-button type="primary" style="margin-left: 5px" @click="load">
        <el-icon style="vertical-align: middle">
          <Search/>
        </el-icon>
        <span style="vertical-align: middle">搜索</span>
      </el-button>
      <el-button type="warning" style="margin-left: 5px" @click="reset">
        <el-icon>
          <RefreshLeft/>
        </el-icon>
        <span style="vertical-align: middle">重置</span>
      </el-button>
<!--数据新增导入导出删除操作-->
    </div>

    <div style="margin: 10px 0">
      <el-button type="success"  @click="handleAdd">
        <el-icon>
          <Plus/>
        </el-icon>
        <span style="vertical-align: middle">新增</span>
      </el-button>
      <el-upload
          :show-file-list="false"
          style="display: inline-block;position: relative;top: 3px;margin: 5px"
          :action='`http://${config.serverUrl}/permission/import`'
          :on-success="handleImportSuccess"
          :headers="{ Authorization: token }"
      >
        <el-button type="primary"  >
          <el-icon>
            <Bottom/>
          </el-icon>
          <span style="vertical-align: middle">导入</span>
        </el-button>
      </el-upload>



      <el-button type="primary"  @click="exportData">
        <el-icon>
          <Top/>
        </el-icon>
        <span style="vertical-align: middle">导出</span>
      </el-button>

      <el-popconfirm title="是否确认删除?" @confirm="confirmDelBatch">
        <template #reference>
          <el-button type="danger" style="margin-left: 5px">
            <el-icon>
              <Remove/>
            </el-icon>
            <span style="vertical-align: middle">批量删除</span>
          </el-button>
        </template>
      </el-popconfirm>

    </div>
    <!--表格-->
    <div style="margin: 10px 0">
      <el-table row-key="id" default-expand-all :data="state.tableData" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>

            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="path" label="访问路径" ></el-table-column>
            <el-table-column prop="page" label="页面路径"></el-table-column>
            <el-table-column prop="orders" label="顺序"></el-table-column>
            <el-table-column prop="icon" label="图标"></el-table-column>
            <el-table-column prop="auth" label="权限"></el-table-column>
            <el-table-column prop="pid" label="父级"></el-table-column>
            <el-table-column prop="auth" label="类型">
              <template #default="scope">
                <el-tag type="warning" v-if="scope.row.type === 1"> 菜单目录 </el-tag>
                <el-tag type="primary" v-if="scope.row.type === 2"> 菜单页面 </el-tag>
                <el-tag type="success" v-if="scope.row.type === 3"> 菜单按钮 </el-tag>
              </template>
            </el-table-column>




        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm title="是否确认删除?" @confirm="del(scope.row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <!--分页-->

    <!--弹窗-->
      <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
        <el-form :model="state.form" label-width="80px" style="padding: 0 20px"
                 ref="ruleFormRef"
                 :rules="rules" status-icon>

          <el-form-item prop="name" label="名称" >
                      <el-input v-model="state.form.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="path" label="访问路径" v-if="state.form.type === 1 || state.form.type === 2">
                      <el-input v-model="state.form.path" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="page" label="页面路径" v-if="state.form.type === 2">
            <el-input v-model="state.form.page" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="orders" label="顺序" v-if="state.form.type === 1 || state.form.type === 2">
                      <el-input-number v-model="state.form.orders" :min="1"  />
          </el-form-item>
          <el-form-item prop="icon" label="图标" v-if="state.form.type === 1 || state.form.type === 2">
            <el-select v-model="state.form.icon"  placeholder="请选择" style="width: 100%">
              <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="auth" label="权限" v-if="state.form.type === 3 || state.form.type === 2">
                      <el-input v-model="state.form.auth" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="pid" label="父级菜单" >
            <el-select v-model="state.form.pid"  placeholder="请选择" style="width: 100%">
              <el-option
                  v-for="item in options"
                  :key="item"
                  :label="item"
                  :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="pid" label="类型" >
            <el-radio-group v-model="state.form.type">
              <el-radio :label="1">菜单目录</el-radio>
              <el-radio :label="2">菜单页面</el-radio>
              <el-radio :label="3">页面按钮</el-radio>
            </el-radio-group>
          </el-form-item>

        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </span>
        </template>
      </el-dialog>
  </div>
</template>
