<template>
  <div id="database-search">
    <div id="search-form">
      <button id="search-button">
        <span class="mdi mdi-magnify"></span>
      </button>
      <input
        id="search-field"
        type="text"
        placeholder="Enter a keyword to search"
        @input="searchDatabase"
      />
    </div>
    <div id="search-results" v-bar v-show="searchResults.length > 0">
      <ul>
        <li v-for="result in searchResults" :key="result.find_spot_id">
          <button @click="goToFindSpot(result)">
            <div class="find-spot-id">Find spot {{ result.find_spot_id }}</div>
            <div class="find-spot-description">{{ result.shortend_description }}</div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

import Cartesian3 from "cesium/Core/Cartesian3";
import Property from "cesium/DataSources/Property";
import Color from "cesium/Core/Color";
import HeightReference from "cesium/Scene/HeightReference";

import { findSpots } from "../../FindSpots/features";

export default {
  name: "DatabaseSearch",
  data() {
    return {
      searchResults: []
    };
  },
  methods: {
    searchDatabase: debounce(async function(e) {
      const response = await fetch(`../api/search/?query=${e.target.value}`);
      this.searchResults = await response.json();
    }, 500),
    goToFindSpot(findSpot) {
      const coordinates = findSpot.geometry.coordinates;
      this.$parent.$parent.$options.viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          coordinates[0],
          coordinates[1],
          1500.0
        )
      });
      const entity = findSpots.entities.values.find(entity => {
        const entityFindSpotId = Property.getValueOrUndefined(
          entity.properties.find_spot_id
        );
        return entityFindSpotId === findSpot.find_spot_id;
      });
      this.$parent.$parent.$options.viewer.selectedEntity = entity;
      this.point.position = Cartesian3.fromDegrees(
        coordinates[0],
        coordinates[1]
      );
      this.point.properties = entity.properties;
      document.activeElement.blur();
    }
  },
  mounted() {
    this.point = this.$parent.$parent.$options.viewer.entities.add({
      point: {
        pixelSize: 22,
        color: new Color(255, 255, 0, 0.5),
        heightReference: HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: 50000
      }
    });
    const canvas = document.querySelector("canvas");
    canvas.addEventListener("click", () => {
      document.activeElement.blur();
    });
  }
};
</script>

<style scoped>
#database-search {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: fit-content;
  direction: rtl;
  margin: 0 3px;
  z-index: 3;
}

#database-search:focus-within #search-form {
  border-color: #444 !important;
  box-shadow: 0 0 8px #2980b9 !important;
}

#database-search:hover #search-form {
  box-shadow: 0 0 8px #aef;
}

#database-search:hover #search-field,
#database-search:focus-within #search-field {
  width: calc(300px - 38px);
  padding: 2px;
}

#database-search:hover #search-results,
#database-search:focus-within #search-results {
  display: block;
}

#search-form {
  display: flex;
  border: 1px solid #444;
  border-radius: 2px;
  width: fit-content;
}

#search-field {
  width: 0;
  padding: 0;
  border: none;
  transition: width 0.2s ease-out;
  direction: ltr;
}

#search-field:focus {
  outline: none;
}

button {
  border: none;
  cursor: pointer;
  background-color: unset;
  color: unset;
  font: unset;
}

#search-button {
  height: 30px;
  width: 30px;
  padding: 0;
  color: white;
  background-color: #2c3e50;
}

#search-button:focus {
  outline: none;
}

#search-button > span {
  font-size: 22pt;
}

#search-results {
  display: none;
  margin-right: 30px;
  margin-left: 2px;
  background-color: #2c3e50;
  color: white;
  border: 1px solid black;
  border-radius: 2px;
  direction: ltr;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 1px;
  text-align: start;
  max-height: 400px;
}

li {
  display: flex;
  margin-right: -20px;
}

li:hover {
  background-color: hsl(210, 28%, 38%) !important;
}

li:focus {
  outline: none;
}

li:nth-child(even) {
  background-color: hsl(210, 28%, 30%);
}

li > button {
  padding: 12px 10px;
  width: 100%;
  text-align: start;
}

.find-spot-id {
  padding-bottom: 4px;
}

.find-spot-description {
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: hsl(210, 28%, 88%);
}
</style>
