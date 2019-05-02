<template>
  <div id="scene-mode-picker"></div>
</template>

<script>
import SceneModePicker from 'cesium/Widgets/SceneModePicker/SceneModePicker';

export default {
  name: 'SceneModePicker',
  props: {
    duration: {
      type: Number,
      default: 0.0
    }
  },
  mounted() {
    this.sceneModePicker = new SceneModePicker(
      this.$el,
      this.$parent.$parent.$options.viewer.scene,
      this.duration
    );
  }
};
</script>

<style scoped>
#scene-mode-picker {
  margin: 2px;
  z-index: 1;
}

#scene-mode-picker >>> .cesium-sceneModePicker-dropDown-icon {
  z-index: 1;
}
</style>
