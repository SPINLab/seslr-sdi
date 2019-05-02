<template>
  <div id="app">
    <div id="top" class="column">
      <FindSpotsSelector />
    </div>
    <div id="bottom" class="row">
      <div id="left" class="column">
        <LayerSelector />
        <Legend ref="Legend" />
      </div>
      <div id="right" class="column">
        <CesiumViewer ref="CesiumViewer" />
      </div>
    </div>
  </div>
</template>

<script>
import CesiumViewer from './components/CesiumViewer';
import FindSpotsSelector from './components/FindSpotsSelector';
import LayerSelector from './components/LayerSelection/LayerSelector';
import Legend from './components/Legend';

export default {
  name: 'app',
  components: {
    CesiumViewer,
    FindSpotsSelector,
    LayerSelector,
    Legend
  },
  data() {
    return {
      urlParams: new URLSearchParams(location.search)
    };
  }
};
</script>

<style>
html,
body,
#cesium-container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.vb > .vb-dragger {
  z-index: 5;
  width: 12px;
  right: 0;
  margin-left: 3px;
}

.vb > .vb-dragger > .vb-dragger-styler {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: rotate3d(0, 0, 0, 0);
  transform: rotate3d(0, 0, 0, 0);
  -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  background-color: #297fb975;
  margin: 5px 5px 5px 0;
  border-radius: 20px;
  height: calc(100% - 10px);
  display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: #2980b9;
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
  background-color: #2980b9;
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
  background-color: #2980b9;
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: #2980b9;
}
</style>

<style scoped>
#app {
  font-family: 'Lato', sans-serif;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
}

#app >>> #top {
  border-bottom: 1px solid black;
}

#app >>> .row {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  width: 100vw;
}

#app >>> .column {
  display: flex;
}

#app >>> #left {
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 5px;
  width: 20%;
  min-width: 15rem;
  max-width: 20rem;
  z-index: 2;
  border-right: 1px solid black;
  padding-top: 1rem;
}
#app >>> #right {
  flex-grow: 1;
  width: 100%;
  height: 100%;
}
</style>
