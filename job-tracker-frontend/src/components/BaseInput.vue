<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    type: { type: String, default: 'text' },
    placeholder: String,
    required: Boolean,
    autofocus: Boolean,
    error: String
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 10)}`)

// ฟังก์ชันสำหรับ handle input event
function handleInput(event) {
    emit('update:modelValue', event.target.value)
}
</script>

<template>
    <fieldset class="fieldset w-auto">
        <legend class="fieldset-legend">{{ label }}<span v-if="required" class="text-red-500">*</span></legend>
        <input 
            :id="inputId"
            :type="type"
            :value="modelValue"
            @input="handleInput"
            :placeholder="placeholder"
            :required="required"
            :autofocus="autofocus"
            class="input w-auto"
        />
        <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
    </fieldset>
</template>