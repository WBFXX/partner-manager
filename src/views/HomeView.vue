<script setup>
import {
  Search,
  RefreshLeft,
  Plus
} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import request from "@/utils/request";
import {ElMessage} from "element-plus";

const name = ref('')
const address = ref('')
const state = reactive({
  tableData: [],
  form: {}
})
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const load = () => {
  request.get('/user/page', {
    params: {
      name: name.value,
      address: address.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value,

    }
  }).then(res => {
    state.tableData = res.data.records
    total.value = res.data.total
  })
}
load()//调用load方法拿到数据

const reset = () => {
  name.value = ''
  address.value = ''
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
const handleAdd = () => {
  dialogFormVisible.value = true
  ruleFormRef.value.resetFields()
  state.form = {}
}
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20位之间', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '请输入正确邮箱', trigger: 'blur' },
  ],
  address: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    //{ min: 3, max: 20, message: '请输入正确邮箱', trigger: 'blur' },
  ]
})
const save = () => {
  ruleFormRef.value.validate(valid => {
    if (valid) {//valid就是检验的结果
      request.request({
        url: '/user',
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
  state.form = JSON.parse(JSON.stringify(raw));
  dialogFormVisible.value=true
  ruleFormRef.value.resetFields()


}
//删除
const del = (id) => {
  request.delete('/user/'+ id).then(res => {
        if (res.code === '200') {
          ElMessage.success("操作成功")
          load() //刷新表格数据
        } else {
          ElMessage.error(res.msg)
        }
      }
  )
}

</script>

<template>
  <div>
    <!--搜索-->
    <div>
      <el-input v-model="name" placeholder="请输入名称" style="width: 300px "/>
      <el-input v-model="address" placeholder="请输入地址" style="width: 300px;margin-left: 5px"/>

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
      <el-button type="success" style="margin-left: 5px" @click="handleAdd">
        <el-icon>
          <Plus/>
        </el-icon>
        <span style="vertical-align: middle">新增</span>
      </el-button>
    </div>
    <!--表格-->
    <div style="margin: 10px 0">
      <el-table :data="state.tableData" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
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
    <div style="margin: 10px 0">
      <el-pagination
          @current-change="currentChange"
          @size-change="sizeChange"
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          small
          background
          :page-sizes="[ 10 , 20 , 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
    <!--弹窗-->
      <el-dialog v-model="dialogFormVisible" title="用户信息" width="40%">
        <el-form :model="state.form" label-width="80px" style="padding: 0 20px"
                 ref="ruleFormRef"
                 :rules="rules">
          <el-form-item prop="username" label="用户名" >
            <el-input v-model="state.form.username" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="name" label="名称" >
            <el-input v-model="state.form.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input v-model="state.form.email" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="address" label="地址">
            <el-input type="textarea" v-model="state.form.address" autocomplete="off"/>
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
