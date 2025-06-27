<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { addApplication, getAllStatus } from '@/utils/api'

import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import Pikaday from "pikaday";

const myDatepicker = ref(null);
const router = useRouter()

const statusList = ref([])

const form = ref({
  position: '',
  company: '',
  date: '',
  statusId: '',
  channel: '',
  notes: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
let picker = ref()

function validate() {
  if (!form.value.position || !form.value.company || !form.value.date || !form.value.statusId) {
    error.value = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'
    return false
  }
  error.value = ''
  return true
}

onMounted(async () => {
  statusList.value = await getAllStatus()
  picker = new Pikaday({
    field: myDatepicker.value,
    format: 'DD/MM/YYYY',
    // ฟังก์ชันสำหรับกำหนดฟอร์แมตที่แสดงใน input
    toString(date, format) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    // เมื่อเลือกวันที่แล้วให้อัปเดต form.date
    onSelect: function (date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      form.value.date = `${year}-${month}-${day}`; // เก็บเป็น YYYY-MM-DD สำหรับ API
    },
    i18n: {
      previousMonth: 'เดือนก่อน',
      nextMonth: 'เดือนถัดไป',
      months: [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ],
      weekdays: [
        'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
      ],
      weekdaysShort: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    }
  });
});

onUnmounted(() => {
  if (picker) {
    picker.destroy();
  }
});

async function handleSubmit() {
  if (!validate()) return
  loading.value = true
  error.value = ''
  const minTime = 850 // ms
  const start = Date.now()
  try {
    await addApplication({
      jobTitle: form.value.position,
      companyName: form.value.company,
      appliedDate: form.value.date, // ใช้ form.value.date แทน picker.value
      statusId: form.value.statusId,
      channel: form.value.channel,
      notes: form.value.notes
    })
    success.value = true
    const elapsed = Date.now() - start
    if (elapsed < minTime) {
      await new Promise(res => setTimeout(res, minTime - elapsed))
    }
    router.push({ name: 'applications' })
  } catch (e) {
    error.value = 'เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่'
  } finally {
    loading.value = false
  }
}

watch(form, (newForm, oldForm) => {
  console.log('Form changed:', newForm)
  console.log('Old form:', oldForm)
}, { deep: true })

function handleCancel() {
  router.back()
}

</script>

<template>
  <div class="create-app-container max-w-2xl w-full h-auto mx-auto bg-base-300 rounded-xl shadow-lg p-8 mt-10 relative">
    <h1 class="text-2xl font-bold mb-6 text-center">เพิ่มใบสมัครงานใหม่</h1>
    
    <!-- Form Content -->
    <form @submit.prevent="handleSubmit" class="!space-y-10 !pt-5" :class="{ 'opacity-60 pointer-events-none': loading }">
      <div class="grid grid-cols-1 md:grid-cols-2 !gap-10">
        <BaseInput v-model="form.company" label="บริษัท" required class="text-base h-12" placeholder="กรอกชื่อบริษัท" />
        <BaseInput v-model="form.position" label="ตำแหน่งงาน" required autofocus class="text-base h-12"
          placeholder="กรอกตำแหน่งงานที่สมัคร" />
        
        <div class="flex flex-col">
          <legend class="fieldset-legend font-medium text-base pb-2">
            วันที่สมัคร <span class="text-red-500">*</span>
          </legend>
          <input type="text" class="input pika-single" ref="myDatepicker" placeholder="เลือกวันที่" readonly />
        </div>

        <BaseInput v-model="form.channel" label="ช่องทางที่สมัคร" class="text-base h-12"
          placeholder="กรอกช่องทางที่สมัคร" />
        
        <div class="md:col-span-2">
          <fieldset class="fieldset border border-base-200 rounded-lg">
            <legend class="fieldset-legend font-medium text-base pb-2">สถานะการสมัคร <span class="text-red-500">*</span></legend>
            <select v-model="form.statusId" required class="select select-bordered w-full text-base h-12 px-4 py-3">
              <option value="">เลือกสถานะ</option>
              <option v-for="status in statusList" :key="status.id" :value="status.id">{{ status.label }}</option>
            </select>
          </fieldset>
        </div>
        
        <div class="md:col-span-2">
          <label class="block mb-1 font-medium text-base">หมายเหตุเพิ่มเติม</label>
          <textarea v-model="form.notes" class="textarea textarea-bordered w-full text-base min-h-[48px] px-4 py-3"
            rows="3" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"></textarea>
        </div>
      </div>
      
      <!-- Error & Success Messages -->
      <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>
      <div v-if="success" class="text-green-600 text-sm text-center">บันทึกสำเร็จ! กำลังกลับไปหน้ารายการ...</div>
      
      <!-- Buttons -->
      <div class="flex flex-col md:flex-row gap-3 mt-6 justify-center">
        <BaseButton type="submit" :disabled="loading" class="relative">
          {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
        </BaseButton>
        
        <BaseButton type="button" @click="handleCancel" secondary :disabled="loading">
          ยกเลิก
        </BaseButton>
      </div>
    </form>

    <!-- Enhanced Progress Bar Loading (Top) -->
    <transition name="fade">
      <div v-if="loading" class="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
        <div class="w-full backdrop-blur-md bg-white/70 shadow-lg border-b border-emerald-200">
          <div class="progress progress-primary w-full h-2"></div>
        </div>
        <div class="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-b-xl shadow-md mt-0.5">
          <svg class="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
          <span class="text-emerald-700 font-medium tracking-wide"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.create-app-container {
  border-radius: 1.25rem;
  box-shadow: 0 4px 24px 0 rgba(16, 185, 129, 0.10);
  padding: 2.5rem 1.5rem;
  margin: 0 auto;
}

/* Custom progress animation */
.progress {
  height: 4px;
  background: #e5e7eb;
}

.progress-primary {
  background: linear-gradient(90deg, #10b981, #059669);
  animation: progress-loading 2s ease-in-out infinite;
}

@keyframes progress-loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>