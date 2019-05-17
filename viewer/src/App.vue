<template>
  <div id="app">
    <div id="top" ref="top" class="row">
      <ToggleButton
        id="top-toggle"
        direction="down"
        color="#fff"
        @click.native="toggleTop"
      />
      <FindSpotsSelector />
    </div>
    <div id="bottom" class="row">
      <div id="left" ref="left" class="column">
        <ToggleButton
          id="left-toggle"
          direction="right"
          color="#fff"
          @click.native="toggleLeft"
        />
        <div
          v-bar="{ preventParentScroll: false, scrollThrottle: 30 }"
          style="height: 100%; width: 103%;"
        >
          <div>
            <div class="layer-legend-container">
              <LayerSelector />
              <Legend ref="Legend" />
            </div>
          </div>
        </div>
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
import ToggleButton from './components/ToggleButton';

export default {
  name: 'app',
  components: {
    CesiumViewer,
    FindSpotsSelector,
    LayerSelector,
    Legend,
    ToggleButton
  },
  data() {
    return {
      urlParams: new URLSearchParams(location.search)
    };
  },
  methods: {
    toggleLeft() {
      if (this.$refs.left.classList.contains('left-expand')) {
        this.$refs.left.classList.remove('left-expand');
        this.$refs.left.classList.add('left-hide');
      } else {
        this.$refs.left.classList.remove('left-hide');
        this.$refs.left.classList.add('left-expand');
      }
    },
    toggleTop() {
      if (this.$refs.top.classList.contains('top-expand')) {
        this.$refs.top.classList.remove('top-expand');
        this.$refs.top.classList.add('top-hide');
      } else {
        this.$refs.top.classList.remove('top-hide');
        this.$refs.top.classList.add('top-expand');
      }
    }
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
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
}

#app >>> #top {
  border-bottom: 1px solid black;
  background-color: #2c3e50;
  z-index: 3;
}

#app >>> .row {
  display: flex;
  flex-direction: row;
  width: 100vw;
  position: relative;
}

#app >>> .column {
  display: flex;
}

#app >>> #bottom {
  flex-grow: 1;
  min-height: 0;
}

#app >>> #left {
  padding: 5px;
  width: 20%;
  min-width: 15rem;
  max-width: 20rem;
  z-index: 2;
  border-right: 1px solid black;
  padding-top: 1rem;
  background-color: #2c3e50;
}

#app >>> #right {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  position: relative;
}

#app >>> #left-toggle {
  display: none;
  position: absolute;
  top: 4rem;
  right: -2.6rem;
}

#app >>> #top-toggle {
  display: none;
  position: absolute;
  bottom: -3rem;
  left: 0.5rem;
}

#app >>> .layer-legend-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  height: 100%;
  width: 95%;
}

@keyframes expandLeft {
  from {
    transform: translate(-99%, 0%);
  }
  to {
    transform: translate(0%, 0%);
  }
}

@keyframes hideLeft {
  from {
    transform: translate(0%, 0%);
  }
  to {
    transform: translate(-99%, 0%);
  }
}

.left-expand {
  animation-name: expandLeft;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.left-hide {
  animation-name: hideLeft;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@keyframes expandTop {
  from {
    transform: translate(0%, -99%);
  }
  to {
    transform: translate(0%, 0%);
  }
}

@keyframes hideTop {
  from {
    transform: translate(0%, 0%);
  }
  to {
    transform: translate(0%, -99%);
  }
}

.top-expand {
  animation-name: expandTop;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.top-hide {
  animation-name: hideTop;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

@media screen and (max-width: 800px) {
  #app >>> #left {
    transform: translate(-98%, 0%);
  }
  #app >>> #left-toggle {
    display: unset;
  }
  #app >>> #right {
    position: absolute;
  }
}

@media screen and (min-width: 800px) {
  #app >>> #left {
    transform: translate(0%, 0%);
    animation: none;
  }
}

@media screen and (max-width: 650px) {
  #app >>> #top {
    transform: translate(0%, -98%);
  }
  #app >>> #top-toggle {
    display: unset;
  }
  #app >>> #bottom {
    position: absolute;
    height: 100%;
  }
}

@media screen and (min-width: 650px) {
  #app >>> #top {
    transform: translate(0%, 0%);
    animation: none;
  }
}
</style>
