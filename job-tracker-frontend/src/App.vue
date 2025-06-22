<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import { useStore } from '@/stores/state'
import { watch, onMounted } from 'vue'

const store = useStore()
const route = useRoute()

// อัพเดท CSS variable เมื่อ sidebar width เปลี่ยน
watch(() => store.sidebarWidth, (newWidth) => {
  document.documentElement.style.setProperty('--sidebar-width', newWidth)
})

onMounted(() => {
  document.documentElement.style.setProperty('--sidebar-width', store.sidebarWidth)
})
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <TheNavbar v-if="route.meta.requiresNavbar" />
    
    <!-- Main Content Area -->
    <main 
      class="main-content" 
      :class="{ 
        'no-navbar-layout': !route.meta.requiresNavbar,
        'with-sidebar': route.meta.requiresNavbar 
      }"
      :style="{ 
        'margin-left': route.meta.requiresNavbar ? store.sidebarWidth : '0'
      }"
    >
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  height: 100vh;
  overflow-y: auto; /* เพิ่มการ scroll ถ้าเนื้อหายาวเกิน */
  padding: 1rem; /* เพิ่ม padding ตามต้องการ */
  transition: margin-left 0.3s ease; /* smooth transition เมื่อ sidebar เปิด/ปิด */
}

.main-content.no-navbar-layout {
  margin-left: 0;
  width: 100%;
}

.main-content.with-sidebar {
  /* จะใช้ margin-left จาก :style แทน */
  width: calc(100vw - var(--sidebar-width, 250px)); /* กำหนดความกว้างที่เหลือ */
}
</style>