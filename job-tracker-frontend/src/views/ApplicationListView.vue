<script setup>
import TheNavbar from '@/components/TheNavbar.vue'
import { getAllList, getListPerPage, getAllStatus, updateApplicationStatus } from '@/utils/api';
import { formatDate } from '../utils/common';
import { onBeforeMount, ref, onMounted, onBeforeUnmount } from 'vue';
import { computed, watch } from 'vue';


let appList = ref([])
let statusList = ref([])
let debounceTimer;
let sortConfig = ref([])
let selectedRowIds = ref([]);
const page = ref(1)
const limit = 10
const loading = ref(false)
const searchText = ref('');
const headers = ref([
  { text: 'Company Name', value: 'companyName' },
  { text: 'Job Title', value: 'jobTitle' },
  { text: 'Applied Date', value: 'appliedDate' },
  { text: 'Status', value: 'status' },
  { text: 'Created At', value: 'createdAt' },
  { text: 'Updated At', value: 'updatedAt' }
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
  statusList.value = await getAllStatus()
})

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

watch(searchText, () => {
  page.value = 1;
});

//ดึง List สมัครงานในแต่ละหน้า
const fetchApplications = async () => {
  loading.value = true
  try {
    // Fetch all applications instead of a single page
    const res = await getListPerPage();
    appList.value = res;
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

//รับค่า keyboard จาก user
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

//filter
const filterAppList = computed(() => {
  if (!searchText.value) return appList.value;
  return appList.value.filter(app =>
    Object.values(app).some(
      text => String(text).toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())))
})

//toggle แต่ละ role เพื่อ sort
const toggleRowSelection = (id) => {
  const idx = selectedRowIds.value.indexOf(id);
  if (idx === -1) {
    selectedRowIds.value.push(id);
  } else {
    selectedRowIds.value.splice(idx, 1);
  }
};

//toggle สำหรับ sort
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

const suggestionsVisible = ref(false);

const handleBlur = () => {
  // Delay hiding so that a click on a suggestion can be registered
  setTimeout(() => {
    suggestionsVisible.value = false;
  }, 150);
}

//sort
const sortedAppList = computed(() => {
  let baseList = filterAppList.value
  if (!sortConfig.value.length) return baseList;

  // ทำสำเนา array เพื่อไม่แก้ไขต้นฉบับ
  let sorted = [...baseList];

  // รองรับ multi-sort (sortConfig อาจมีหลาย field)
  sortConfig.value.slice().reverse().forEach(({ field, direction }) => {
    sorted.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // กรณี field เป็นวันที่
      if (field.toLowerCase().includes('date') || field.toLowerCase().includes('at')) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // กรณี field เป็น object (เช่น status)
      if (typeof aValue === 'object' && aValue !== null && 'label' in aValue) {
        aValue = aValue.label;
        bValue = bValue.label;
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  });

  return sorted;
});

const searchSuggestions = computed(() => {
  if (!searchText.value || searchText.value.length < 2) return [];

  const lowerCaseSearch = searchText.value.toLowerCase();

  const companies = appList.value.map(app => app.companyName);
  const titles = appList.value.map(app => app.jobTitle);

  const allSuggestions = [...new Set([...companies, ...titles])];

  return allSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(lowerCaseSearch)
  ).slice(0, 5); // Limit to 5 suggestions
});

const selectSuggestion = (suggestion) => {
  searchText.value = suggestion;
  suggestionsVisible.value = false;
};

const paginatedList = computed(() => {
  const start = (page.value - 1) * limit;
  const end = start + limit;
  return sortedAppList.value.slice(start, end);
});

//ดึงค่า sort ปัจจุบัน
const getSortDirection = (field) => {
  const sortEntry = sortConfig.value.find(item => item.field === field);
  return sortEntry ? sortEntry.direction : null;
};

// ดูค่า status ที่เปลี่ยนไป
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

// ดูหน้าทั้งหมด
const total = computed(() => sortedAppList.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)));

//ไปหน้าถัดไป
function goToPage(n) {
  if (n < 1 || n > totalPages.value) return;
  page.value = n;
}

</script>

<template>
  <div class="max-h-screen h-10/12 bg-base-100">
    <TheNavbar />
    <!-- Header Section -->
    <div class="hero flex bg-base-200 rounded-xl !pb-6 shadow-md justify-start mt-30">
      <div class="flex flex-col items-start w-full">
        <div class="flex items-center gap-4 mb-2">
          <span class="flex items-start justify-start text-5xl ">📋</span>
          <h1 class="text-4xl font-bold text-left">Job Applications</h1>
        </div>
        <p class="text-base-content/70 text-left">Track and manage your job applications</p>
      </div>
      <div class="hero flex bg-base-200 rounded-xl shadow-md justify-end items-end !pt-8 !pr-15 relative">
        <div class="form-control w-full max-w-xs relative">
          <label class="input !pl-3 flex items-center gap-2 w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input class="grow" type="search" required placeholder="ค้นหางานหรือบริษัท..." v-model="searchText"
              @focus="suggestionsVisible = true" @blur="handleBlur" />
          </label>
          <div v-if="searchSuggestions.length > 0 && suggestionsVisible"
            class="absolute top-full mt-2 w-full dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-box z-10 border border-base-300">
            <li class="menu-title">
              <span>Suggestions</span>
            </li>
            <li v-for="suggestion in searchSuggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
              <a>{{ suggestion }}</a>
            </li>
          </div>
        </div>
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
            <th v-for="header in headers" :key="header.value"
              class="cursor-pointer hover:bg-primary/10 transition-colors font-bold text-base-content/80 select-none px-4 py-3"
              @click="toggleSort(header.value)">
              <span class="flex items-center gap-1">
                {{ header.text }}
                <span v-if="getSortDirection(header.value) === 'asc'" class="text-primary">▲</span>
                <span v-else-if="getSortDirection(header.value) === 'desc'" class="text-primary">▼</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-if="!loading">
          <!-- row 1 -->
          <tr v-for="(data, index) in paginatedList" :key="data.id" class="transition-colors cursor-pointer"
            :class="{ 'bg-primary/20': selectedRowIds.includes(data.id) }" @click="toggleRowSelection(data.id)">
            <th>
              <label class="font-mono text-base-content/70">
                {{ (page - 1) * limit + index + 1 }}
              </label>
            </th>
            <td class="!py-4">
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
              <div class="flex items-center gap-3">
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
          <tr v-if="sortedAppList.length === 0">
            <td :colspan="headers.length + 1" class="text-center py-16 !pt-16 !pb-16">
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
      <div class="card-actions justify-between items-center !pt-2 bg-base-200 border-t rounded-b-xl">
        <div class="text-sm text-base-content/70">
          <span class="font-semibold">Total:</span> {{ total }} applications
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
    <div class="join !pt-3">
      <template v-for="n in totalPages" :key="n">
        <button class="join-item btn btn-square" :class="{ 'btn-primary': page === n, 'btn-ghost': page !== n }"
          @click="goToPage(n)" :aria-label="'Page ' + n">{{ n }}</button>
      </template>
    </div>
  </div>
</template>