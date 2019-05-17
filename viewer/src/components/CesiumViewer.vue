<template>
  <div id="cesium-container">
    <CesiumToolbar v-if="viewerLoaded" />
    <Infobox v-if="viewerLoaded" />
    <Tooltip ref="Tooltip" v-if="viewerLoaded" />
  </div>
</template>

<script>
import Viewer from 'cesium/Widgets/Viewer/Viewer';
import 'cesium/Widgets/widgets.css';

import WebMercatorProjection from 'cesium/Core/WebMercatorProjection';
import Ellipsoid from 'cesium/Core/Ellipsoid';

import CesiumToolbar from './Toolbar/CesiumToolbar';
import Tooltip from './Tooltip';
import Infobox from './Infobox';
import { findSpots } from './FindSpots/features';
import { features } from './Layers/features';
import { imagery } from './Layers/imagery';
import { maps } from './Layers/maps';

export default {
  name: 'CesiumViewer',
  components: {
    CesiumToolbar,
    Tooltip,
    Infobox
  },
  viewer: null,
  mounted() {
    this.$options.viewer = new Viewer(this.$el, {
      homeButton: false,
      geocoder: false,
      baseLayerPicker: false,
      animation: false,
      timeline: false,
      vrButton: false,
      sceneModePicker: false,
      infoBox: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      selectionIndicator: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      mapProjection: new WebMercatorProjection(Ellipsoid.WGS84)
    });

    this.viewerLoaded = true;

    this.$options.viewer.scene.mode =
      parseInt(this.$parent.urlParams.get('mode')) || 3;

    this.$options.viewer.dataSources.add(findSpots);

    for (const key in features) {
      if (features.hasOwnProperty(key)) {
        const feature = features[key];
        this.$options.viewer.dataSources.add(feature);
      }
    }

    for (const key in imagery) {
      if (imagery.hasOwnProperty(key)) {
        const image = imagery[key];
        this.$options.viewer.scene.imageryLayers.add(image);
      }
    }

    for (const key in maps) {
      if (maps.hasOwnProperty(key)) {
        const map = maps[key];
        this.$options.viewer.scene.imageryLayers.add(map);
      }
    }
  },
  data() {
    return {
      viewerLoaded: false
    };
  }
};
</script>

<style scoped>
#cesium-toolbar {
  position: absolute;
  right: 1%;
  top: 1%;
}

#infobox {
  position: absolute;
  top: 10%;
  right: 3rem;
  z-index: 2;
}
</style>
