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

const name = ref('')
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
  request.post('/dict/del/batch',idArr).then(res => {
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
  request.get('/dict/page', {
    params: {
      name: name.value,
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
  load()

}

// const currentChange = (num) => {
//   pageNum.value = num
//   load()
// }
// const sizeChange = (size) => {
//   pageSize.value = size
//   load()
// }

const dialogFormVisible = ref(false)



const ruleFormRef = ref()
//新增
const handleAdd = () => {
  dialogFormVisible.value = true
  nextTick(() => {
      ruleFormRef.value.resetFields()
      state.form = {}

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
        url: '/dict',
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
  request.delete('/dict/'+ id).then(res => {
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
  window.open(`http://${config.serverUrl}/dict/export`)
}


const userStore = useUserStore()
const token = userStore.getBearerToken

const handleImportSuccess = () => {
  //刷新表格
  load()
  ElMessage.success("导入成功")
}

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
          :action='`http://${config.serverUrl}/dict/import`'
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
      <el-table :data="state.tableData" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>

            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="code" label="编码"></el-table-column>
            <el-table-column prop="value" label="内容">
              <template #default="scope">
                <el-icon>
                  <component :is="scope.row.value" />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>


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
          @current-change="load"
          @size-change="load"
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
      <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
        <el-form :model="state.form" label-width="80px" style="padding: 0 20px"
                 ref="ruleFormRef"
                 :rules="rules" status-icon>

          <el-form-item prop="code" label="编码" >
                      <el-input v-model="state.form.code" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="value" label="内容" >
                      <el-input v-model="state.form.value" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="type" label="类型" >
            <el-select v-model="state.form.type" style="width: 100%">
              <el-option v-for="item in ['icon']" :key="item" :value="item">

              </el-option>
            </el-select>
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
