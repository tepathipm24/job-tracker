<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: Boolean,
  secondary: Boolean,
  loading: { // <-- ประกาศ prop 'loading' ที่นี่
    type: Boolean,
    default: false // กำหนดค่า default เป็น false
  },
  variant: Boolean
})
</script>

<template>
  <button 
    :type="type" 
    :disabled="disabled || loading"
    :class="['btn', variant, { 'loading': loading }]"
  >
    <span v-if="loading" class="loading loading-spinner loading-sm"></span>
    <slot></slot>
  </button>
</template>

<style scoped>
/* From Uiverse.io by e-coders */ 
.base-btn {
 appearance: none;
 background-color: #1A1A1A;
 color: #fff;
 border: 0.125em solid #1A1A1A;
 border-radius: 0.9375em;
 font-size: 16px;
 font-weight: 600;
 padding: 1em 2.3em;
 cursor: pointer;
 transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
 min-height: 3.75em;
 min-width: 0;
 outline: none;
 box-shadow: rgba(0, 0, 0, 0.10) 0 4px 12px;
}

.base-btn:hover:not(:disabled) {
 background-color: #333;
 color: #fff;
 box-shadow: rgba(0, 0, 0, 0.18) 0 8px 15px;
 transform: translateY(-2px);
}

.base-btn:active {
 box-shadow: none;
 transform: translateY(0);
}

.base-btn:disabled {
 pointer-events: none;
 opacity: 0.6;
}

.base-btn--secondary {
 background-color: #fff;
 color: #1A1A1A;
 border: 0.125em solid #1A1A1A;
}

.base-btn--secondary:hover:not(:disabled) {
 background-color: #f3f3f3;
 color: #1A1A1A;
}
</style>