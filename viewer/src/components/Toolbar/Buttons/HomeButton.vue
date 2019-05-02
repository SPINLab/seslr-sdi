<template>
  <div id="home-button"></div>
</template>

<script>
import HomeButton from 'cesium/Widgets/HomeButton/HomeButton';

export default {
  name: 'HomeButton',
  props: {
    speed: {
      type: Number,
      default: 1
    },
    position: {
      type: Object,
      default: () => ({
        x: 3452756.404004388,
        y: -26226288.65595444,
        z: 18610961.973367725
      })
    },
    orientation: {
      type: Object,
      default: () => ({
        heading: 0,
        pitch: -Math.PI / 2,
        roll: 0
      })
    },
    position2D: {
      type: Object,
      default: null
    },
    orientation2D: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.homeButton = new HomeButton(
      this.$el,
      this.$parent.$parent.$options.viewer.scene,
      this.speed
    );

    this.homeButton.viewModel.command.beforeExecute.addEventListener(
      commandInfo => {
        if (
          this.$parent.$parent.$options.viewer.scene.mode == 2 &&
          this.position2D !== null &&
          this.orientation2D !== null
        ) {
          this.$parent.$parent.$options.viewer.camera.flyTo({
            destination: this.position2D,
            orientation: this.orientation2D,
            duration: this.speed
          });
        } else {
          this.$parent.$parent.$options.viewer.camera.flyTo({
            destination: this.position,
            orientation: this.orientation,
            duration: this.speed
          });
        }
        commandInfo.cancel = true;
      }
    );

    if (
      this.$parent.$parent.$options.viewer.scene.mode == 2 &&
      this.position2D !== null &&
      this.orientation2D !== null
    ) {
      this.$parent.$parent.$options.viewer.camera.setView({
        destination: this.position2D,
        orientation: this.orientation2D
      });
    } else {
      this.$parent.$parent.$options.viewer.camera.setView({
        destination: this.position,
        orientation: this.orientation
      });
    }
  }
};
</script>

<style scoped></style>
