<template>
  <div id="base-layer-picker"></div>
</template>

<script>
import BaseLayerPicker from 'cesium/Widgets/BaseLayerPicker/BaseLayerPicker';
import createDefaultImageryProviderViewModels from 'cesium/Widgets/BaseLayerPicker/createDefaultImageryProviderViewModels';
import createDefaultTerrainProviderViewModels from 'cesium/Widgets/BaseLayerPicker/createDefaultTerrainProviderViewModels';

export default {
  name: 'BaseLayerPicker',
  props: {
    imageryProviderViewModels: {
      type: Array,
      default: () => new createDefaultImageryProviderViewModels()
    },
    terrainProviderViewModels: {
      type: Array,
      default: () => new createDefaultTerrainProviderViewModels()
    }
  },
  mounted() {
    this.baseLayerPicker = new BaseLayerPicker(this.$el, {
      globe: this.$parent.$parent.$options.viewer.scene.globe,
      imageryProviderViewModels: this.imageryProviderViewModels,
      terrainProviderViewModels: this.terrainProviderViewModels
    });
  }
};
</script>

<style scoped>
#base-layer-picker >>> .cesium-baseLayerPicker-dropDown {
  max-height: none;
  max-width: 70vw;
  z-index: 1;
  direction: ltr;
  top: 0;
  right: 40px;
}

@media screen and (max-height: 930px) {
  #base-layer-picker >>> .cesium-baseLayerPicker-dropDown {
    max-height: 70vh;
  }
}

@media screen and (max-height: 500px) {
  #base-layer-picker >>> .cesium-baseLayerPicker-dropDown {
    max-height: 50vh;
  }
}

#base-layer-picker >>> .cesium-baseLayerPicker-dropDown-visible {
  border-radius: 3px;
  background-color: #2c3e50;
  border: 1px solid black;
}

#base-layer-picker >>> .cesium-baseLayerPicker-choices {
  border: 1px solid black;
  border-radius: 3px;
  padding: 5px 0;
  margin-top: 5px;
}

#base-layer-picker >>> .cesium-baseLayerPicker-itemIcon {
  border: solid 1px black;
  border-radius: 3px;
}

#base-layer-picker
  >>> .cesium-baseLayerPicker-selectedItem
  .cesium-baseLayerPicker-itemIcon {
  border: solid 1px #2980b9;
}
</style>
