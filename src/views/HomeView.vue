<script setup>
import {
  Search,
  RefreshLeft,
  Plus
} from '@element-plus/icons-vue'
import {reactive, ref} from "vue";
import request from "@/utils/request";
const name = ref('')
const address = ref('')
const state = reactive({
  tableData: [
    {name: 'admin', address: '河北省邯郸市', phone:'15830912981'},
    {name: 'admin', address: '河北省邯郸市', phone:'15830912981'},
    {name: 'admin', address: '河北省邯郸市', phone:'15830912981'}

  ]
})
const multipleSelection = ref([])
const handleSelectionChange = (val)=> {
    multipleSelection.value= val
}
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const load = () => {
  request.get('/user/page',{
    params: {
      name: name.value,
      address: address.value,
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      total: total.value
    }
  }).then(res =>{
    state.tableData = res.data.records
    total.value = res.data.total
  })
}
load()//调用load方法拿到数据

</script>

<template>
  <div>
<!--搜索-->
    <div>
      <el-input v-model="name" placeholder="请输入名称" style="width: 300px "/>
      <el-input v-model="name" placeholder="请输入名称" style="width: 300px;margin-left: 5px" />
      <el-button type="primary" style="margin-left: 5px"><el-icon><Search /></el-icon>
        <span style="vertical-align: middle">搜索</span>
      </el-button>
      <el-button type="warning" style="margin-left: 5px"><el-icon><RefreshLeft /></el-icon>
        <span style="vertical-align: middle">重置</span>
      </el-button>
      <el-button type="success" style="margin-left: 5px"><el-icon><Plus /></el-icon>
        <span style="vertical-align: middle">新增</span>
      </el-button>
    </div>
<!--表格-->
    <div style="margin: 10px 0">
      <el-table :data="state.tableData" stripe border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column  label="操作" width="180">
          <template #default="scope">
            <el-button type="primary">编辑</el-button>
            <el-button type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
<!--分页-->
    <div style="margin: 10px 0">
      <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          small
          background
          :total="50"
          layout="total, sizes, prev, pager, next, jumper"
      />
    </div>




  </div>
</template>
