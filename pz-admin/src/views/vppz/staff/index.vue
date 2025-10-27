<template>
  <panel-header />
  <container-table
    v-bind="tableData"
    @edit="edit"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
    @handleSelectionChange="handleSelectionChange"
  >
    <template #btn>
      <el-button type="primary" icon="Plus" size="small" @click="add">新增</el-button>
      <el-button type="danger" icon="Delete" size="small" @click="remove" :disabled="selectItems.length === 0">删除</el-button>
    </template>
    <template #select>
      <el-table-column type="selection" width="55" />
    </template>
  </container-table>
  <el-dialog
    v-model="dialogVisible"
    title="陪护师" 
    width="500" 
    :before-close="handleClose"
  >
    <el-form :rules="rules" ref="formRef" :model="formData" label-width="120px" label-position="right">
      <el-form-item label="昵称：" prop="name">
        <el-input v-model="formData.name" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像：" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
          accept=".jpg,.jpeg,.png,.gif"
        >
          <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          <!-- <template #tip>
            <span class="tip">
              jpg/png/gif，不大于2MB
            </span>
          </template> -->
        </el-upload>
      </el-form-item>
      <el-form-item label="性别：" prop="sex">
        <el-select v-model="formData.sex" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
          <el-option label="保密" value="保密" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄：">
        <el-input-number v-model="formData.age" :min="18" :max="55" @change="handleChange" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效：">
        <el-radio-group v-model="formData.active">
          <el-radio :value="1">生效</el-radio>
          <el-radio :value="0">失效</el-radio>
        </el-radio-group>
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
import { companionList, companion, deleteCompanion } from '../../../api/staff'
import { reactive, onMounted, ref } from 'vue'
import dayjs from 'dayjs';

onMounted(async () => {
  await getListData()
})

const tableData = reactive({
  pageNum: 1,
  pageSize: 10,
  list: [],
  total: 0,
  tableHeader: [
    { label: '昵称', prop: 'name' },
    { label: '头像', prop: 'avatar' },
    { label: '性别', prop: 'sex' },
    { label: '手机号', prop: 'mobile' },
    { label: '状态', prop: 'active' },
    { label: '创建时间', prop: 'create_time' },
  ]
})
async function getListData() {
  try {
    const res = await companionList({ pageSize: tableData.pageSize, pageNum: tableData.pageNum })
    if(res.code === 10000) {
      tableData.list = res.data.list.map(item => ({
        ...item,
        create_time: dayjs(item.create_time).format('YYYY-MM-DD'),
        avatar: 'http://159.75.169.224:5500/avatar.jpeg'
      }))
    }
  } catch (error) {
    ElMessage.error('获取列表数据失败')
  }
}
function handleSizeChange(val) {
  tableData.pageSize = val
  getListData()
}
function handleCurrentChange(val) {
  tableData.pageNum = val
  getListData()
}

let dialogVisible = ref(false)
function handleClose() {
  dialogVisible.value = false
  Object.assign(formData, {
    id: '',
    name: '',
    avatar: '',
    sex: '',
    age: 28,
    mobile: '',
    active: 1
  })
}

const formData = reactive({
  id: '',
  name: '',
  avatar: '',
  sex: '',
  age: 28,
  mobile: '',
  active: 1
})
const rules = {
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'change' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
}
const formRef = ref()
// 头像上传前的验证
function beforeUpload(file) {
  // console.log(file)
  const jsJPGORPNG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLast2M = file.size / 1024 / 1024 < 2
  if(!jsJPGORPNG) {
    ElMessage.error('请注意上传的头像格式')
    return false
  }
  if (!isLast2M) {
    ElMessage.error('头像大小不能超过2MB')
    return false
  }
  return true
}
const uploadToImageHost = async (file) => {
  const formData = new FormData()
  formData.append('smfile', file)
  try {
    const response = await fetch('https://sm.ms/api/v2/upload', {
      method: 'POST',
      body: formData
    })
    const result = await response.json()
    if (result.success) {
      return result.data.url
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('图床上传失败:', error)
    throw error
  }
}
// 头像处理：使用外部图床服务
async function handleUpload(options) {
  const { file } = options
  try {
    const imageUrl = await uploadToImageHost(file)
    formData.avatar = imageUrl
  } catch (error) {
    ElMessage.error('头像上传失败: ' + error.message)
  }

  /* 
  上传 -> 转换为Base64，但是后端提供的avatar放不下那么多的数值，改用上面的方法
  const reader = new FileReader()
  // 文件读取成功时的回调函数
  reader.onload = (e) => {
    // e.target.result 包含文件的 Base64 数据URL
    formData.avatar = e.target.result
    ElMessage('头像上传成功') 
  }
  // 文件读取失败时的回调函数
  reader.onerror = () => {
    ElMessage('头像读取失败')
  }
  // 开始读取文件，转换为 Data URL（Base64格式）
  reader.readAsDataURL(file)
  
  */
}
function handleChange(val) {
  formData.age = val
}
function add() {
  dialogVisible.value = true
  formData.avatar = 'http://159.75.169.224:5500/avatar.jpeg'
}
function edit(item) {
  dialogVisible.value = true
  Object.assign(formData, { ...item })
}

function submit(formEl) {
  if(!formEl) return
  formEl.validate(async (validate, field) => {
    if(!validate) {
      ElMessage.warning('请完善表单信息')
    }
    try {
      const res = await companion({ ...formData, avatar: 'http://159.75.169.224:5500/avatar.jpeg' })
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

const selectItems = ref([])
const handleSelectionChange = (list) => {
  // console.log(val)
  selectItems.value = list.map(item => ({ id: item.id }))
}
function remove() {
  ElMessageBox.confirm('确定删除？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteCompanion({ id: selectItems.value })
    if(res.code === 10000) {
      ElMessage.success('删除成功')
      getListData()
    }
  }).catch(() => {
    ElMessage.info('您已取消')
  })
}
</script>
<style lang="less" scoped>
:deep(.el-form-item--label-right .el-form-item__label) {
  align-items: center;
  height: auto;
}
.avatar-uploader {
  .avatar {
    width: 64px;
    height: 64px;
    display: block;
  }
  .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .el-icon.avatar-uploader-icon {
    border: 1px dashed #CDD0D6;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 64px;
    height: 64px;
    text-align: center;
    &:hover {
      border-color: #409EFF;
    }
  }
}
.tip {
  font-size: 9px;
  color: #606266;
  height: 10px;
  line-height: 10px
}
</style>

