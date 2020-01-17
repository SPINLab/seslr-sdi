<template>
  <div id="cesium-toolbar">
    <DatabaseSearch />
    <SceneModePicker />
    <BaseLayerPicker :terrainProviderViewModels="terrainProvidersViewModels" />
    <HomeButton
      :position="homePosition"
      :orientation="homeOrientation"
      :position2D="homePosition2D"
      :orientation2D="homeOrientation2D"
    />
    <NavigationHelpButton />
  </div>
</template>

<script>
import HomeButton from './Buttons/HomeButton';
import BaseLayerPicker from './Buttons/BaseLayerPicker';
import NavigationHelpButton from './Buttons/NavigationHelpButton';
import SceneModePicker from './Buttons/SceneModePicker';
import DatabaseSearch from './Buttons/DatabaseSearch';

import { terrainProvidersViewModels } from '../Layers/terrain';

export default {
  name: 'CesiumToolbar',
  components: {
    HomeButton,
    BaseLayerPicker,
    NavigationHelpButton,
    SceneModePicker,
    DatabaseSearch
  },
  data() {
    return {
      homePosition: {
        x: 4593831.766374706,
        y: 2095344.1934905865,
        z: 3899118.3510605167
      },
      homeOrientation: {
        heading: 5.996852473587961,
        pitch: -0.5282780951788908,
        roll: 6.282120347716106
      },
      homePosition2D: {
        x: 4614210.007026895,
        y: 2096711.9402057289,
        z: 3940807.687153852
      },
      homeOrientation2D: {
        heading: 2 * Math.PI,
        pitch: -Math.PI / 2,
        roll: 0
      },
      terrainProvidersViewModels: terrainProvidersViewModels
    };
  }
};
</script>

<style scoped>
#cesium-toolbar {
  display: flex;
  z-index: 1;
  flex-direction: column-reverse;
  /* align-items: center; */
  direction: rtl;
}

#cesium-toolbar div {
  margin-top: 0.2rem;
}

#cesium-toolbar >>> .cesium-button {
  border-radius: 2px;
  background-color: #2c3e50;
  /* margin: 0.5rem; */
}

#cesium-toolbar >>> .cesium-toolbar-button {
  border-radius: 2px;
}
</style>
