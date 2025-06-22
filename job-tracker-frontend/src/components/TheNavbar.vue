<script setup>
import { RouterLink } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { useStore } from '@/stores/state'
import TheNavbarLink from './TheNavbarLink.vue'

const store = useStore()

defineProps({
  
})

const navItems = [
  { name: 'หน้าหลัก', path: '/', icon: 'fas fa-home' },
  { name: 'รายการสมัครงาน', path: '/applications', icon: 'fas fa-list-alt' },
  { name: 'สถิติ', path: '/statistics', icon: 'fas fa-chart-bar' },
  { name: 'ตั้งค่า', path: '/settings', icon: 'fas fa-cog' }
]

const handleToggle = () => {
  store.toggleSidebar()
  console.log('Collapsed value:', store.collapsed)
}
</script>

<template>
  <div class="sidebar" :style="{width: store.sidebarWidth}">
    <!-- Header Section -->
    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo-icon">
          <i class="fas fa-briefcase"></i>
        </div>
        <Transition name="fade">
          <div v-if="!store.collapsed" class="logo-text">
            <h2>Job Tracker</h2>
            <span class="logo-subtitle">จัดการใบสมัครงาน</span>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Navigation Section -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <Transition name="fade">
          <span v-if="!store.collapsed" class="section-title">เมนูหลัก</span>
        </Transition>
        <div class="nav-items">
          <TheNavbarLink 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path" 
            :icon="item.icon"
          >
            {{ item.name }}
          </TheNavbarLink>
        </div>
      </div>
    </nav>

    <!-- Footer Section -->
    <div class="sidebar-footer">
      <button 
        class="collapse-btn" 
        :class="{'collapsed': store.collapsed}" 
        @click="handleToggle"
        :title="store.collapsed ? 'ขยาย Sidebar' : 'ย่อ Sidebar'"
      >
        <i class="fas fa-chevron-left collapse-icon" :class="{'rotate-icon': store.collapsed}"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  color: white;
  background: linear-gradient(180deg, 
    var(--sidebar-bg-color, #2c3e50) 0%, 
    var(--sidebar-bg-secondary, #34495e) 100%
  );
  
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  bottom: 0;
  
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  display: flex;
  flex-direction: column;
  
  min-height: 100vh;
  box-sizing: border-box;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

/* Header Section */
.sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.logo-icon i {
  font-size: 1.2rem;
  color: white;
}

.logo-text h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

/* Navigation Section */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-section {
  padding: 0 1rem;
}

.section-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Footer Section */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.collapse-btn {
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.collapse-btn:active {
  transform: translateY(0);
}

.collapse-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rotate-icon {
  transform: rotate(180deg);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
}

/* Custom scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>