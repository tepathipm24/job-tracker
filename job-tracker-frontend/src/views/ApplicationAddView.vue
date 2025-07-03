<script setup>
import { ref, onMounted, onUnmounted, watch, onBeforeMount, defineProps, defineEmits, nextTick, computed, defineExpose } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { addApplication, getAllStatus, getSpecificApp, updateApplication } from '@/utils/api';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import Swal from 'sweetalert2';

const props = defineProps({
  isModal: { type: Boolean, default: false },
  visible: { type: Boolean, default: true },
});

const emit = defineEmits(['close', 'success']);

const attributes = computed(() => {
  if (form.value.appliedDate) {
    return [
      {
        highlight: true,
        dates: form.value.appliedDate,
      },
    ];
  }
  return [];
});

let isDark = ref(true)
const router = useRouter();
const route = useRoute();
const id = ref(null);
const statusList = ref([]);
const data = ref(null);
const loading = ref(false);
const error = ref('');

const form = ref({
  jobTitle: '',
  companyName: '',
  appliedDate: null,
  statusId: '',
  channel: '',
  notes: ''
});

const initialForm = ref(null);

const isFormChanged = computed(() => {
  if (!initialForm.value) return false;
  return (
    form.value.jobTitle !== initialForm.value.jobTitle ||
    form.value.companyName !== initialForm.value.companyName ||
    form.value.appliedDate?.toISOString() !== initialForm.value.appliedDate?.toISOString() ||
    form.value.statusId !== initialForm.value.statusId ||
    form.value.channel !== initialForm.value.channel ||
    form.value.notes !== initialForm.value.notes
  );
});

function validate() {
  if (!form.value.jobTitle || !form.value.companyName || !form.value.appliedDate || !form.value.statusId) {
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

const resetForm = () => {
  form.value = {
    jobTitle: '',
    companyName: '',
    appliedDate: null,
    statusId: '',
    channel: '',
    notes: ''
  };
  initialForm.value = { ...form.value };
};

const loadAndInit = async () => {
  loading.value = true;
  try {
    statusList.value = await getAllStatus();

    if (route.name === 'application-edit' && route.params.id) {
      id.value = route.params.id;
      data.value = await getSpecificApp(id.value);

      form.value.jobTitle = data.value.jobTitle;
      form.value.companyName = data.value.companyName;
      let parsedDate = null;
      if (data.value.appliedDate) {
        const dateObj = new Date(data.value.appliedDate);
        if (!isNaN(dateObj.getTime())) {
          parsedDate = dateObj;
        } else {
          console.warn("API returned an invalid date string:", data.value.appliedDate);
        }
      }
      form.value.appliedDate = parsedDate;
      form.value.statusId = data.value.statusId;
      form.value.channel = data.value.channel;
      form.value.notes = data.value.notes;

      initialForm.value = { ...form.value };
    } else {
      resetForm();
    }
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: `ไม่สามารถโหลดข้อมูลได้: ${e.message}`,
      confirmButtonText: 'ตกลง'
    });
    console.error("Error loading initial data or status:", e);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      await loadAndInit();
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

onBeforeMount(async () => {
  if (!props.isModal || (props.isModal && !props.visible)) {
    await loadAndInit();
  }
});

async function handleSubmit() {
  // ตรวจสอบความถูกต้องของข้อมูลก่อน
  if (!validate()) return;

  // เพิ่ม SweetAlert2 confirmation ก่อนที่จะบันทึก
  let confirmTitle = '';
  let confirmText = '';
  if (route.name === 'application-edit' && id.value) {
    confirmTitle = 'คุณต้องการบันทึกการแก้ไขนี้หรือไม่?';
    confirmText = 'การเปลี่ยนแปลงข้อมูลใบสมัครจะถูกบันทึก';
  } else {
    confirmTitle = 'คุณต้องการบันทึกใบสมัครใหม่นี้หรือไม่?';
    confirmText = 'ข้อมูลใบสมัครใหม่จะถูกเพิ่มเข้าสู่ระบบ';
  }

  const result = await Swal.fire({
    title: confirmTitle,
    text: confirmText,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6', // สีน้ำเงินสำหรับปุ่มยืนยัน
    cancelButtonColor: '#d33', // สีแดงสำหรับปุ่มยกเลิก
    confirmButtonText: 'ใช่, บันทึกเลย!',
    cancelButtonText: 'ไม่, ยกเลิก'
  });

  // ถ้าผู้ใช้กดยกเลิก ก็จะหยุดการทำงานของฟังก์ชัน
  if (!result.isConfirmed) {
    return;
  }

  // ดำเนินการบันทึกข้อมูลหากผู้ใช้ยืนยัน
  try {
    const payload = {
      companyName: form.value.companyName,
      jobTitle: form.value.jobTitle,
      appliedDate: form.value.appliedDate ? form.value.appliedDate.toISOString().split('T')[0] : null,
      statusId: Number(form.value.statusId),
      channel: form.value.channel,
      notes: form.value.notes
    };

    if (route.name === 'application-edit' && id.value) {
      await updateApplication(id.value, payload);
      Swal.fire({ icon: 'success', title: 'อัปเดตสำเร็จ', text: 'ข้อมูลใบสมัครถูกอัปเดตเรียบร้อยแล้ว', confirmButtonText: 'ตกลง' });
    } else {
      await addApplication(payload);
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'เพิ่มใบสมัครงานใหม่เรียบร้อยแล้ว', confirmButtonText: 'ตกลง' });
    }
    emit('success');
    handleCancel();
  } catch (e) {
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: `ไม่สามารถบันทึกข้อมูลได้: ${e.message}`,
      confirmButtonText: 'ตกลง'
    });
    console.error("Error saving application:", e);
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  emit('close');
  if (props.isModal) {
    router.push({ name: 'applications' });
  } else {
    router.back();
  }
}
</script>

<template>
  <div class="create-app-container max-w-2xl w-full h-auto mx-auto bg-base-300 rounded-xl shadow-lg p-8 mt-10 relative">
    <h1 class="text-2xl font-bold mb-6 text-center">
      {{ route.name === 'application-edit' ? 'แก้ไขใบสมัครงาน' : 'เพิ่มใบสมัครงานใหม่' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="!space-y-10 !pt-5"
      :class="{ 'opacity-60 pointer-events-none': loading }">
      <div class="grid grid-cols-1 md:grid-cols-2 !gap-10">
        <BaseInput v-model="form.companyName" label="บริษัท" required class="text-base h-12"
          placeholder="กรอกชื่อบริษัท" />
        <BaseInput v-model="form.jobTitle" label="ตำแหน่งงาน" required class="text-base h-12"
          placeholder="กรอกตำแหน่งงานที่สมัคร" />

        <div class="md:col-span-1">
          <VDatePicker
            :key="id"
            v-model="form.appliedDate"
            :masks="{ input: 'DD/MM/YYYY' }"
            :popover="{ visibility: 'click' }"
            :attributes="attributes"
            locale="th"
            color="blue"
            :is-dark="isDark"
            borderless
            is-required
            is-expanded="false"
          >
            <template #default="{ inputValue, inputEvents }">
              <BaseInput
                :model-value="inputValue"
                v-on="inputEvents"
                label="วันที่สมัคร"
                required
                class="text-base h-12"
                placeholder="เลือกวันที่"
                readonly
                style="cursor: pointer;"
              />
            </template>
          </VDatePicker>
        </div>

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

/* กำหนดสีตัวอักษรทั้งหมดให้เป็นสีขาว (หรือสีอ่อนมากๆ) */
/* .vc-dark เป็น class ที่ VCalendar เพิ่มเมื่อใช้ theme="dark" */
:deep(.vc-dark .vc-title),
/* ชื่อเดือนและปี */
:deep(.vc-dark .vc-weekday),
/* ชื่อวันในสัปดาห์ */
:deep(.vc-dark .vc-day-content),
/* ตัวเลขวันที่ในแต่ละวัน */
:deep(.vc-dark .vc-time),
/* ถ้าคุณใช้ตัวเลือกเวลา */
:deep(.vc-dark .vc-arrow) {
  /* ลูกศรเปลี่ยนเดือน/ปี */
  color: #ffffff !important;
  /* กำหนดเป็นสีขาว และใช้ !important เพื่อให้แน่ใจว่า override ได้ */
}

/* ปรับสีสำหรับวันที่ที่เป็นสีแดง (เช่น วันอาทิตย์) ให้เป็นสีแดงที่สว่างและมองเห็นได้บนพื้นหลังโปร่งใสเข้ม */
:deep(.vc-dark .vc-red) {
  color: #FF6B6B !important;
  /* สีแดงที่สว่างขึ้น */
}

/* สีสำหรับวันที่ที่ไม่อยู่ในเดือนปัจจุบัน (ทำให้เป็นสีขาวจางๆ) */
:deep(.vc-dark .is-outside-month .vc-day-content) {
  color: rgba(255, 255, 255, 0.7) !important;
  /* สีขาวที่โปร่งใสเล็กน้อย */
}

/* สีสำหรับตัวอักษรบนวันที่ถูกเลือก/ไฮไลต์ (เพื่อให้ตัวอักษรสีขาวตัดกับสีไฮไลต์ เช่น สีฟ้า) */
:deep(.vc-dark .vc-highlight-content-solid) {
  color: #ffffff !important;
  /* สีขาว */
}

/* กำหนดสีตัวอักษรสำหรับ input field ของ VCalendar */
/* class="!text-white" บน <VDatePicker> อาจมีผลอยู่แล้ว แต่ถ้ายังไม่ได้ผล ให้ใช้ CSS นี้ */
:deep(.vc-text-input) {
  color: #ffffff !important;
  /* สีขาว */
}
</style>