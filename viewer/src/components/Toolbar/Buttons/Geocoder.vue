<template>
  <div id="geocoder" class="cesium-viewer-geocoderContainer"></div>
</template>

<script>
import Geocoder from 'cesium/Widgets/Geocoder/Geocoder';

export default {
  name: 'Geocoder',
  mounted() {
    this.geocoder = new Geocoder({
      container: this.$el,
      scene: this.$parent.$parent.$options.viewer.scene
    });
  }
};
</script>

<style scoped>
#geocoder {
  z-index: 1;
}

#geocoder >>> .cesium-viewer-geocoderContainer {
  margin: 2px 3px;
}

#geocoder >>> .cesium-geocoder-searchButton {
  background-color: #2c3e50;
  width: 30px;
  border-radius: 2px;
}

#geocoder >>> .cesium-geocoder-input {
  direction: ltr;
  padding: 0 30px 0 0;
  border-radius: 2px;
}

#geocoder >>> .search-results {
  direction: ltr;
  width: 216px;
  left: 0px;
}
</style>
