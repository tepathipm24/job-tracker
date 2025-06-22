import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('toggle', () => { 
  const collapsed = ref(false)
  
  const toggleSidebar = () => {
    collapsed.value = !collapsed.value
    console.log('Store collapsed value:', collapsed.value)
  }
  
  const SIDEBAR_WIDTH = 180
  const SIDEBAR_WIDTH_COLLAPSED = 70
  
  const sidebarWidth = computed(
    () => `${collapsed.value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`
  ) 

  return { toggleSidebar, sidebarWidth, collapsed }
})