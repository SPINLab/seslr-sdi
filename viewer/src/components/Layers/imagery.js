'use strict';
import ImageryLayer from 'cesium/Scene/ImageryLayer';
import TileMapServiceImageryProvider from 'cesium/Scene/TileMapServiceImageryProvider';

export const imageryNames = [
  {
    id: '1942',
    label: '1942',
    children: [
      { id: '1942_13592', label: '13592' },
      { id: '1942_13594', label: '13594' },
      { id: '1942_13597', label: '13597' },
      { id: '1942_13622', label: '13622' },
      { id: '1942_13625', label: '13625' },
      { id: '1942_13628', label: '13628' },
      { id: '1942_13632', label: '13632' },
      { id: '1942_13633', label: '13633' },
      { id: '1942_13639', label: '13639' },
      { id: '1942_13657', label: '13657' },
      { id: '1942_13719', label: '13719' },
      { id: '1942_13728', label: '13728' },
      { id: '1942_13729', label: '13729' },
      { id: '1942_13730', label: '13730' },
      { id: '1942_13731', label: '13731' },
      { id: '1942_13732', label: '13732' },
      { id: '1942_13770', label: '13770' },
      { id: '1942_13771', label: '13771' },
      { id: '1942_13774', label: '13774' },
      { id: '1942_13780', label: '13780' },
      { id: '1942_13781', label: '13781' },
      { id: '1942_13782', label: '13782' },
      { id: '1942_13784', label: '13784' },
      { id: '1942_13786', label: '13786' }
    ]
  },
  {
    id: '1961',
    label: '1961',
    children: [
      { id: '1961_14588', label: '14588' },
      { id: '1961_14590', label: '14590' },
      { id: '1961_14592', label: '14592' },
      { id: '1961_14594', label: '14594' },
      { id: '1961_14596', label: '14596' }
    ]
  },
  {
    id: '1974',
    label: '1974',
    children: [
      { id: '1974_77495', label: '77495' },
      { id: '1974_77496', label: '77496' },
      { id: '1974_77504', label: '77504' },
      { id: '1974_77506', label: '77506' },
      { id: '1974_77508', label: '77508' },
      { id: '1974_77510', label: '77510' },
      { id: '1974_77512', label: '77512' },
      { id: '1974_77514', label: '77514' },
      { id: '1974_77626', label: '77626' },
      { id: '1974_77627', label: '77627' },
      { id: '1974_77628', label: '77628' },
      { id: '1974_77629', label: '77629' },
      { id: '1974_77630', label: '77630' },
      { id: '1974_77632', label: '77632' }
    ]
  },
  {
    id: '1979',
    label: '1979',
    children: [
      { id: '1979_117791', label: '117791' },
      { id: '1979_117793', label: '117793' },
      { id: '1979_117951', label: '117951' },
      { id: '1979_117955', label: '117955' },
      { id: '1979_117956', label: '117956' },
      { id: '1979_117958', label: '117958' }
    ]
  },
  {
    id: '1997',
    label: '1997',
    children: [
      { id: '1997_248568', label: '248568' },
      { id: '1997_248570', label: '248570' },
      { id: '1997_248572', label: '248572' },
      { id: '1997_248574', label: '248574' }
    ]
  },
  {
    id: 'drone',
    label: 'Drone',
    children: [
      { id: 'plakari', label: 'Plakari' },
      { id: 'kiln', label: 'Kiln' },
      { id: 'eba_settlement', label: 'EBA Settlement' },
      { id: 'n_headland_ortho', label: 'N Headland Ortho' },
      { id: 'karababa', label: 'Karababa' },
      { id: 'kazara', label: 'Kazara' },
      { id: 'kastri', label: 'Kastri' },
      { id: 'kylindroi_ortho', label: 'Kylindroi Ortho' }
    ]
  }
];

export const imagery = {};
for (const imageCategory of imageryNames) {
  for (const imageName of imageCategory.children) {
    imagery[imageName.id] = new ImageryLayer(
      new TileMapServiceImageryProvider({
        url: '../tms/1.0.0/' + imageName.id,
        credit: ''
      }),
      { show: false }
    );
  }
}
