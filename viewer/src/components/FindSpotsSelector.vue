<template>
  <div id="find-spot-selector">
    <button @click="toggleVisibility">
      <span v-if="!findSpots.show" class="mdi mdi-eye"></span>
      <span v-if="findSpots.show" class="mdi mdi-eye-off"></span>
    </button>
    <button @click="selectAll">
      <span class="mdi mdi-checkbox-multiple-marked"></span>
    </button>
    <button @click="deselectAll">
      <span class="mdi mdi-checkbox-multiple-blank-outline"></span>
    </button>
    <h3>Find Spots:</h3>
    <tree
      id="treePrehistoric"
      ref="treePrehistoric"
      :data="prehistoric"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeNeolithic"
      ref="treeNeolithic"
      :data="neolithic"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeBronzeAge"
      ref="treeBronzeAge"
      :data="bronzeAge"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeProtoGeometric"
      ref="treeProtoGeometric"
      :data="protoGeometric"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeGeometric"
      ref="treeGeometric"
      :data="geometric"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeArchaic"
      ref="treeArchaic"
      :data="archaic"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeClassical"
      ref="treeClassical"
      :data="classical"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeHellenistic"
      ref="treeHellenistic"
      :data="hellenistic"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeRoman"
      ref="treeRoman"
      :data="roman"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeByzantine"
      ref="treeByzantine"
      :data="byzantine"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeFrankish"
      ref="treeFrankish"
      :data="frankish"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeOttoman"
      ref="treeOttoman"
      :data="ottoman"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
    <tree
      id="treeModern"
      ref="treeModern"
      :data="modern"
      :options="treeOptions"
      @node:checked="onNodeChecked"
      @node:unchecked="onNodeUnchecked"
      @node:expanded="onNodeExpanded"
    ></tree>
  </div>
</template>

<script>
import Vue from 'vue';
import LiquorTree from 'liquor-tree';

import Property from 'cesium/DataSources/Property';
import HeightReference from 'cesium/Scene/HeightReference';

import { periods, periodCode, periodColors } from './FindSpots/periods';
import { icons } from './FindSpots/icons';
import { findSpots } from './FindSpots/features';

Vue.prototype.findSpots = findSpots;

const exportSVG = svg => {
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

const styleSpot = (spot, period) => {
  let type = Property.getValueOrUndefined(spot.properties.type);
  type = type.replace(/ /g, '_');
  const color = periodColors[period];

  if (typeof icons[type] !== 'undefined') {
    spot.billboard = {
      image: exportSVG(icons[type].replace(/#afafaf/g, color)),
      scale: 0.15,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: 50000
    };
  } else {
    spot.billboard = undefined;
  }
};

export default {
  name: 'FindSpotsSelector',
  components: {
    tree: LiquorTree
  },
  data() {
    return {
      prehistoric: periods.prehistoric,
      neolithic: periods.neolithic,
      bronzeAge: periods.bronzeAge,
      protoGeometric: periods.protoGeometric,
      geometric: periods.geometric,
      archaic: periods.archaic,
      classical: periods.classical,
      hellenistic: periods.hellenistic,
      roman: periods.roman,
      byzantine: periods.byzantine,
      frankish: periods.frankish,
      ottoman: periods.ottoman,
      modern: periods.modern,
      treeOptions: {
        checkbox: true,
        selectable: false
      },
      visibleSpots: {}
    };
  },
  methods: {
    onNodeChecked(node) {
      if (node.children.length === 0) {
        const period = periodCode[node.text];
        fetch('../api/periods/' + period, {
          credentials: 'include'
        }).then(response => {
          response.json().then(json => {
            this.addSpots(json.spot_ids, period);
          });
        });
      }
      this.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
      this.$parent.$refs.Legend.$refs.carousel.goToPage(0);
    },
    onNodeUnchecked(node) {
      if (node.children.length === 0) {
        const period = periodCode[node.text];
        fetch('../api/periods/' + period, {
          credentials: 'include'
        }).then(response => {
          response.json().then(json => {
            this.removeSpots(json.spot_ids, period);
          });
        });
      }
      this.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    onNodeExpanded(node) {
      for (let sibling of this.$children) {
        if (sibling.model[0] !== node) {
          sibling.collapseAll();
        }
      }
    },
    documentClick(e) {
      const el = this.$el;
      const target = e.target;
      if (el !== target && !el.contains(target)) {
        for (let child of this.$children) {
          child.collapseAll();
        }
      }
    },
    selectAll() {
      for (const component in this.$refs) {
        if (this.$refs.hasOwnProperty(component)) {
          const tree = this.$refs[component];
          const uncheckedNodes = tree.findAll({ state: { checked: false } });
          if (typeof uncheckedNodes !== 'undefined') {
            uncheckedNodes.forEach(node => {
              node.check();
            });
          }
        }
      }
    },
    deselectAll() {
      for (const component in this.$refs) {
        if (this.$refs.hasOwnProperty(component)) {
          const tree = this.$refs[component];
          const checkedNodes = tree.checked();
          if (typeof checkedNodes !== 'undefined') {
            checkedNodes.forEach(node => {
              node.uncheck();
            });
          }
        }
      }
    },
    toggleVisibility() {
      findSpots.show = !findSpots.show;
      this.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
      this.$forceUpdate();
    },
    updateSpotVisibility() {
      for (let entity of findSpots.entities.values) {
        const id = Property.getValueOrUndefined(entity.properties.find_spot_id);
        const find_spot_type = Property.getValueOrUndefined(
          entity.properties.type
        );
        if (typeof this.visibleSpots[id] !== 'undefined') {
          if (this.visibleSpots[id].length > 0) {
            if (find_spot_type !== 'void') {
              styleSpot(entity, this.visibleSpots[id][0]);
              entity.show = true;
            }
          } else {
            entity.show = false;
          }
        }
      }
      this.$parent.$refs.CesiumViewer.$options.viewer.scene.requestRender();
    },
    addSpots(spot_ids, period) {
      for (let id of spot_ids) {
        if (typeof this.visibleSpots[id] !== 'undefined') {
          this.visibleSpots[id].push(period);
        } else {
          this.visibleSpots[id] = [period];
        }
      }
      this.updateSpotVisibility();
    },
    removeSpots(spot_ids, period) {
      for (let id of spot_ids) {
        this.visibleSpots[id].splice(this.visibleSpots[id].indexOf(period), 1);
      }
      this.updateSpotVisibility();
    }
  },
  created() {
    document.addEventListener('click', this.documentClick);
  },
  destroyed() {
    document.removeEventListener('click', this.documentClick);
  }
};
</script>

<style scoped>
#find-spot-selector {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: small;
  color: #fff;
}

#find-spot-selector >>> button {
  background-color: inherit;
  border: none;
  cursor: pointer;
}
#find-spot-selector >>> button > span {
  font-size: larger;
  color: white;
}

#find-spot-selector >>> h3 {
  margin: 0;
  margin-left: 6px;
}

#find-spot-selector >>> .tree {
  display: block;
  overflow: auto;
  padding: 0px;
  margin: 0px;
  white-space: nowrap;
  overflow: visible;
}

#find-spot-selector >>> .tree > .tree-root {
  padding: 0px;
  margin: 2px;
}

#find-spot-selector >>> .tree-node > .tree-content {
  background-color: #2c3e50;
  padding-left: 0;
  padding-right: 0;
}

#find-spot-selector >>> li > ul.tree-children li {
  display: flex;
  flex: 1;
}

#find-spot-selector >>> li > ul.tree-children {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 9;
  background-color: #2c3e50;
  border-left-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-color: black;
  border-radius: 2px;
  margin-left: -1px;
}

#find-spot-selector >>> .treechildren > .tree-arrow {
  display: none;
}

#find-spot-selector >>> .tree-filter-empty {
  margin-top: 5px;
  font-size: 9pt;
}

#find-spot-selector >>> .tree-checkbox {
  width: 20px;
  height: 20px;
}

#find-spot-selector >>> .tree-checkbox.checked:after {
  left: 7px;
  top: 3px;
  height: 8px;
  width: 3px;
}

#find-spot-selector >>> .tree-arrow.has-child:after {
  height: 7px;
  width: 7px;
}

#find-spot-selector >>> .tree-node.matched > .tree-content {
  background: #34495e;
}

#find-spot-selector >>> .tree-node.selected > .tree-content {
  background-color: #34495e;
}

#find-spot-selector >>> .tree-anchor {
  color: #ecf0f1;
}

#find-spot-selector >>> .tree-node:not(.z) > .tree-content:hover {
  background-color: #34495e;
}

#find-spot-selector >>> .tree-checkbox.checked,
#find-spot-selector >>> .tree-checkbox.indeterminate {
  background-color: #16a085;
  border-color: #16a085;
}

#find-spot-selector >>> .tree-arrow.has-child:after {
  border: 1.5px solid #2980b9;
  border-left: 0;
  border-top: 0;
}

#find-spot-selector
  >>> #treePrehistoric
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #000000;
}
#find-spot-selector
  >>> #treeNeolithic
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #696969;
}
#find-spot-selector
  >>> #treeBronzeAge
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #cd8162;
}
#find-spot-selector
  >>> #treeProtoGeometric
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #9bcd9b;
}
#find-spot-selector
  >>> #treeGeometric
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #bcee68;
}
#find-spot-selector
  >>> #treeArchaic
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #ee0000;
}
#find-spot-selector
  >>> #treeClassical
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #ffff00;
}
#find-spot-selector
  >>> #treeHellenistic
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #7ec0ee;
}
#find-spot-selector >>> #treeRoman .tree-node .tree-content .tree-anchor span {
  border-bottom: 3px solid #7a378b;
}
#find-spot-selector
  >>> #treeByzantine
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #ff7f00;
}
#find-spot-selector
  >>> #treeFrankish
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #ffe4b5;
}
#find-spot-selector
  >>> #treeOttoman
  .tree-node
  .tree-content
  .tree-anchor
  span {
  border-bottom: 3px solid #556b2f;
}
#find-spot-selector >>> #treeModern .tree-node .tree-content .tree-anchor span {
  border-bottom: 3px solid #fffafa;
}
</style>
