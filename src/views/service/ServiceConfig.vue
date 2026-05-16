<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useServiceStore } from '../../stores/service'

const store = useServiceStore()

const keyword = ref('')
const enabledFilter = ref('')
const page = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const form = ref({
  id: '',
  name: '',
  price: 0,
  durationMin: 60,
  enabled: true,
  sort: 1,
})

const filtered = computed(() => {
  let list = [...store.services]
  if (keyword.value.trim()) {
    const kw = keyword.value.trim()
    list = list.filter((s) => s.name.includes(kw))
  }
  if (enabledFilter.value === '1') list = list.filter((s) => s.enabled)
  if (enabledFilter.value === '0') list = list.filter((s) => !s.enabled)
  list.sort((a, b) => a.sort - b.sort)
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

function openAdd() {
  form.value = {
    id: '',
    name: '',
    price: 199,
    durationMin: 120,
    enabled: true,
    sort: store.services.length + 1,
  }
  dialogVisible.value = true
}

function openEdit(row) {
  form.value = { ...row }
  dialogVisible.value = true
}

function save() {
  if (!form.value.name) {
    ElMessage.warning('请填写项目名称')
    return
  }
  store.save({ ...form.value })
  ElMessage.success('已保存')
  dialogVisible.value = false
  onSearch()
}

async function removeRow(row) {
  await ElMessageBox.confirm(`删除项目「${row.name}」？`, '确认', { type: 'warning' })
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
          placeholder="搜索项目名称"
          clearable
          class="search-input"
          @keyup.enter="onSearch"
          @clear="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="enabledFilter" placeholder="启用状态" clearable style="width: 140px" @change="onSearch">
          <el-option label="已启用" value="1" />
          <el-option label="已停用" value="0" />
        </el-select>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
      <el-button type="primary" @click="openAdd">
        <el-icon class="mr"><Plus /></el-icon>
        新增项目
      </el-button>
    </div>

    <el-table :data="paged" border stripe class="data-table" empty-text="暂无服务项目">
      <el-table-column prop="sort" label="排序" width="80" align="center" />
      <el-table-column prop="name" label="项目名称" min-width="140" />
      <el-table-column prop="price" label="标价（元）" width="120" align="right">
        <template #default="{ row }">¥ {{ row.price }}</template>
      </el-table-column>
      <el-table-column prop="durationMin" label="参考耗时（分钟）" width="160" align="center" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" effect="plain">{{ row.enabled ? '启用' : '停用' }}</el-tag>
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

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑服务' : '新增服务'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="120px">
        <el-form-item label="项目名称" required>
          <el-input v-model="form.name" placeholder="如：精洗" />
        </el-form-item>
        <el-form-item label="标价（元）">
          <el-input-number v-model="form.price" :min="0" :step="10" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="参考耗时（分）">
          <el-input-number v-model="form.durationMin" :min="15" :step="15" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="1" :step="1" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
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
  width: 220px;
}

.data-table {
  width: 100%;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.mr {
  margin-right: 4px;
}
</style>
