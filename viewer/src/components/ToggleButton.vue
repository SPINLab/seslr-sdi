<template>
  <div class="toggle-button" @click="onClick">
    <svg
      v-if="direction === 'up'"
      style="width:24px; height:24px"
      viewBox="0 0 24 24"
    >
      <path
        :fill="color"
        d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
      />
    </svg>

    <svg
      v-if="direction === 'left'"
      style="width:24px;height:24px"
      viewBox="0 0 24 24"
    >
      <path
        :fill="color"
        d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
      />
    </svg>

    <svg
      v-if="direction === 'right'"
      style="width:24px;height:24px"
      viewBox="0 0 24 24"
    >
      <path
        :fill="color"
        d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
      />
    </svg>

    <svg
      v-if="direction === 'down'"
      style="width:24px;height:24px"
      viewBox="0 0 24 24"
    >
      <path
        :fill="color"
        d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'ToggleButton',
  props: {
    direction: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: '#000000'
    }
  },
  methods: {
    onClick() {
      if (this.$el.classList.contains('rotate-icon-forwards')) {
        this.$el.classList.remove('rotate-icon-forwards');
        this.$el.classList.add('rotate-icon-backwards');
      } else {
        this.$el.classList.remove('rotate-icon-backwards');
        this.$el.classList.add('rotate-icon-forwards');
      }
    }
  }
};
</script>

<style scoped>
.toggle-button {
  cursor: pointer;
  z-index: 9;
  padding: 0.5rem;
}

@keyframes rotate180 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}

@keyframes rotate180back {
  from {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.rotate-icon-forwards {
  animation-name: rotate180;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.rotate-icon-backwards {
  animation-name: rotate180back;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
</style>
