<script setup>
import { useStore } from '@/stores/state';
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true }
})

const route = useRoute()
const store = useStore()

const isActive = computed(() => route.path === props.to)
</script>

<template>
  <RouterLink :to="to" class="nav-link" :class="{ active: isActive }">
    <div class="icon-wrapper">
      <i class="nav-icon" :class="icon" />
      <div v-if="isActive" class="active-indicator"></div>
    </div>
    <Transition name="slide-fade">
      <span v-if="!store.collapsed" class="nav-text">
        <slot />
      </span>
    </Transition>
  </RouterLink>
</template>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  cursor: pointer;
  position: relative;
  font-weight: 500;
  user-select: none;
  text-decoration: none;

  margin: 0.125rem 0;
  padding: 0.75rem 0.5rem;
  border-radius: 12px;
  min-height: 44px;

  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* เพิ่มความลึก */
  background: transparent;
  border: 1px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.05) 100%
  );
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-link.active:hover {
  transform: translateX(2px);
}

.icon-wrapper {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-icon {
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1);
}

.nav-link.active .nav-icon {
  color: #ffffff;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.3));
}

.active-indicator {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  opacity: 1;
  animation: slideIn 0.3s ease;
}

.nav-text {
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.4;
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* Collapsed state styles */
.nav-link:has(.nav-text:not(:empty)) {
  justify-content: flex-start;
}

/* เมื่อ sidebar ย่อ */
@media (max-width: 80px) {
  .nav-link {
    justify-content: center;
    padding: 0.75rem 0.25rem;
  }
  
  .icon-wrapper {
    margin: 0;
  }
}
</style>