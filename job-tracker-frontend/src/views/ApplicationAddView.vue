<script setup>
import { ref, onMounted, onUnmounted, watch, onBeforeMount, defineProps, defineEmits, nextTick, computed, defineExpose } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addApplication, getAllStatus, getSpecificApp, updateApplication } from '@/utils/api'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import Pikaday from "pikaday";
import Swal from 'sweetalert2';

const props = defineProps({
  isModal: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
});

const emit = defineEmits(['close', 'success']);

const dateInputComponentRef = ref(null);
const router = useRouter();
const route = useRoute();
const id = ref(null);
const statusList = ref([]);
const data = ref(null);
const loading = ref(false);
const error = ref('');
let picker = ref(null);

const form = ref({
  position: '',
  company: '',
  date: '',
  statusId: '',
  channel: '',
  notes: ''
});

// *** เพิ่มตัวแปรสำหรับเก็บสถานะเริ่มต้นของฟอร์ม ***
const initialForm = ref(null);

// *** Computed Property เพื่อตรวจสอบว่าฟอร์มมีการเปลี่ยนแปลงหรือไม่ ***
const isFormChanged = computed(() => {
  if (!initialForm.value) return false; // ถ้ายังไม่มีค่าเริ่มต้น ถือว่ายังไม่เปลี่ยน (เช่น โหมดเพิ่ม)

  // เปรียบเทียบค่าแต่ละ field
  return (
    form.value.position !== initialForm.value.position ||
    form.value.company !== initialForm.value.company ||
    form.value.date !== initialForm.value.date ||
    form.value.statusId !== initialForm.value.statusId ||
    form.value.channel !== initialForm.value.channel ||
    form.value.notes !== initialForm.value.notes
  );
});

function validate() {
  if (!form.value.position || !form.value.company || !form.value.date || !form.value.statusId) {
    error.value = 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน';
    Swal.fire({
      icon: 'warning',
      title: 'ข้อมูลไม่ครบถ้วน',
      text: error.value,
      confirmButtonText: 'ตกลง'
    });
    return false;
  }
  error.value = '';
  return true;
}

const createPikaday = () => {
  if (picker.value) {
    picker.value.destroy();
    picker.value = null;
  }
  if (dateInputComponentRef.value && dateInputComponentRef.value.inputElement) {
    picker.value = new Pikaday({
      field: dateInputComponentRef.value.inputElement,
      format: 'DD/MM/YYYY',
      toString(date, format) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      onSelect: function (date) {
        if (date instanceof Date && !isNaN(date)) {
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          form.value.date = `${year}-${month}-${day}`;
        } else {
          form.value.date = '';
        }
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
    if (form.value.date) {
      try {
        const [year, month, day] = form.value.date.split('-').map(Number);
        picker.value.setDate(new Date(year, month - 1, day));
      } catch (e) {
        // Error setting Pikaday date
      }
    }
  }
};

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      await nextTick();
      createPikaday();
    } else {
      if (picker.value) {
        picker.value.destroy();
        picker.value = null;
      }
    }
  }
);

onBeforeMount(async () => {
  try {
    statusList.value = await getAllStatus();

    if (route.name === 'application-edit') {
      id.value = route.params.id;
      data.value = await getSpecificApp(id.value);

      form.value.position = data.value.jobTitle;
      form.value.company = data.value.companyName;
      form.value.date = data.value.appliedDate;
      form.value.statusId = data.value.statusId;
      form.value.channel = data.value.channel;
      form.value.notes = data.value.notes;

      // *** หลังจากโหลดข้อมูลแล้ว ให้เก็บสถานะเริ่มต้นไว้ ***
      initialForm.value = { ...form.value }; // ใช้ spread operator เพื่อสร้าง deep copy (สำหรับ primitive types)
    } else {
      // ในโหมดเพิ่มข้อมูล, ฟอร์มจะถือว่ามีการเปลี่ยนแปลงเสมอ (เริ่มต้นจากค่าว่าง)
      initialForm.value = { ...form.value }; // ตั้งค่าเริ่มต้นเป็นค่าว่าง
    }
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: `ไม่สามารถโหลดข้อมูลได้: ${e.message}`,
      confirmButtonText: 'ตกลง'
    });
    console.error("Error loading initial data:", e);
  }
});

onMounted(async () => {
  await nextTick();
  createPikaday();
});

onUnmounted(() => {
  if (picker.value) {
    picker.value.destroy();
    picker.value = null;
  }
});

async function handleSubmit() {
  if (!validate()) return;
  const actionType = route.name === 'application-edit' ? 'แก้ไข' : 'เพิ่ม';
  const confirmText = `คุณต้องการ${actionType}ข้อมูลใบสมัครนี้ใช่หรือไม่?`;
  const confirmButtonText = `ใช่, ${actionType}เลย!`;
  const result = await Swal.fire({
    title: 'ยืนยันการบันทึกข้อมูล?',
    text: confirmText,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'ยกเลิก'
  });
  if (!result.isConfirmed) {
    Swal.fire(
      'ยกเลิก',
      'การบันทึกข้อมูลถูกยกเลิก.',
      'info'
    );
    return;
  }
  loading.value = true;
  error.value = '';
  const minTime = 850;
  const start = Date.now();
  try {
    let responseData;
    if (route.name === 'application-edit') {
      responseData = await updateApplication(id.value, {
        jobTitle: form.value.position,
        companyName: form.value.company,
        appliedDate: form.value.date,
        statusId: form.value.statusId,
        channel: form.value.channel,
        notes: form.value.notes
      });
    } else {
      responseData = await addApplication({
        jobTitle: form.value.position,
        companyName: form.value.company,
        appliedDate: form.value.date,
        statusId: form.value.statusId,
        channel: form.value.channel,
        notes: form.value.notes
      });
    }
    const elapsed = Date.now() - start;
    if (elapsed < minTime) {
      await new Promise(res => setTimeout(res, minTime - elapsed));
    }
    await Swal.fire({
      icon: 'success',
      title: 'สำเร็จ!',
      text: `บันทึกข้อมูลใบสมัครงานเรียบร้อยแล้ว.`,
      showConfirmButton: false,
      timer: 1500
    });
    if (props.isModal) {
      emit('success');
    } else {
      router.push({ name: 'applications' });
    }
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: `เกิดข้อผิดพลาดในการบันทึก: ${e.message || 'กรุณาลองใหม่'}`,
      confirmButtonText: 'ตกลง'
    });
  } finally {
    loading.value = false;
  }
}

watch(form, (newForm) => {
  // Removed debug log
}, { deep: true });

function handleCancel() {
  if (props.isModal) {
    emit('close');
  } else {
    router.back();
  }
}

const inputRef = ref(null)
defineExpose({ inputRef })
</script>

<template>
  <div class="create-app-container max-w-2xl w-full h-auto mx-auto bg-base-300 rounded-xl shadow-lg p-8 mt-10 relative">
    <h1 class="text-2xl font-bold mb-6 text-center">
      {{ route.name === 'application-edit' ? 'แก้ไขใบสมัครงาน' : 'เพิ่มใบสมัครงานใหม่' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="!space-y-10 !pt-5"
      :class="{ 'opacity-60 pointer-events-none': loading }">
      <div class="grid grid-cols-1 md:grid-cols-2 !gap-10">
        <BaseInput v-model="form.company" label="บริษัท" required class="text-base h-12" placeholder="กรอกชื่อบริษัท" />
        <BaseInput v-model="form.position" label="ตำแหน่งงาน" required class="text-base h-12"
          placeholder="กรอกตำแหน่งงานที่สมัคร" />

        <BaseInput ref="dateInputComponentRef" v-model="form.date" label="วันที่สมัคร" :required="true"
          placeholder="เลือกวันที่" :readonly="true" class="text-base h-12" />

        <BaseInput v-model="form.channel" label="ช่องทางที่สมัคร" class="text-base h-12"
          placeholder="กรอกช่องทางที่สมัคร" />

        <div class="md:col-span-2">
          <fieldset class="fieldset border border-base-200 rounded-lg">
            <legend class="fieldset-legend font-medium text-base pb-2">สถานะการสมัคร <span class="text-red-500">*</span>
            </legend>
            <select v-model="form.statusId" required
              class="select select-bordered w-full text-base h-12 px-4 py-3 !p-2">
              <option disabled selected value="">เลือกสถานะ</option>
              <option v-for="status in statusList" :key="status.id" :value="status.id">{{ status.label }}</option>
            </select>
          </fieldset>
        </div>

        <div class="md:col-span-2">
          <label class="block mb-1 font-medium text-base">หมายเหตุเพิ่มเติม</label>
          <textarea v-model="form.notes" class="textarea textarea-bordered w-full text-base min-h-[48px] px-4 py-3 !p-2"
            rows="3" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"></textarea>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-3 mt-6 justify-center">
        <BaseButton type="submit" :disabled="loading || !isFormChanged"
          :class="{ 'btn-disabled': !isFormChanged && !loading }" class="btn btn-primary text-white">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
        </BaseButton>

        <BaseButton type="button" @click="handleCancel" secondary :disabled="loading" class="btn btn-ghost">
          ยกเลิก
        </BaseButton>
      </div>
    </form>

    <transition name="fade">
      <div v-if="loading" class="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
        <div class="w-full backdrop-blur-md bg-white/70 shadow-lg border-b border-emerald-200">
          <div class="progress progress-primary w-full h-2"></div>
        </div>
        <div class="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-b-xl shadow-md mt-0.5">
          <svg class="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span class="text-emerald-700 font-medium tracking-wide"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
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
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>