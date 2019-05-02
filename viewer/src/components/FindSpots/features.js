'use strict';
import GeoJsonDataSource from 'cesium/DataSources/GeoJsonDataSource';

export const findSpots = new GeoJsonDataSource();

findSpots
  .load('../features/find_spots.json', {
    clampToGround: true
  })
  .then(feature => {
    for (const entity of feature.entities.values) {
      entity.billboard = undefined;
    }
  });
