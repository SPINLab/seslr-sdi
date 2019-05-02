'use strict';
import GeoJsonDataSource from 'cesium/DataSources/GeoJsonDataSource';
import HeightReference from 'cesium/Scene/HeightReference';
import Property from 'cesium/DataSources/Property';
import Color from 'cesium/Core/Color';

export const featureNames = [
  {
    id: 'mines',
    label: 'Mines'
  },
  {
    id: 'archaeological_surveys',
    label: 'Archaeological Surveys'
  },
  {
    id: 'geology',
    label: 'Geology'
  }
];

export const geologyColors = {
  'alluvial deposits': '#ffd37f',
  amphibolites: '#f25aeb',
  'lacustrine deposits': '#8f67f5',
  'marble layers': '#f5e35b',
  'marbles and cipolins': '#e8beff',
  ophiolites: '#89cd66',
  orthogneisses: '#a8a800',
  'quartz schists': '#734c00',
  schists: '#bee8ff',
  'schists with marble layers': '#6e872f',
  'scree and talus cones': '#c45e73',
  'sliding area': '#74e399',
  'terrestrial deposits': '#5be851'
};

export const surveyColors = {
  'Kampos 2006-2008': '#FF00FF',
  'Keller 1979-1981': '#8B008B',
  'NASK 2012-2014': '#9B30FF',
  'SEEP 1986-1988': '#AB82FF',
  'SEEP 1989-1993': '#5D478B',
  'SESLR 2016-2019': '#EE0000'
};

export const features = {};
for (let featureName of featureNames) {
  const feature = new GeoJsonDataSource();
  feature
    .load(`../features/${featureName.id}.json`, {
      clampToGround: true
    })
    .then(feature => {
      if (featureName.id === 'mines') {
        for (const entity of feature.entities.values) {
          entity.billboard = {
            image: require('../../assets/' + entity.properties.Mines + '.png'),
            scale: 0.3,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: 50000
          };
        }
      } else if (featureName.id === 'archaeological_surveys') {
        for (const entity of feature.entities.values) {
          const survey = Property.getValueOrUndefined(
            entity.properties.arch_proje
          );
          entity.polygon.material = Color.fromCssColorString(
            surveyColors[survey]
          );
        }
      } else if (featureName.id === 'geology') {
        for (const entity of feature.entities.values) {
          const geologyUnit = Property.getValueOrUndefined(
            entity.properties.geology_lo
          );
          entity.polygon.material = Color.fromCssColorString(
            geologyColors[geologyUnit]
          );
        }
      }
    });
  feature.show = false;
  features[featureName.id] = feature;
}
