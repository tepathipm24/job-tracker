<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import { getAllList, getListPerPage, getAllStatus, updateApplicationStatus } from '@/utils/api';
import { formatDate } from '../utils/common';
import { onBeforeMount, ref, onMounted, onBeforeUnmount } from 'vue';
import { computed, watch } from 'vue';
import Paginator from 'primevue/paginator';


let appList = ref([])
let statusList = ref([])
let debounceTimer;
let sortConfig = ref([])
let selectedRowIds = ref([]);
const page = ref(1)
const limit = 10
const total = ref(0)
const loading = ref(false)
const headers = ref([
  'Company Name',
  'Job Title',
  'Applied Date',
  'Status',
  'Created At',
  'Updated At'
])
const statusBadgeClass = (label) => {
  switch (label) {
    case 'Applied': return 'badge-info';
    case 'HR Contacted': return 'badge-primary';
    case 'Interview Scheduled': return 'badge-warning';
    case 'Interviewed': return 'badge-accent';
    case 'Offer Received': return 'badge-success';
    case 'Rejected': return 'badge-error';
    case 'Withdrawn': return 'badge-neutral';
    default: return 'badge-ghost';
  }
};


onBeforeMount(async () => {
  await fetchApplications()
  console.log(appList.value);

  console.log(appList.value.total);

  statusList.value = await getAllStatus()
})
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

watch(page, () => {
  fetchApplications()
})

const fetchApplications = async () => {
  loading.value = true
  try {
    const res = await getListPerPage(page.value, limit)
    appList.value = res.data
    total.value = res.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(page, () => {
  fetchApplications()
})

const handleKeyDown = (e) => {
  if (e.ctrlKey && e.key === 'a') {
    e.preventDefault();
    if (selectedRowIds.value.length === appList.value.length) {
      selectedRowIds.value = [];
    } else {
      selectedRowIds.value = appList.value.map(app => app.id);
    }
  }
};

const toggleRowSelection = (id) => {
  const idx = selectedRowIds.value.indexOf(id);
  if (idx === -1) {
    selectedRowIds.value.push(id);
  } else {
    selectedRowIds.value.splice(idx, 1);
  }
};

const toggleSort = (fieldToSort) => {
  const index = sortConfig.value.findIndex(item => item.field === fieldToSort)

  if (index === -1) {
    sortConfig.value.push({ field: fieldToSort, direction: 'asc' })
  } else if (sortConfig.value[index].direction === 'asc') {
    sortConfig.value[index].direction = 'desc'
  } else {
    sortConfig.value.splice(index, 1)
  }

  console.log(sortConfig.value);

}

const getSortDirection = (field) => {
  const sortEntry = sortConfig.value.find(item => item.field === field);
  return sortEntry ? sortEntry.direction : null;
};

const handleStatusChange = async (application, event) => {
  clearTimeout(debounceTimer);

  const newStatusLabel = event.target.value;
  const newStatus = statusList.value.find(s => s.label === newStatusLabel);

  if (newStatus) {
    const appIndex = appList.value.findIndex(app => app.id === application.id);
    const oldStatus = application.status;
    if (appIndex !== -1) {
      appList.value[appIndex].status = newStatus;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const updatedApplication = await updateApplicationStatus(application.id, newStatus.id);
        if (appIndex !== -1) {
          appList.value[appIndex] = updatedApplication;
        }
      } catch (error) {
        if (appIndex !== -1) {
          appList.value[appIndex].status = oldStatus;
        }
        event.target.value = application.status.label;
        console.error('Failed to update status:', error);
      }
    }, 500);
  }
};

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

function goToPage(n) {
  if (n < 1 || n > totalPages.value) return;
  page.value = n;
}

</script>

<template>
  <div class="max-h-screen h-10/12 bg-base-100">
    <TheNavbar />
    <!-- Header Section -->
    <div class="hero bg-base-200 rounded-xl my-8 p-8 shadow-md justify-start mt-30">
      <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 mb-2">
          <span class="text-5xl">📋</span>
          <h1 class="text-4xl font-bold text-left">Job Applications</h1>
        </div>
        <p class="text-base-content/70 text-left">Track and manage your job applications</p>
      </div>
    </div>

    <!-- Table Section -->
    <div class="overflow-x-auto rounded-xl shadow-lg mt-30">
      <div v-if="loading" class="flex justify-center py-4">
        <span class="loading loading-infinity loading-xl"></span>
      </div>
      <table class="table w-full">
        <!-- head -->
        <thead class="bg-base-200">
          <tr>
            <th class="text-base font-bold text-base-content/80">#</th>
            <th v-for="header in headers" :key="header"
              class="cursor-pointer hover:bg-primary/10 transition-colors font-bold text-base-content/80 select-none px-4 py-3"
              @click="toggleSort(header)">
              <span class="flex items-center gap-1">
                {{ header }}
                <span v-if="getSortDirection(header) === 'asc'" class="text-primary">▲</span>
                <span v-else-if="getSortDirection(header) === 'desc'" class="text-primary">▼</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <!-- row 1 -->
          <tr v-for="(data, index) in appList" :key="data.id" class="transition-colors cursor-pointer"
            :class="{ 'bg-primary/20': selectedRowIds.includes(data.id) }" @click="toggleRowSelection(data.id)">
            <th>
              <label class="font-mono text-base-content/70">
                {{ (page - 1) * limit + index + 1 }}
              </label>
            </th>
            <td>
              <div class="flex items-center gap-3">
                <div>
                  <div class="font-bold text-base-content">{{ data.companyName }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="text-base-content/90">{{ data.jobTitle }}</span>
            </td>
            <td>{{ formatDate(data.appliedDate || 'null') }}</td>
            <td>
              <div class="flex items-center gap-4">
                <select class="select select-bordered select-sm w-auto max-w-xs bg-base-100" :value="data.status.label"
                  @change="handleStatusChange(data, $event)">
                  <option v-for="status in statusList" :key="status.id" :value="status.label">
                    {{ status.label }}
                  </option>
                </select>
                <span class="badge" :class="statusBadgeClass(data.status.label)">
                  {{ data.status.label }}
                </span>
              </div>
            </td>
            <td>{{ formatDate(data.createdAt) }}</td>
            <td>{{ formatDate(data.updatedAt) }}</td>
          </tr>
          <!-- Empty State -->
          <tr v-if="appList.length === 0">
            <td :colspan="headers.length + 1" class="text-center py-16">
              <div class="flex flex-col items-center gap-4">
                <div class="text-7xl opacity-30">📋</div>
                <div class="alert alert-info flex flex-col items-center bg-base-200 border-0 shadow-none">
                  <h3 class="text-lg font-semibold text-base-content/70">No applications found</h3>
                  <p class="text-sm text-base-content/50">Start by adding your first job application</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="i in limit" :key="i">
            <td :colspan="headers.length + 1">
              <div class="skeleton h-6 w-full"></div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="card-actions justify-between items-center p-4 bg-base-200 border-t rounded-b-xl">
        <div class="text-sm text-base-content/70">
          <span class="font-semibold">Total:</span> {{ appList.length }} applications
        </div>
        <div class="text-sm text-base-content/50">
          <span class="font-semibold">Last updated:</span> {{ new Date().toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
  <!-- Paginator -->
  <p class="text-center text-base-content/60 text-xs md:text-sm mb-2 font-sans">
    Page {{ page }} of {{ Math.ceil(total / limit) }} — Showing {{ limit }} per page
  </p>
  <div class="flex items-center justify-center w-full">
    <div class="join">
      <template v-for="n in totalPages" :key="n">
        <button
          class="join-item btn btn-square"
          :class="{ 'btn-primary': page === n, 'btn-ghost': page !== n }"
          @click="goToPage(n)"
          :aria-label="'Page ' + n"
        >{{ n }}</button>
      </template>
    </div>
  </div>
</template>