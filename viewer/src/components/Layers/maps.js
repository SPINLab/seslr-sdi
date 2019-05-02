'use strict';
import ImageryLayer from 'cesium/Scene/ImageryLayer';
import createTileMapServiceImageryProvider from 'cesium/Scene/createTileMapServiceImageryProvider';

export const mapNames = [
  {
    id: 'topo_1860',
    label: 'Topography (1860)'
  }
];

export const maps = {};
for (let mapName of mapNames) {
  maps[mapName.id] = new ImageryLayer(
    new createTileMapServiceImageryProvider({
      url: '../tms/1.0.0/' + mapName.id,
      credit: ''
    }),
    { show: false }
  );
}
