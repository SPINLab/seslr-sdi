<template>
  <div class="legend-container" id="legend">
    <carousel ref="carousel" :pagination-active-color="'#2980b9'" :per-page="1">
      <slide>
        <ul class="two-columns">
          <li v-for="item in items.findspot" :key="item.name">
            <div class="legend-item">
              <img class="legend-icon" :src="item.icon" :alt="item.name" />
              <span>{{ item.name }}</span>
            </div>
          </li>
        </ul>
      </slide>
      <slide>
        <ul>
          <li v-for="item in items.mines" :key="item.name">
            <div class="legend-item">
              <img class="legend-icon" :src="item.icon" :alt="item.name" />
              <span>{{ item.name }}</span>
            </div>
          </li>
        </ul>
      </slide>
      <slide>
        <ul>
          <li v-for="item in items.survey" :key="item.name">
            <div class="legend-item">
              <svg height="20" width="20">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="black"
                  stroke-width="1"
                  :fill="item.color"
                />
              </svg>
              <span>{{ item.name }}</span>
            </div>
          </li>
        </ul>
      </slide>
      <slide>
        <ul class="two-columns">
          <li v-for="item in items.geology" :key="item.name">
            <div class="legend-item">
              <svg height="20" width="20">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="black"
                  stroke-width="1"
                  :fill="item.color"
                />
              </svg>
              <span>{{ item.name }}</span>
            </div>
          </li>
        </ul>
      </slide>
    </carousel>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';
import toLower from 'lodash/toLower';
import startCase from 'lodash/startCase';

import { icons } from './FindSpots/icons';
import { surveyColors, geologyColors } from './Layers/features';

const legendItems = {
  findspot: [],
  mines: [],
  survey: [],
  geology: []
};

for (let type of Object.keys(icons)) {
  legendItems.findspot.push({
    name: startCase(toLower(type)),
    icon: require('../assets/' + type + '.svg')
  });
}

for (let mine of ['ASB', 'Fe-Cu', 'Fe-Mn', 'Fe', 'Mn', 'PBG', 'tc']) {
  legendItems.mines.push({
    name: mine,
    icon: require('../assets/' + mine + '.png')
  });
}

for (let survey in surveyColors) {
  if (surveyColors.hasOwnProperty(survey)) {
    legendItems.survey.push({
      name: startCase(toLower(survey)),
      color: surveyColors[survey]
    });
  }
}

for (let unit in geologyColors) {
  if (geologyColors.hasOwnProperty(unit)) {
    legendItems.geology.push({
      name: startCase(toLower(unit)),
      color: geologyColors[unit]
    });
  }
}

export default {
  name: 'Legend',
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
      items: legendItems
    };
  }
};
</script>

<style scoped>
#legend {
  border-top: 1px solid black;
}
#legend >>> ul {
  list-style-type: none;
  color: #ecf0f1;
  padding: 8px;
  font-size: 8pt;
}
#legend >>> .two-columns {
  columns: 2;
}
#legend >>> .two-columns li {
  list-style-position: inside;
  page-break-inside: avoid;
  break-inside: avoid;
}
#legend >>> .legend-item {
  display: flex;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
#legend >>> .legend-item svg {
  margin-right: 15px;
  overflow: unset;
}
#legend >>> .legend-icon {
  width: 25px;
  height: 25px;
  margin-right: 15px;
}
#legend >>> .VueCarousel-slide {
  max-width: 100%;
}
#legend >>> .VueCarousel-dot {
  margin-top: 0 !important;
}
#legend >>> .VueCarousel-dot-button:focus {
  outline: 0;
}
</style>
