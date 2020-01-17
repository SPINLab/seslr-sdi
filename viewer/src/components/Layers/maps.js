'use strict';
import ImageryLayer from 'cesium/Scene/ImageryLayer';
import TileMapServiceImageryProvider from 'cesium/Scene/TileMapServiceImageryProvider';

export const mapNames = [
  {
    id: 'topo_1860',
    label: 'Topography (1860)'
  }
];

export const maps = {};
for (let mapName of mapNames) {
  maps[mapName.id] = new ImageryLayer(
    new TileMapServiceImageryProvider({
      url: '../tms/1.0.0/' + mapName.id,
      credit: ''
    }),
    { show: false }
  );
}
