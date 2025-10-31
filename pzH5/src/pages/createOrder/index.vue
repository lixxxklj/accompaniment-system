<template>
  <van-nav-bar title="填写服务订单" left-arrow @click-left="onClickLeft" />
  <div class="steps">
    <van-progress :percentage="perMap[active]" stroke-width="14" :show-pivot="false" track-color="#fff" color="#51ac98" />
    <div class="steps-title">
      <span>填写订单</span>
      <span>在线支付</span>
      <span>专人服务</span>
      <span>服务完成</span>
    </div>
  </div>
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
        <van-field 
          v-model="formData.hospital_name" 
          is-link
          label="就诊医院" 
          placeholder="武汉中心医院"
          :rules="[{ required: true, message: '请选择就诊医院' }]" 
          @click="hospitalPicker = true"
        />
        <van-field 
          v-model="selectDate" 
          is-link
          label="就诊时间" 
          placeholder="请选择就诊时间"
          :rules="[{ required: true, message: '请选择就诊时间' }]" 
          @click="timePicker = true"
        />
        <van-field 
          v-model="companion_name" 
          is-link
          label="陪诊师" 
          placeholder="请选择陪诊师"
          :rules="[{ required: true, message: '请选择陪诊师' }]" 
          @click="companionPicker = true"
        />
        <van-field v-model="formData.receiveAddress" label="接送地址" placeholder="请填写就诊人地址"
          :rules="[{ required: true, message: '请填写就诊人地址' }]" />
        <van-field 
          v-model="formData.tel"
          label="联系电话" 
          placeholder="请填写您的联系电话"
          :rules="[{ required: true, message: '请填写您的联系电话' }]" 
        />
      </van-cell-group>
      <van-cell-group title="服务需求">
        <van-field 
          v-model="formData.demand" 
          rows="2"
          type="textarea"
          name="demand" 
          placeholder="请简单描述您要就诊科室..." 
          input-align="left"
        />
      </van-cell-group>
      <div style="margin: 36px 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <van-popup v-model:show="hospitalPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="hospitals"
        @confirm="hospitalConfirm"
        @cancel="hospitalPicker = false"
      />
    </van-popup>
    <van-popup v-model:show="timePicker" destroy-on-close position="bottom">
      <van-date-picker
        :min-date="minDate"
        @confirm="timeConfirm"
        @cancel="timePicker = false"
      />
    </van-popup>
    <van-popup v-model:show="companionPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="companion"
        @confirm="companionConfirm"
        @cancel="companionPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, getCurrentInstance, reactive, ref, computed } from 'vue'

const router = useRouter()
const { proxy } = getCurrentInstance()

const companion = ref([])
const hospitals = ref([])
const service = reactive({})
const active = ref(0)
const perMap = [20, 45, 70, 100]

const hospitalPicker = ref(false)
const timePicker = ref(false)
const companionPicker = ref(false)
const addressPicker = ref(false)

const formData = reactive({})
const selectDate = ref('')
const companion_name = ref('')

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

// 选择医院
const hospitalConfirm = ({ selectedOptions }) => {
  // console.log(item)
  hospitalPicker.value = false
  formData.hospital_id = selectedOptions[0]?.value
  formData.hospital_name = selectedOptions[0]?.text
}

// 日期从今天开始选
const minDate = computed(() => new Date())
// 选择时间
const timeConfirm = ({ selectedValues }) => {
  selectDate.value = selectedValues.join('-')
  // 获取选中时间的时间戳
  // formData.starttime = new Date(selectDate.value).getTime()
  formData.starttime = selectDate.value
  timePicker.value = false
}

// 选择陪诊师
const companionConfirm = ({ selectedOptions }) => {
  formData.companion_id = selectedOptions[0]?.value
  companion_name.value = selectedOptions[0]?.text
  companionPicker.value = false
}

const onSubmit = () => {}
</script>

<style lang="less" scoped>
::v-deep(.van-progress .van-progress__portion) {
  height: 65%;
  top: 50%;
  transform: translate(0, -50%);
}

::v-deep(.van-cell__title) {
  display: flex;
  align-items: center;
  gap: 10px;
}

.steps {
  background: linear-gradient(135deg, #5ab78b 0%, #55b7b7 100%);
  padding: 20px 15px;

  .steps-title {
    display: flex;
    justify-content: space-around;
    color: #fff;
    margin-top: 15px;
  }
}

.content {
  background-color: #f5f5f5;
  padding: 5px 8px;
}
</style>