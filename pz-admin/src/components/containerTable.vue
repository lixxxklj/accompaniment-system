<!-- 为用户分配角色，享有角色权限 -->
<template>
  <div class="container">
    <slot name="btn" />
    <el-table :data="props.list">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <template v-for="item in props.tableHeader">
        <template v-if="item.prop === 'active'">
          <el-table-column prop="active" :label="item.label" align="center">
            <template #default="scope">
              <el-tag
                :type="scope.row.active === '正常' ? 'success' : 'warning'"
              >{{ scope.row.active }}</el-tag>
            </template>
          </el-table-column>
        </template>
        <template v-else-if="item.prop === 'create_time'">
          <el-table-column prop="create_time" :label="item.label" align="center">
            <template #default="scope">
              <div class="create-time">
                <el-icon><Clock /></el-icon>
                <span>{{ scope.row.create_time }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column :prop="item.prop" :label="item.label" align="center"></el-table-column>
        </template>
      </template>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      v-model:current-page="props.pageNum"
      :page-size="props.pageSize"
      layout="total, prev, pager, next"
      :total="props.total"
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="justify-content: end;"
    />
  </div>
</template>
<script setup>
const props = defineProps(['pageNum', 'pageSize', 'list', 'total', 'tableHeader'])
const emit = defineEmits(['edit', 'handleSizeChange', 'handleCurrentChange'])

function edit(item) {
  emit('edit', item)
}
function handleSizeChange(val) {
  emit('handleSizeChange', val)
}
function handleCurrentChange(val) {
  emit('handleCurrentChange', val)
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

