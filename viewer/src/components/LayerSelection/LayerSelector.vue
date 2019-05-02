<template>
  <div id="layer-selector">
    <ImagerySelector />
    <FeaturesSelector />
    <MapsSelector />
  </div>
</template>

<script>
import ImagerySelector from './Selectors/ImagerySelector';
import FeaturesSelector from './Selectors/FeaturesSelector';
import MapsSelector from './Selectors/MapsSelector';

export default {
  name: 'LayerSelector',
  components: {
    ImagerySelector,
    FeaturesSelector,
    MapsSelector
  }
};
</script>

<style scoped>
#layer-selector >>> .vue-treeselect .vue-treeselect__multi-value-item {
  display: none;
}

#layer-selector >>> .vue-treeselect .vue-treeselect-helper-hide {
  display: block;
}

#layer-selector >>> .vue-treeselect .vue-treeselect__placeholder {
  color: #3e3e3e;
}

#layer-selector >>> .vue-treeselect {
  padding: 3px;
}

#layer-selector >>> .selector-container {
  margin-bottom: 10px;
}

#layer-selector >>> .selected-layers {
  list-style-type: none;
  padding: 5px;
  max-height: 200px;
  overflow: auto;
  margin: 0;
}

#layer-selector >>> .selected-layers li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  color: #ecf0f1;
  font-size: small;
  margin: 4px;
  margin-right: 30px;
  border-radius: 2px;
}
#layer-selector >>> .selected-layers li:hover {
  background-color: #297fb975;
}
#layer-selector >>> .selected-layers li .layer-label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#layer-selector >>> .selected-layers li .layer-label .buttons {
  display: flex;
}
#layer-selector >>> .selected-layers li button {
  background-color: #17417300;
  border: none;
  color: #ecf0f1;
  margin-right: 5px;
  border-radius: 2px;
  padding: 0px 4px;
  margin-right: 2px;
  cursor: pointer;
}
#layer-selector >>> .selected-layers li button:focus {
  outline: 0;
}
</style>
