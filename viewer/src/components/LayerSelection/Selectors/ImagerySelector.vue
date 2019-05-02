<template>
  <div class="selector-container" id="imagery-selector-container">
    <treeselect
      placeholder="Aerial Photographs"
      :value-format="valueFormat"
      :clearable="clearable"
      :searchable="searchable"
      :multiple="true"
      :options="imagery"
      :value-consists-of="valueConsistsOf"
      v-model="selected"
      @input="onChange"
      @select="onSelect"
      @deselect="onSelect"
    >
    </treeselect>

    <div v-bar="{ preventParentScroll: true, scrollThrottle: 30 }">
      <ul class="selected-layers" id="selected-imagery-container">
        <li v-for="imageNode in selected" :key="imageNode.id">
          <div class="layer-label">
            <div class="buttons">
              <button @click="removeLayer(imageNode)">
                <span class="mdi mdi-close-circle"></span>
              </button>
              <button @click="toggleLayer(imageNode)">
                <span
                  v-if="hidden.includes(imageNode.id)"
                  class="mdi mdi-eye"
                ></span>
                <span
                  v-if="!hidden.includes(imageNode.id)"
                  class="mdi mdi-eye-off"
                ></span>
              </button>
            </div>
            <span
              @mouseover="mouseOver(imageNode)"
              @mouseleave="mouseLeave(imageNode)"
            >
              {{ imageNode.label }}
            </span>
          </div>
          <vue-slider
            ref="slider"
            :width="50"
            :dot-size="10"
            :min="0"
            :max="1"
            :interval="0.01"
            tooltip="none"
            v-model="opacities[imageNode.id]"
            @change="changeOpacity(imageNode)"
          ></vue-slider>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

import { imageryNames, imagery } from '../../Layers/imagery';

export default {
  name: 'ImagerySelector',
  components: {
    Treeselect,
    VueSlider
  },
  data() {
    return {
      selected: [],
      prevSelected: [],
      imagery: imageryNames,
      valueConsistsOf: 'LEAF_PRIORITY',
      clearable: false,
      searchable: false,
      valueFormat: 'object',
      opacities: {},
      hidden: []
    };
  },
  methods: {
    onSelect() {
      this.prevSelected = this.selected.slice(0);
    },
    onChange() {
      for (const image of this.prevSelected) {
        imagery[image.id].show = false;
      }
      for (const image of this.selected) {
        this.opacities[image.id] = 1;
        imagery[image.id].alpha = 1;
        imagery[image.id].show = true;
      }
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    removeLayer(node) {
      this.onSelect();
      this.selected = this.selected.filter(layerNode => {
        return node !== layerNode;
      });
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    toggleLayer(node) {
      imagery[node.id].show = !imagery[node.id].show;
      if (imagery[node.id].show === false) {
        this.hidden.push(node.id);
      } else {
        this.hidden.filter(x => x !== node.id);
      }
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    mouseOver(node) {
      imagery[node.id].hue = 2.0;
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    mouseLeave(node) {
      imagery[node.id].hue = 0.0;
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    changeOpacity(node) {
      imagery[node.id].alpha = this.opacities[node.id];
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    }
  }
};
</script>

<style></style>
