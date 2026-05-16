<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStaffStore, PERMISSION_OPTIONS } from '../../stores/staff'

const store = useStaffStore()

const keyword = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const form = ref({
  id: '',
  name: '',
  phone: '',
  role: '',
  status: '在职',
  permissions: [],
})

const filtered = computed(() => {
  let list = [...store.staffList]
  const kw = keyword.value.trim()
  if (kw) {
    list = list.filter((s) => s.name.includes(kw) || s.phone.includes(kw) || s.role.includes(kw))
  }
  if (statusFilter.value) {
    list = list.filter((s) => s.status === statusFilter.value)
  }
  return list
})

const total = computed(() => filtered.value.length)

const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function onSearch() {
  page.value = 1
}

function permLabel(value) {
  return PERMISSION_OPTIONS.find((p) => p.value === value)?.label ?? value
}

function openAdd() {
  form.value = {
    id: '',
    name: '',
    phone: '',
    role: '店员',
    status: '在职',
    permissions: ['dashboard', 'order'],
  }
  dialogVisible.value = true
}

function openEdit(row) {
  form.value = {
    id: row.id,
    name: row.name,
    phone: row.phone,
    role: row.role,
    status: row.status,
    permissions: [...(row.permissions || [])],
  }
  dialogVisible.value = true
}

function save() {
  if (!form.value.name || !form.value.phone) {
    ElMessage.warning('请填写姓名与手机号')
    return
  }
  if (!form.value.permissions?.length) {
    ElMessage.warning('请至少勾选一个权限')
    return
  }
  if (form.value.id) {
    store.update(form.value.id, { ...form.value })
    ElMessage.success('已更新')
  } else {
    store.add({ ...form.value })
    ElMessage.success('已添加')
  }
  dialogVisible.value = false
  onSearch()
}

async function removeRow(row) {
  await ElMessageBox.confirm(`删除员工「${row.name}」？`, '确认', { type: 'warning' })
  store.remove(row.id)
  ElMessage.success('已删除')
  onSearch()
}
</script>

<template>
  <div class="page-card">
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="keyword"
          placeholder="搜索姓名 / 手机 / 岗位"
          clearable
          class="search-input"
          @keyup.enter="onSearch"
          @clear="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="在职状态" clearable style="width: 140px" @change="onSearch">
          <el-option label="在职" value="在职" />
          <el-option label="停用" value="停用" />
        </el-select>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
      <el-button type="primary" @click="openAdd">
        <el-icon class="mr"><Plus /></el-icon>
        新增员工
      </el-button>
    </div>

    <el-table :data="paged" border stripe class="data-table" empty-text="暂无员工">
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="role" label="岗位" width="120" />
      <el-table-column label="权限" min-width="220">
        <template #default="{ row }">
          <el-tag v-for="p in row.permissions" :key="p" size="small" class="perm-tag" effect="plain">
            {{ permLabel(p) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '在职' ? 'success' : 'info'" effect="plain">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right" align="center">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑员工权限' : '新增员工'" width="560px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="form.phone" maxlength="11" />
        </el-form-item>
        <el-form-item label="岗位">
          <el-input v-model="form.role" placeholder="如：洗护技师" />
        </el-form-item>
        <el-form-item label="在职状态">
          <el-radio-group v-model="form.status">
            <el-radio label="在职">在职</el-radio>
            <el-radio label="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="功能权限">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox v-for="opt in PERMISSION_OPTIONS" :key="opt.value" :label="opt.value" border>
              {{ opt.label }}
            </el-checkbox>
          </el-checkbox-group>
          <p class="form-tip">与左侧菜单模块对应，后续可对接后端 RBAC。</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid var(--bw-border);
  padding: 20px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 260px;
}

.data-table {
  width: 100%;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.perm-tag {
  margin-right: 6px;
  margin-bottom: 4px;
}

.form-tip {
  margin: 8px 0 0;
  font-size: 12px;
  color: #90a4ae;
}

.mr {
  margin-right: 4px;
}
</style>
