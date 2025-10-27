<!-- 为用户分配角色，享有角色权限 -->
<template>
  <panel-header/>
  <container-table
    v-bind="tableData"
    @edit="edit"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
  />
  <el-dialog 
    v-model="dialogVisible" 
    title="添加权限" 
    width="500" 
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left">
      <el-form-item label="手机号">
        <el-input v-model="formData.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="formData.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="name">
        <el-select v-model="formData.permissions_id">
          <el-option 
            v-for="option in roleList" 
            :key="option.id"
            :value="option.id" 
            :label="option.name" 
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { authAdmin, menuSelectList, updateUser } from '../../../api/index'
import { ref, reactive, onMounted } from 'vue'
import dayjs from 'dayjs'

const formRef = ref()

onMounted(async () => {
  try {
    await getSelectList()
    // 获取列表数据
    await getListData()
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})

const tableData = reactive({
  pageNum: 1,
  pageSize: 10,
  list: [],
  total: 0,
  tableHeader: [
    { label: '昵称', prop: 'name' },
    { label: '所属组别', prop: 'permission' },
    { label: '手机号', prop: 'mobile' },
    { label: '状态', prop: 'active' },
    { label: '创建时间', prop: 'create_time' }
  ]
})
async function getListData() {
  const res = await authAdmin({ pageNum: tableData.pageNum, pageSize: tableData.pageSize })
  if(res.code === 10000) {
    tableData.list = res.data.list.map(item => ({
      ...item,
      active: item.active ? '正常' : '失效',
      create_time: dayjs(item.create_time).format('YYYY-MM-DD'),
      permission: roleList.value.find(role => role.id === item.permissions_id).name
    }))
    tableData.total = res.data.total
  }
}

function handleSizeChange(val) {
  tableData.pageSize = val
  // 重新获取分页数据
  getListData()
}
function handleCurrentChange(val) {
  tableData.pageNum = val
  getListData()
}

const formData = reactive({         // form数据
  mobile: '',
  name: '',
  permissions_id: ''
})
const rules = {                     // 校验规则
  name: [{ required: true, message: '昵称不可为空', trigger: 'blur' }]
}

const dialogVisible = ref(false)      // 弹框的显示与隐藏
const roleList = ref([])
const handleClose = () => {         // 关闭弹框
  dialogVisible.value = false
  // 重置表单
  formRef.value.resetFields()
}
const edit = async ({ mobile, name, permissions_id }) => {      // 打开弹框，编辑权限
  // 因为这里不需要操作/读取dom，所以不需要nextTick
  dialogVisible.value = true
  Object.assign(formData, { mobile, name, permissions_id })
}
async function getSelectList() {
  try {
    const res = await menuSelectList()
    if(res.code === 10000) {
      roleList.value = res.data
    }
  } catch (error) {
    ElMessage.error('菜单权限获取失败')
  }
}

function submit(formEl) {
  if(!formEl) return
  formEl.validate(async (validate, field) => {
    if(!validate) {
      ElMessage.warning('请完善表单信息')
    }
    try {
      const res = await updateUser({ name: formData.name, permissions_id: formData.permissions_id })
      if(res.code === 10000) {
        ElMessage.success('提交成功')
        getListData()
        handleClose()
      }
    } catch (error) {
      ElMessage.error(error)
    }
  })
}

</script>
<style lang="less" scoped>
.container {
  padding: 10px;
  background-color: #fff;
}
.create-time {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>

