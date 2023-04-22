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
  form: {},
  treeData:[]
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
  request.post('/role/del/batch',idArr).then(res => {
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
const permissionTreeRef = ref()

const load = () => {
  request.get('/role/page', {
    params: {
      name: name.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value,

    }
  }).then(res => {
    state.tableData = res.data.records
    total.value = res.data.total
  })
  request.get('/permission/tree').then(res =>{
    state.treeData = res.data
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
    state.form = {}
  })


}
const rules = reactive({

  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
  ],
  flag: [
    { required: true, message: '请输入唯一标识', trigger: 'blur' },
  ]
})
// 保存
const save = () => {
  ruleFormRef.value.validate(valid => {   // valid就是校验的结果
    if (valid) {
      // 目前被选中的菜单节点
      let checkedKeys = permissionTreeRef.value.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      state.form.permissionIds = checkedKeys

      request.request({
        url: '/role',
        method: state.form.id ? 'put' : 'post',
        data: state.form
      }).then(res => {
        if (res.code === '200') {
          ElMessage.success('保存成功')
          dialogFormVisible.value = false
          load()  // 刷新表格数据
          if (state.form.flag === 'ADMIN') {
            logout()
          }
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}
//编辑
const handleEdit = (raw) => {
  dialogFormVisible.value = true
  nextTick(() => {
    ruleFormRef.value.resetFields()
    state.form = JSON.parse(JSON.stringify(raw))

    permissionTreeRef.value.setCheckedKeys([])  // 初始化，默认不选择任何节点
    raw.permissionIds.forEach(v => {
      permissionTreeRef.value.setChecked(v, true, false)  // 给权限树设置选中的节点
    })
  })
}
//删除
const del = (id) => {
  request.delete('/role/'+ id).then(res => {
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
  window.open(`http://${config.serverUrl}/role/export`)
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
          :action='`http://${config.serverUrl}/role/import`'
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
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="flag" label="唯一标识"></el-table-column>


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
      <el-dialog v-model="dialogFormVisible" title="信息" width="40%">
        <el-form :model="state.form" label-width="80px" style="padding: 0 20px"
                 ref="ruleFormRef"
                 :rules="rules" status-icon>

          <el-form-item prop="name" label="名称" >
                      <el-input v-model="state.form.name" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="flag" label="唯一标识" >
                      <el-input v-model="state.form.flag" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="权限" >
            <div style="width: 100%;border: 1px solid #ccc;border-radius: 5px;padding: 5px">
              <el-tree default-expand-all node-key = "id"  ref="permissionTreeRef" :data="state.treeData"
                       :props="{ label:'name',value:'id'}" show-checkbox>

              </el-tree>
            </div>
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
