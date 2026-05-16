<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '../../stores/order'
import {
  ORDER_STATUS_OPTIONS,
  WASH_SERVICE_OPTIONS,
} from '../../constants/order'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode: { type: String, default: 'add' }, // add | edit
  orderId: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const orderStore = useOrderStore()
const formRef = ref()
const fileList = ref([])

const emptyForm = () => ({
  customerName: '',
  phone: '',
  wechatNote: '',
  brand: '',
  style: '',
  color: '',
  material: '',
  defectDesc: '',
  defectImages: [],
  washServices: [],
  orderTime: '',
  expectPickupTime: '',
  amount: 0,
  prepay: 0,
  remark: '',
  status: 'pending_receive',
})

const form = ref(emptyForm())

const title = computed(() => (props.mode === 'edit' ? '编辑订单' : '新增订单'))

const rules = {
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入包包品牌', trigger: 'blur' }],
  style: [{ required: true, message: '请输入包包款式', trigger: 'blur' }],
  color: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  material: [{ required: true, message: '请输入材质', trigger: 'blur' }],
  defectDesc: [{ required: true, message: '请填写到店瑕疵描述', trigger: 'blur' }],
  washServices: [{ type: 'array', required: true, message: '请选择洗护项目', trigger: 'change' }],
  orderTime: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
  expectPickupTime: [{ required: true, message: '请选择预计取件时间', trigger: 'change' }],
  amount: [{ required: true, message: '请输入订单金额', trigger: 'blur' }],
  prepay: [{ required: true, message: '请输入预付款', trigger: 'blur' }],
  status: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    if (props.mode === 'edit' && props.orderId) {
      const row = orderStore.getById(props.orderId)
      if (row) {
        form.value = {
          customerName: row.customerName,
          phone: row.phone,
          wechatNote: row.wechatNote ?? '',
          brand: row.brand,
          style: row.style,
          color: row.color,
          material: row.material,
          defectDesc: row.defectDesc,
          defectImages: [...(row.defectImages || [])],
          washServices: [...(row.washServices || [])],
          orderTime: row.orderTime,
          expectPickupTime: row.expectPickupTime,
          amount: row.amount,
          prepay: row.prepay,
          remark: row.remark ?? '',
          status: row.status,
        }
        fileList.value = (row.defectImages || []).map((url, i) => ({
          name: `瑕疵图${i + 1}`,
          url,
        }))
        return
      }
    }
    form.value = emptyForm()
    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    form.value.orderTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:00`
    const later = new Date(now.getTime() + 3 * 86400000)
    form.value.expectPickupTime = `${later.getFullYear()}-${pad(later.getMonth() + 1)}-${pad(later.getDate())} 18:00:00`
    fileList.value = []
  },
)

function syncImagesFromFileList() {
  form.value.defectImages = fileList.value.map((f) => f.url).filter(Boolean)
}

function handleRequest(options) {
  const raw = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    const url = e.target?.result
    fileList.value.push({
      name: raw.name,
      url,
    })
    syncImagesFromFileList()
    options.onSuccess?.({}, raw)
  }
  reader.onerror = () => {
    options.onError?.(new Error('read fail'))
  }
  reader.readAsDataURL(raw)
}

function handleRemove() {
  syncImagesFromFileList()
}

function handlePreview(file) {
  // Element Plus 默认预览；保留钩子便于扩展
  if (file.url) window.open(file.url, '_blank')
}

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  const valid = await formRef.value?.validate().then(() => true).catch(() => false)
  if (!valid) return
  syncImagesFromFileList()
  const payload = { ...form.value }
  if (props.mode === 'edit' && props.orderId) {
    orderStore.update(props.orderId, payload)
    ElMessage.success('订单已更新')
  } else {
    orderStore.add(payload)
    ElMessage.success('订单已创建')
  }
  emit('saved')
  close()
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    width="860px"
    align-center
    destroy-on-close
    class="order-form-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-scrollbar max-height="70vh">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="order-form">
        <div class="section-title">客户信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="客户姓名" prop="customerName">
              <el-input v-model="form.customerName" placeholder="客户姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="手机号" maxlength="11" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信备注" prop="wechatNote">
              <el-input v-model="form.wechatNote" placeholder="微信号 / 备注" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="section-title">包包信息</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="包包品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="品牌" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="包包款式" prop="style">
              <el-input v-model="form.style" placeholder="款式" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="颜色" prop="color">
              <el-input v-model="form.color" placeholder="颜色" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="材质" prop="material">
              <el-input v-model="form.material" placeholder="材质" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="section-title">瑕疵与图片</div>
        <el-form-item label="瑕疵描述" prop="defectDesc">
          <el-input v-model="form.defectDesc" type="textarea" :rows="3" placeholder="到店检查结果、瑕疵位置与程度" />
        </el-form-item>
        <el-form-item label="瑕疵图片">
          <el-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            :http-request="handleRequest"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
            accept="image/*"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <p class="upload-tip">支持多图，本地预览（不上传服务器）。可点击缩略图预览、删除。</p>
        </el-form-item>

        <div class="section-title">洗护与时间</div>
        <el-form-item label="洗护项目" prop="washServices">
          <el-checkbox-group v-model="form.washServices">
            <el-checkbox v-for="opt in WASH_SERVICE_OPTIONS" :key="opt.value" :label="opt.value" border>
              {{ opt.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="下单时间" prop="orderTime">
              <el-date-picker
                v-model="form.orderTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择下单时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计取件" prop="expectPickupTime">
              <el-date-picker
                v-model="form.expectPickupTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="预计取件时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <div class="section-title">金额与状态</div>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="订单金额" prop="amount">
              <el-input-number v-model="form.amount" :min="0" :step="10" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预付款" prop="prepay">
              <el-input-number v-model="form.prepay" :min="0" :step="10" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单状态" prop="status">
              <el-select v-model="form.status" placeholder="状态" style="width: 100%">
                <el-option v-for="o in ORDER_STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="内部备注、客户特殊要求等" />
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--bw-primary);
  margin: 4px 0 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e3f2fd;
}

.order-form :deep(.el-checkbox) {
  margin-right: 10px;
  margin-bottom: 8px;
}

.upload-tip {
  margin: 6px 0 0;
  font-size: 12px;
  color: #90a4ae;
}
</style>
