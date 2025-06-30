<script setup>
import { computed, ref, defineExpose } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    type: { type: String, default: 'text' },
    placeholder: String,
    required: Boolean,
    autofocus: Boolean,
    readonly: Boolean,
    error: String
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 10)}`)

const inputElement = ref(null)
defineExpose({ inputElement })

function handleInput(event) {
    emit('update:modelValue', event.target.value)
}
</script>

<template>
    <fieldset class="fieldset w-auto">
        <legend class="fieldset-legend">{{ label }}<span v-if="required" class="text-red-500">*</span></legend>
        <input 
            ref="inputElement"
            :id="inputId"
            :type="type"
            :value="modelValue"
            @input="handleInput"
            :placeholder="placeholder"
            :required="required"
            :autofocus="autofocus"
            :readonly="readonly"
            class="input w-auto !p-2"
        />
        <div v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</div>
    </fieldset>
</template>