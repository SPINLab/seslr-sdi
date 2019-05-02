<template>
  <div class="selector-container" id="feature-selector-container">
    <treeselect
      placeholder="Features"
      :value-format="valueFormat"
      :clearable="clearable"
      :searchable="searchable"
      :multiple="true"
      :options="features"
      :value-consists-of="valueConsistsOf"
      v-model="selected"
      @input="onChange"
      @select="onSelect"
      @deselect="onSelect"
    >
    </treeselect>

    <div v-bar="{ preventParentScroll: true, scrollThrottle: 30 }">
      <ul class="selected-layers" id="selected-feature-container">
        <li v-for="featureNode in selected" :key="featureNode.id">
          <div class="layer=label">
            <button @click="removeLayer(featureNode)">
              <span class="mdi mdi-close-circle"></span>
            </button>
            <button @click="toggleLayer(featureNode)">
              <span
                v-if="!hidden.includes(featureNode.id)"
                class="mdi mdi-eye"
              ></span>
              <span
                v-if="hidden.includes(featureNode.id)"
                class="mdi mdi-eye-off"
              ></span>
            </button>
            <span> {{ featureNode.label }} </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import { featureNames, features } from '../../Layers/features';

export default {
  name: 'FeaturesSelector',
  components: {
    Treeselect
  },
  data() {
    return {
      selected: [],
      prevSelected: [],
      features: featureNames,
      valueConsistsOf: 'LEAF_PRIORITY',
      clearable: false,
      searchable: false,
      valueFormat: 'object',
      hidden: []
    };
  },
  methods: {
    onSelect() {
      this.prevSelected = this.selected.slice(0);
    },
    onChange() {
      let selectedFeature;
      let show;
      if (this.prevSelected.length > this.selected.length) {
        for (let feature of this.prevSelected) {
          if (!this.selected.includes(feature)) {
            selectedFeature = feature;
            show = false;
          }
        }
      } else {
        for (let feature of this.selected) {
          if (!this.prevSelected.includes(feature)) {
            selectedFeature = feature;
            show = true;
          }
        }
      }
      if (show) {
        switch (selectedFeature.id) {
          case 'mines':
            this.$parent.$parent.$refs.Legend.$refs.carousel.goToPage(1);
            break;
          case 'archaeological_surveys':
            this.$parent.$parent.$refs.Legend.$refs.carousel.goToPage(2);
            if (features['geology'].show !== true) {
              this.$parent.$parent.$refs.CesiumViewer.$refs.Tooltip.setSurveys();
            }
            break;
          case 'geology':
            this.$parent.$parent.$refs.Legend.$refs.carousel.goToPage(3);
            this.$parent.$parent.$refs.CesiumViewer.$refs.Tooltip.setGeology();
            break;
          default:
            break;
        }
      } else {
        switch (selectedFeature.id) {
          case 'archaeological_surveys':
            if (features['geology'].show === true) {
              this.$parent.$parent.$refs.CesiumViewer.$refs.Tooltip.setGeology();
            } else {
              this.$parent.$parent.$refs.CesiumViewer.$refs.Tooltip.unset();
            }
            break;
          case 'geology':
            if (features['archaeological_surveys'].show === true) {
              this.$parent.$parent.$refs.CesiumViewer.$refs.Tooltip.setSurveys();
            } else {
              this.$parent.$parent.$refs.CesiumViewer.$refs.Tooltip.unset();
            }
            break;
          default:
            break;
        }
      }
      features[selectedFeature.id].show = show;

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
      features[node.id].show = !features[node.id].show;
      if (features[node.id].show === false) {
        this.hidden.push(node.id);
      } else {
        this.hidden.filter(x => x !== node.id);
      }
      this.$parent.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    }
  }
  //   mounted() {
  // if (parseInt(this.$parent.$parent.urlParams.get('mines'))) {
  //   this.selected.push(featureNames.filter(x => x.id === 'mines')[0]);
  // }
  // if (parseInt(this.$parent.$parent.urlParams.get('surveys'))) {
  //   this.selected.push(
  //     featureNames.filter(x => x.id === 'archaeological_surveys')[0]
  //   );
  // }
  // if (parseInt(this.$parent.$parent.urlParams.get('geology'))) {
  //   this.selected.push(featureNames.filter(x => x.id === 'geology')[0]);
  // }
  //   }
};
</script>

<style></style>
