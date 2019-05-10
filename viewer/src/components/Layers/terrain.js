import CesiumTerrainProvider from 'cesium/Core/CesiumTerrainProvider';
import EllipsoidTerrainProvider from 'cesium/Core/EllipsoidTerrainProvider';
import createWorldTerrain from 'cesium/Core/createWorldTerrain';
import ProviderViewModel from 'cesium/Widgets/BaseLayerPicker/ProviderViewModel';

export const terrainProviders = {
  seslr: new CesiumTerrainProvider({
    url: '../terrain/tilesets/tiles',
    requestVertexNormals: true
  }),
  cesiumWorld: createWorldTerrain(),
  ellipsoid: new EllipsoidTerrainProvider()
};

export const terrainProvidersViewModels = [
  new ProviderViewModel({
    name: 'SESLR Terrain Model',
    tooltip: 'SESLR Terrain Model',
    iconUrl: './Widgets/Images/TerrainProviders/CesiumWorldTerrain.png',
    creationFunction: () => {
      return terrainProviders.seslr;
    }
  }),
  new ProviderViewModel({
    name: 'Cesium World Terrain',
    tooltip: 'Cesium World Terrain',
    iconUrl: './Widgets/Images/TerrainProviders/CesiumWorldTerrain.png',
    creationFunction: () => {
      return terrainProviders.cesiumWorld;
    }
  }),
  new ProviderViewModel({
    name: 'World Ellipsoid',
    tooltip: 'World Ellipsoid',
    iconUrl: './Widgets/Images/TerrainProviders/Ellipsoid.png',
    creationFunction: () => {
      return terrainProviders.ellipsoid;
    }
  })
];
