<!-- 配置权限：添加角色权限 -->
<template>
  <panel-header 
    title="菜单管理" 
    describe="菜单规则通常对应一个控制器的方法，同时菜单栏数据也从规则中获取"
  />
  <div class="container">
    <el-button type="primary" icon="Plus" size="small" @click="addMenu">新增</el-button>
    <el-table :data="menuData.list">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="permissionName" label="权限" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="editMenu(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      layout="total, prev, pager, next"
      :total="menuData.total"
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="justify-content: end;"
    />
  </div>
  <el-dialog 
    v-model="dialogVisible" 
    title="添加权限" 
    width="500" 
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef"
          style="max-width: 600px"
          :data="permissionsData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2]"
          :default-checked-keys="defaultCheckedKeys"
          :props="{ children: 'children', label: 'label'}"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit(formRef)">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { userGetMenu, menuList, userSetMenu } from '../../api/index'
import { ref, reactive, onMounted, nextTick } from 'vue'

const defaultCheckedKeys = ref([4, 5])
const treeRef = ref()
const formRef = ref()

onMounted(async () => {
  try {
    // 获取列表数据
    await getMenuData()
    // 获取菜单列表
    await getMenu()
  } catch (error) {
    console.error('获取数据失败:', error)
  }
})

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
})
const menuData = reactive({
  list: [],
  total: 0
})
async function getMenuData() {
  const res = await menuList(paginationData)
  if(res.code === 10000) {
    menuData.list = res.data.list
    menuData.total = res.data.total
  }
}

function handleSizeChange(val) {
  paginationData.pageSize = val
}
function handleCurrentChange(val) {
  paginationData.pageNum = val
}

const formData = reactive({         // form数据
  id: '',
  name: '',
  permissions: ''
})
const rules = {                     // 校验规则
  name: [{ required: true, message: '名称不可为空', trigger: 'blur' }]
}

const dialogVisible = ref(false)      // 弹框的显示与隐藏
const permissionsData = ref([])
const handleClose = () => {         // 关闭弹框
  dialogVisible.value = false
  // 重置表单和默认选中的树节点
  formRef.value.resetFields()
  treeRef.value.setCheckedKeys(defaultCheckedKeys.value)
}
const addMenu = async () => {       // 打开弹框，添加权限
  dialogVisible.value = true
}
const editMenu = async ({ id, name, permission }) => {      // 打开弹框，编辑权限
  dialogVisible.value = true
  await nextTick()
  Object.assign(formData, { id, name, permission })
  treeRef.value.setCheckedKeys(permission)
}
async function getMenu() {
  const res = await userGetMenu()
  permissionsData.value = res.data
}

function submit(formEl) {
  if(!formEl) return
  formEl.validate(async (validate, field) => {
    if(!validate) {
      ElMessage.warning('请完善表单信息')
    }
    // 提交
    try {
      const data = {
        ...formData,
        permissions: JSON.stringify(treeRef.value.getCheckedKeys())   // 转换为字符串
      }
      const res = await userSetMenu(data)
      if(res.code === 10000) {
        ElMessage.success('提交成功')
        getMenuData()
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
</style>

