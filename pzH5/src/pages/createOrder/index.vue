<template>
  <van-nav-bar title="填写服务订单" left-arrow @click-left="onClickLeft" />
  <StepsBar :state="state" />
  <div class="content">
    <van-cell style="margin-bottom: 5px;">
      <template #title>
        <van-image :width="25" :height="25" :src="service.serviceImg" />
        <span>{{ service.serviceName }}</span>
      </template>
      <van-icon name="info-o" />
      <span>服务内容</span>
    </van-cell>
    <van-form @submit="onSubmit" input-align="right" error-message-align="right">
      <van-cell-group>
        <van-field v-model="formData.hospital_name" is-link label="就诊医院" placeholder="武汉中心医院"
          :rules="[{ required: true, message: '请选择就诊医院' }]" @click="hospitalPicker = true" />
        <van-field v-model="selectDate" is-link label="就诊时间" placeholder="请选择就诊时间"
          :rules="[{ required: true, message: '请选择就诊时间' }]" @click="timePicker = true" />
        <van-field v-model="companion_name" is-link label="陪诊师" placeholder="请选择陪诊师"
          :rules="[{ required: true, message: '请选择陪诊师' }]" @click="companionPicker = true" />
        <van-field v-model="formData.receiveAddress" label="接送地址" placeholder="请填写就诊人地址"
          :rules="[{ required: true, message: '请填写就诊人地址' }]" />
        <van-field v-model="formData.tel" label="联系电话" placeholder="请填写您的联系电话"
          :rules="[{ required: true, message: '请填写您的联系电话' }]" />
      </van-cell-group>
      <van-cell-group title="服务需求">
        <van-field v-model="formData.demand" rows="2" type="textarea" name="demand" placeholder="请简单描述您要就诊科室..."
          input-align="left" />
      </van-cell-group>
      <div style="margin: 36px 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <van-popup v-model:show="hospitalPicker" destroy-on-close position="bottom">
      <van-picker :columns="hospitals" @confirm="hospitalConfirm" @cancel="hospitalPicker = false" />
    </van-popup>
    <van-popup v-model:show="timePicker" destroy-on-close position="bottom">
      <van-date-picker :min-date="minDate" @confirm="timeConfirm" @cancel="timePicker = false" />
    </van-popup>
    <van-popup v-model:show="companionPicker" destroy-on-close position="bottom">
      <van-picker :columns="companion" @confirm="companionConfirm" @cancel="companionPicker = false" />
    </van-popup>
    <van-dialog v-model:show="showCode" show-cancel-button>
      <div style="font-weight: bold;">微信支付</div>
      <van-image :src="codeImg" width="150" height="150" />
    </van-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, getCurrentInstance, reactive, ref, computed } from 'vue'
import { showNotify } from 'vant'
import Qrcode from 'qrcode'
import StepsBar from '../../components/StepsBar.vue';

const router = useRouter()
const { proxy } = getCurrentInstance()

const companion = ref([])
const hospitals = ref([])
const service = reactive({})
const state = ref('创建订单')

const formData = reactive({})

onMounted(async () => {
  const { data } = await proxy.$api.h5Companion()
  hospitals.value = data.hospitals.map(item => ({ text: item.name, value: item.id }))
  companion.value = data.companion.map(item => ({ text: item.name, value: item.id }))
  Object.assign(service, data.service)
})

// 退回
const onClickLeft = () => {
  router.go(-1)
}

const hospitalPicker = ref(false)
// 选择医院
const hospitalConfirm = ({ selectedOptions }) => {
  // console.log(item)
  hospitalPicker.value = false
  formData.hospital_id = selectedOptions[0]?.value
  formData.hospital_name = selectedOptions[0]?.text
}

const timePicker = ref(false)
const selectDate = ref('')
// 日期从今天开始选
const minDate = computed(() => new Date())
// 选择时间
const timeConfirm = ({ selectedValues }) => {
  selectDate.value = selectedValues.join('-')
  // 获取选中时间的时间戳
  formData.starttime = new Date(selectDate.value).getTime()
  // formData.starttime = selectDate.value
  timePicker.value = false
}

const companionPicker = ref(false)
const companion_name = ref('')
// 选择陪诊师
const companionConfirm = ({ selectedOptions }) => {
  formData.companion_id = selectedOptions[0]?.value
  companion_name.value = selectedOptions[0]?.text
  companionPicker.value = false
}

const showCode = ref(false)
const codeImg = ref('')
const onSubmit = async () => {
  const params = ['companion_id', 'tel', 'hospital_id', 'hospital_name', 'demand', 'receiveAddress', 'starttime']
  for (const param of params) {
    if (!formData[param]) {
      showNotify({
        type: 'warning',
        message: '请完善表单信息'
      })
      return
    }
  }
  const res = await proxy.$api.createOrder(formData)
  if (res.code === 10000) {
    console.log(res.data.wx_code);
    Qrcode.toDataURL(res.data.wx_code).then(url => {
      console.log(url);
      showCode.value = true
      codeImg.value = url
    })
  }
}
</script>

<style lang="less" scoped>
::v-deep(.van-cell__title) {
  display: flex;
  align-items: center;
  gap: 10px;
}

::v-deep(.van-dialog__content) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.content {
  background-color: #f5f5f5;
  padding: 5px 8px;
  height: calc(100vh - 130px);
}
</style>