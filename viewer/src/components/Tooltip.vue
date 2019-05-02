<template>
  <div id="tooltip"></div>
</template>

<script>
import startCase from 'lodash/startCase';
import debounce from 'lodash/debounce';

import ScreenSpaceEventHandler from 'cesium/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Core/ScreenSpaceEventType';
import Property from 'cesium/DataSources/Property';

export default {
  name: 'Tooltip',
  data() {
    return {
      handler: null,
      geologyInputAction: null,
      surveysInputAction: null
    };
  },
  mounted() {
    this.handler = new ScreenSpaceEventHandler(
      this.$parent.$options.viewer.scene.canvas
    );

    this.geologyInputAction = movement => {
      const pickedObject = this.$parent.$options.viewer.scene.pick(
        movement.endPosition
      );

      if (typeof pickedObject !== 'undefined') {
        this.$el.style.visibility = 'visible';
        this.$el.innerText = startCase(
          Property.getValueOrUndefined(pickedObject.id.properties.geology_lo)
        );
      } else {
        this.$el.style.visibility = 'hidden';
      }
    };

    this.surveysInputAction = movement => {
      const pickedObject = this.$parent.$options.viewer.scene.pick(
        movement.endPosition
      );

      if (typeof pickedObject !== 'undefined') {
        this.$el.style.visibility = 'visible';
        this.$el.innerText = startCase(
          Property.getValueOrUndefined(pickedObject.id.properties.arch_proje)
        );
      } else {
        this.$el.style.visibility = 'hidden';
      }
    };

    this.$parent.$el.onmousemove = e => {
      const x = e.clientX;
      const y = e.clientY;
      this.$el.style.top = y + 20 + 'px';
      this.$el.style.left = x + 20 + 'px';
    };
  },
  methods: {
    setGeology() {
      this.handler.setInputAction(
        debounce(this.geologyInputAction, 50),
        ScreenSpaceEventType.MOUSE_MOVE
      );
    },
    setSurveys() {
      this.handler.setInputAction(
        debounce(this.surveysInputAction, 50),
        ScreenSpaceEventType.MOUSE_MOVE
      );
    },
    unset() {
      this.handler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
    }
  }
};
</script>

<style scoped>
#tooltip {
  visibility: hidden;
  position: fixed;
  background-color: #2c3e50;
  color: #fff;
  z-index: 1;
  padding: 5px;
  border: 1px solid black;
  border-radius: 2px;
}
</style>
