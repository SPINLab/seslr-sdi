<template>
  <div id="infobox" style="visibility: hidden;">
    <div
      v-bar="{ preventParentScroll: true, scrollThrottle: 30 }"
      style="height: 100%;"
    >
      <div>
        <div class="info-container">
          <div v-if="clickedFindSpot">
            <div class="info-item">
              <h2>Find Spot</h2>
              <div v-html="findSpotHTML"></div>
            </div>
            <div class="info-item">
              <h2>Find</h2>
              <div v-html="findHTML"></div>
            </div>
            <div class="info-item">
              <h2>Photos</h2>
              <carousel
                v-if="photos.length > 0"
                ref="carousel"
                :pagination-active-color="'#2980b9'"
                :per-page="1"
                :navigationEnabled="true"
              >
                <slide v-for="photo in photos" :key="photo.id">
                  <img
                    v-img="imgOptions"
                    :src="photo.url"
                    :alt="photo.description"
                  />
                  <p>{{ photo.date }}</p>
                  <p>{{ photo.description }}</p>
                </slide>
              </carousel>
              <p v-if="photos.length === 0">
                No photos found for this find spot.
              </p>
            </div>
          </div>
          <div v-if="!clickedFindSpot" v-html="infoHTML"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

import { Carousel, Slide } from 'vue-carousel';
import VueImg from 'v-img';

import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import replace from 'lodash/replace';
import capitalize from 'lodash/capitalize';

import Property from 'cesium/DataSources/Property';

Vue.use(VueImg);

const listToString = (list, delimiter) => {
  return replace(list.join(delimiter), new RegExp('_', 'g'), ' ')
    .split(' ')
    .map(capitalize)
    .join(' ');
};

export default {
  name: 'Infobox',
  components: {
    Carousel,
    Slide
  },
  data() {
    return {
      findSpotHTML: '',
      findHTML: '',
      photos: [],
      infoHTML: '',
      clickedFindSpot: false,
      imgOptions: {
        group: 'FindSpotImages',
        altAsTitle: true,
        sourceButton: true
      }
    };
  },
  mounted() {
    this.$parent.$options.viewer.selectedEntityChanged.addEventListener(
      this.updateInfo
    );
  },
  methods: {
    updateInfo(entity) {
      if (typeof entity !== 'undefined') {
        this.$el.style.visibility = 'visible';

        const findSpotID = Property.getValueOrUndefined(
          entity.properties.find_spot_id
        );
        const geology = Property.getValueOrUndefined(entity.properties.Geology);
        const archProject = Property.getValueOrUndefined(
          entity.properties.arch_proje
        );
        const mines = Property.getValueOrUndefined(entity.properties.Mines);

        this.clickedFindSpot = false;
        if (typeof findSpotID !== 'undefined') {
          this.clickedFindSpot = true;
          this.updateFindSpotInfo(findSpotID);
        } else if (typeof geology !== 'undefined') {
          const geology_lo = Property.getValueOrUndefined(
            entity.properties.geology_lo
          );
          this.infoHTML = `<h2>Geology</h2>
            <div class="info-item">
            <h3>Code</h3>
            ${geology}
            <h3>Description</h3>
            ${startCase(geology_lo)}
            </div>`;
        } else if (typeof archProject !== 'undefined') {
          const method = Property.getValueOrUndefined(entity.properties.method);
          this.infoHTML = `<h2>Archeological Survey</h2>
            <div class="info-item">
            <h3>Project</h3>
            ${archProject}
            <h3>Method</h3>
            ${capitalize(method)}
            </div>`;
        } else if (typeof mines !== 'undefined') {
          const mines_long = Property.getValueOrUndefined(
            entity.properties.mines_long
          );
          this.infoHTML = `<h2>Mines</h2>
            <div class="info-item">
            <h3>Type</h3>
            ${mines}
            <h3>Description</h3>
            ${startCase(mines_long)}
            </div>`;
        }
      } else {
        this.$el.style.visibility = 'hidden';
      }
    },
    updateFindSpotInfo(findSpotID) {
      const findSpotInfo = fetch(`../dev/api/find_spots/${findSpotID}`, {
        credentials: 'include'
      });

      const findInfo = fetch(`../dev/api/find_spots/${findSpotID}/find`, {
        credentials: 'include'
      });

      const photos = fetch(`../dev/api/find_spots/${findSpotID}/photos`, {
        credentials: 'include'
      });

      Promise.all([findSpotInfo, findInfo, photos]).then(responses => {
        const promises = [];
        for (let response of responses) {
          promises.push(response.json());
        }
        Promise.all(promises).then(jsons => {
          const findSpot = jsons[0];
          const find = jsons[1];
          const photos = jsons[2];

          this.parseFindSpotData(findSpot);
          this.parseFindData(find);
          this.parsePhotosData(photos);
        });
      });
    },
    parseFindSpotData(findSpot) {
      let findSpotHTML;
      if (typeof findSpot.message === 'undefined') {
        findSpotHTML = `<h3>Type</h3>
            <p>${startCase(toLower(replace(findSpot.type, '_', ' ')))}</p>
            <h3>Toponym</h3>
            <p>${findSpot.toponym}</p>
            <h3>Description</h3>
            <p>${findSpot.description}</p>
            <h3>Chronology</h3>
            <p>${findSpot.chronology.join(' | ')}</p>`;
      } else {
        findSpotHTML = '<p>No information found on this find spot.</p>';
      }
      this.findSpotHTML = findSpotHTML;
    },
    parseFindData(find) {
      let findHTML;
      if (typeof find.message === 'undefined') {
        findHTML = '';
        if (find.description !== null) {
          findHTML += `<h3>Description</h3><p>${find.description}</p>`;
        }
        if (find.features !== null) {
          findHTML += `<h3>Features</h3><p>${listToString(
            find.features,
            ' | '
          )}</p>`;
        }
        if (find.features_architecture !== null) {
          findHTML += `<h3>Features architecture</h3>
                <p>${listToString(find.features_architecture, ' | ')}</p>`;
        }
        if (find.features_sepulchral !== null) {
          findHTML += `<h3>Features sepulchral</h3>
                <p>${listToString(find.features_sepulchral, ' | ')}</p>`;
        }
        if (find.material !== null) {
          findHTML += `<h3>Material</h3><p>${listToString(
            find.material,
            ' | '
          )}</p>`;
        }
        if (find.material_bone !== null) {
          findHTML += `<h3>Material bone</h3>
              <p>${listToString(find.material_bone, ' | ')}</p>`;
        }
        if (find.material_building !== null) {
          findHTML += `<h3>Material building</h3>
                <p>${listToString(find.material_building, ' | ')}</p>`;
        }
      } else {
        findHTML = '<p>No information found on this find.</p>';
      }
      this.findHTML = findHTML;
    },
    parsePhotosData(photos) {
      if (typeof photos.message === 'undefined') {
        this.photos = photos;
      } else {
        this.photos = [];
      }
    }
  }
};
</script>

<style scoped>
#infobox {
  min-width: 20%;
  max-width: 40%;
  height: 70%;
  overflow: auto;
  padding: 1rem;
  background-color: #2c3e50;
  border: 1px solid black;
  border-radius: 4px;
  color: #fff;
  font-size: small;
}

#infobox >>> .info-container {
  margin-right: 1rem;
}

#infobox >>> h2 {
  font-size: 150%;
  font-weight: bold;
  border-bottom: 1px solid white;
  margin: 0.8rem 0;
  padding: 0.4rem 0;
}

#infobox >>> h3 {
  font-size: 120%;
  font-weight: bold;
  margin: 0.6rem 0;
}

#infobox >>> .info-item {
  padding: 4px;
}

#infobox >>> img {
  max-width: 100%;
  max-height: 20rem;
  width: auto;
  height: auto;
}

#infobox >>> .VueCarousel-slide {
  flex-direction: column;
  display: flex;
  align-items: center;
}

#infobox >>> .VueCarousel-slide p {
  margin: 0.2rem;
}

#infobox >>> .VueCarousel-navigation-button {
  color: white;
  font-size: x-large;
  transform: unset;
}

#infobox >>> .VueCarousel-navigation-prev {
  left: -0.8rem;
}

#infobox >>> .VueCarousel-navigation-next {
  right: -0.8rem;
}

#infobox >>> .VueCarousel-navigation-button:focus {
  outline: none;
}

#infobox >>> .VueCarousel-navigation-button:hover {
  color: #2980b9;
}
</style>
