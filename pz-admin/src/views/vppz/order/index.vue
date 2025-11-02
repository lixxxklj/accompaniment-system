<template>
  <PanelHeader />
  <div class="container">
    <el-input v-model="searchVal" size="small" placeholder="订单号" class="query-input" />
    <el-button type="primary" size="small" @click="query">查询</el-button>
    <el-table :data="tableData.list">
      <el-table-column prop="out_trade_no" label="订单号" align="center" width="150" />
      <el-table-column prop="hospital_name" label="就诊医院" align="center" />
      <el-table-column prop="service_name" label="陪诊服务" align="center" />
      <el-table-column prop="avatar" label="陪护师" align="center">
        <template #default="scope">
          <img :src="scope.row.avatar" class="avatar">
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="陪护师手机号" align="center" width="120" />
      <el-table-column prop="price" label="总价" align="center" />
      <el-table-column prop="paidPrice" label="已付" align="center" />
      <el-table-column prop="order_time" label="下单时间" align="center" width="130">
        <template #default="scope">
          <div class="create-time">
            <el-icon><Clock /></el-icon>
            <span>{{ scope.row.order_time }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="订单状态" align="center">
        <template #default="scope">
          <el-tag :type="stateMap[scope.row.state]">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="service_state" label="接单状态" align="center" />
      <el-table-column prop="mobile" label="联系手机号" align="center" width="120" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.state === '待服务'" type="primary" link @click="edit(scope.row.out_trade_no)">服务完成</el-button>
          <el-button v-else link disabled>暂无服务</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      v-model:current-page="tableData.pageNum"
      :page-size="tableData.pageSize"
      layout="total, prev, pager, next"
      :total="tableData.total"
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="justify-content: end;"
    />
  </div>
</template>

<script setup>
import { adminOrder, updateOrder } from '../../../api/vppz'
import { reactive, onMounted, ref } from 'vue'
import dayjs from 'dayjs';

const searchVal = ref('')
const tableData = reactive({
  list: [],
  total: 0,
  pageNum: 1,
  pageSize: 10
})
const stateMap = {
  '已取消': 'info',
  '待服务': 'primary',
  '已完成': 'success',
}
onMounted(async () => {
  getListData()
})

// 获取订单列表
const getListData = async () => {
  const { data } = await adminOrder({
    pageNum: tableData.pageNum,
    pageSize: tableData.pageSize,
    out_trade_no: searchVal.value
  })
  tableData.list = data.list.map(item => ({
    ...item,
    avatar: item.companion.avatar,
    mobile: item.client.mobile,
    state: item.trade_state,
    // state: item.trade_state || '已完成',
    order_time: new dayjs(item.order_start_time).format('YYYY-MM-DD')
  }))
}

// 查询
const query = () => {
  getListData()
  searchVal.value = ''
}

const edit = (id) => {
  ElMessageBox.confirm(
    '该服务是否完成？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    const { code } = await updateOrder({ id })
    if(code === 10000) {
      getListData()
      ElMessage({
        type: 'success',
        message: '已完成',
      })
    }
  }).catch(() => {
    console.log('取消');
  })
}

function handleSizeChange(val) {
  tableData.pageSize = val
  getListData()
}
function handleCurrentChange(val) {
  tableData.pageNum = val
  getListData()
}
</script>

<style lang="less" scoped>
.container {
  padding: 10px;
  background-color: #fff;
}
.query-input {
  width: 160px;
  margin-right: 15px;
}
.create-time {
  display: flex;
  align-items: center;
  gap: 5px;
}
.avatar {
  height: 50px;
  width: 50px;
}
</style>

