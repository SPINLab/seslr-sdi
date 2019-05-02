<template>
  <div class="selector-container" id="maps-selector-container">
    <treeselect
      placeholder="Maps"
      :value-format="valueFormat"
      :clearable="clearable"
      :searchable="searchable"
      :multiple="true"
      :options="maps"
      :value-consists-of="valueConsistsOf"
      v-model="selected"
      @input="onChange"
      @select="onSelect"
      @deselect="onSelect"
    >
    </treeselect>

    <div v-bar="{ preventParentScroll: true, scrollThrottle: 30 }">
      <ul class="selected-layers" id="selected-container">
        <li v-for="mapNode in selected" :key="mapNode.id">
          <div class="layer-label">
            <div class="buttons">
              <button @click="removeLayer(mapNode, selected, 'selected')">
                <span class="mdi mdi-close-circle"></span>
              </button>
              <button @click="toggleLayer(mapNode)">
                <span
                  v-if="!hidden.includes(mapNode.id)"
                  class="mdi mdi-eye"
                ></span>
                <span
                  v-if="hidden.includes(mapNode.id)"
                  class="mdi mdi-eye-off"
                ></span>
              </button>
            </div>
            <span
              @mouseover="mouseOver(mapNode)"
              @mouseleave="mouseLeave(mapNode)"
            >
              {{ mapNode.label }}
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
            v-model="opacities[mapNode.id]"
            @change="changeOpacity(mapNode)"
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

import { mapNames, maps } from '../../Layers/maps';

export default {
  name: 'MapsSelector',
  components: {
    Treeselect,
    VueSlider
  },
  data() {
    return {
      selected: [],
      prevSelected: [],
      maps: mapNames,
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
      for (const map of this.prevSelected) {
        maps[map.id].show = false;
      }
      for (const map of this.selected) {
        this.opacities[map.id] = 1;
        maps[map.id].alpha = 1;
        maps[map.id].show = true;
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
      maps[node.id].show = !maps[node.id].show;
      if (maps[node.id].show === false) {
        this.hidden.push(node.id);
      } else {
        this.hidden.filter(x => x !== node.id);
      }
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    mouseOver(node) {
      maps[node.id].hue = 2.0;
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    mouseLeave(node) {
      maps[node.id].hue = 0.0;
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    changeOpacity(node) {
      maps[node.id].alpha = this.opacities[node.id];
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    }
  },
  mounted() {
    if (parseInt(this.$parent.$parent.urlParams.get('topo1860'))) {
      this.selected.push(mapNames.filter(x => x.id === 'topo_1860')[0]);
    }
  }
};
</script>

<style></style>
