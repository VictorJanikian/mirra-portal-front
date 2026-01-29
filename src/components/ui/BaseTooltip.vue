<template>
  <span class="tooltip-wrapper">
    <span class="tooltip-icon" tabindex="0">?</span>
    <span class="tooltip-text">{{ text }}</span>
  </span>
</template>

<script>
export default {
  name: 'BaseTooltip',
  props: {
    text: { type: String, required: true }
  }
}
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tooltip-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  font-size: 11px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  transition: all var(--transition-normal);
  border: none;
  line-height: 1;
}

.tooltip-icon:hover,
.tooltip-icon:focus {
  background: var(--color-primary);
  color: var(--color-white);
  outline: none;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #f8fafc;
  padding: 10px 14px;
  border-radius: var(--border-radius);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  width: 280px;
  max-width: 320px;
  text-align: left;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: opacity var(--transition-normal), visibility var(--transition-normal);
  pointer-events: none;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #1e293b transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip-text,
.tooltip-icon:focus + .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
