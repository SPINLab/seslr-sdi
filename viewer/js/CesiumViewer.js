'use strict';

const getUrlParams = function(prop) {
    var params = {};
    var search = decodeURIComponent(
        window.location.href.slice(window.location.href.indexOf('?') + 1)
    );
    var definitions = search.split('&');

    definitions.forEach(function(val, key) {
        var parts = val.split('=', 2);
        params[parts[0]] = parts[1];
    });

    return prop && prop in params ? params[prop] : params;
};

const urlParams = getUrlParams();

Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZWNjNmNiOC0xZDhiLTQ1NTktOGNiZi1jZjE3YzIwMDNkMDMiLCJpZCI6NDk1LCJpYXQiOjE1MjUyNTUyNzV9.R-_alHqdFwfZODeZRMbU3b_Cqakop-X5w2mbtoAS3fA';

const terrainProvider = new Cesium.CesiumTerrainProvider({
    url: '/terrain/tilesets/tiles'
});

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: true,
    animation: false,
    timeline: false,
    vrButton: false,
    sceneModePicker: true,
    navigationInstructionsInitiallyVisible: false,
    selectionIndicator: false,
    terrainProvider: terrainProvider,
    // terrainProviderViewModels: providers.terrain.viewModels,
    // imageryProvider: false,
    // imageryProviderViewModels: providers.imagery.viewModels,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    mapProjection: new Cesium.WebMercatorProjection(Cesium.Ellipsoid.WGS84)
});

// Style the infobox
const frame = viewer.infoBox.frame;
frame.addEventListener(
    'load',
    function() {
        const cssLink = frame.contentDocument.createElement('link');
        cssLink.href = Cesium.buildModuleUrl('../../../../css/infobox.css');
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        viewer.infoBox.frame.contentDocument.head.appendChild(cssLink);
    },
    false
);

viewer.scene.mode = parseInt(urlParams.mode) || 3;
viewer.sceneModePicker.viewModel.duration = 0;

const homeViewPosition = {
    '3D': {
        x: 4593831.766374706,
        y: 2095344.1934905865,
        z: 3899118.3510605167
    },
    '2D': {
        x: 4614210.007026895,
        y: 2096711.9402057289,
        z: 3940807.687153852
    }
};
const homeViewOrientation = {
    '3D': {
        heading: 5.996852473587961,
        pitch: -0.5282780951788908,
        roll: 6.282120347716106
    },
    '2D': {
        heading: 2 * Math.PI,
        pitch: -Math.PI / 2,
        roll: 0
    }
};

if (viewer.scene.mode === 3) {
    viewer.camera.setView({
        destination: homeViewPosition['3D'],
        orientation: homeViewOrientation['3D']
    });
} else {
    viewer.camera.setView({
        destination: homeViewPosition['2D'],
        orientation: homeViewOrientation['2D']
    });
}

viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(
    commandInfo
) {
    if (viewer.scene.mode === 3) {
        viewer.camera.flyTo({
            destination: homeViewPosition['3D'],
            orientation: homeViewOrientation['3D'],
            duration: 0.5
        });
    } else {
        viewer.camera.flyTo({
            destination: homeViewPosition['2D'],
            orientation: homeViewOrientation['2D'],
            duration: 0.5
        });
    }

    commandInfo.cancel = true;
});

const types = {
    large_cluster_buildings: Cesium.Color.fromCssColorString('#3d7d5a'),
    marble_quarry: Cesium.Color.fromCssColorString('#cd3b61'),
    kiln: Cesium.Color.fromCssColorString('#62e274'),
    terrace: Cesium.Color.fromCssColorString('#5582e7'),
    small_cluster_buildings: Cesium.Color.fromCssColorString('#afdb46'),
    inscription: Cesium.Color.fromCssColorString('#3059a8'),
    paved_road: Cesium.Color.fromCssColorString('#ded543'),
    church: Cesium.Color.fromCssColorString('#5f8dce'),
    road: Cesium.Color.fromCssColorString('#9de36d'),
    fortress: Cesium.Color.fromCssColorString('#c9412a'),
    tower: Cesium.Color.fromCssColorString('#58e59a'),
    harbour_installation: Cesium.Color.fromCssColorString('#e26b5e'),
    bridge: Cesium.Color.fromCssColorString('#5be9c8'),
    quarry_chute: Cesium.Color.fromCssColorString('#dc842e'),
    olive_wine_press: Cesium.Color.fromCssColorString('#5ab4d9'),
    temple: Cesium.Color.fromCssColorString('#dab343'),
    villa: Cesium.Color.fromCssColorString('#3e5c80'),
    single_grave_tomb: Cesium.Color.fromCssColorString('#51a738'),
    fortification_wall: Cesium.Color.fromCssColorString('#9cb2e0'),
    artifact: Cesium.Color.fromCssColorString('#8ea63f'),
    quarry: Cesium.Color.fromCssColorString('#8c4448'),
    steps: Cesium.Color.fromCssColorString('#99dfa4'),
    fortification: Cesium.Color.fromCssColorString('#8c4920'),
    chapel: Cesium.Color.fromCssColorString('#59ceca'),
    castle: Cesium.Color.fromCssColorString('#44ad71'),
    artifact_concentration: Cesium.Color.fromCssColorString('#d78d69'),
    threshing_floor: Cesium.Color.fromCssColorString('#d38694'),
    fountain_house: Cesium.Color.fromCssColorString('#467427'),
    void: Cesium.Color.fromCssColorString('#b3dee4'),
    metallurgical_remains: Cesium.Color.fromCssColorString('#9b802a'),
    unknown: Cesium.Color.fromCssColorString('#588591'),
    single_house: Cesium.Color.fromCssColorString('#89afb1'),
    metal_workshop: Cesium.Color.fromCssColorString('#405d53'),
    cluster_graves_tombs: Cesium.Color.fromCssColorString('#d1b678'),
    single_building: Cesium.Color.fromCssColorString('#d5e28d'),
    well: Cesium.Color.fromCssColorString('#5d5e2c'),
    sanctuary: Cesium.Color.fromCssColorString('#cfdfbd'),
    mine: Cesium.Color.fromCssColorString('#8c6f5b'),
    cistern: Cesium.Color.fromCssColorString('#87a679'),
    bath: Cesium.Color.fromCssColorString('#d1b19f')
};

const legendItems = [];
for (let type of Object.keys(types)) {
    legendItems.push({
        name: _.startCase(_.toLower(type)),
        color: 'fill:' + types[type].toCssColorString()
    });
}

const legend = new Vue({
    el: '#legend',
    data: {
        items: legendItems,
        showLegend: false
    }
});

function stylePoints(entities) {
    for (let entity of entities) {
        entity.billboard = undefined;
        entity.point = new Cesium.PointGraphics({
            color:
                types[
                    Cesium.Property.getValueOrUndefined(entity.properties.type)
                ],
            pixelSize: 10,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
        });
        entity.show = false;
    }
}

const data = {};

const descToCode = {
    'Late Neolithic': 'LN',
    'Final Neolithic': 'FN',
    Neolithic: 'N',
    'Early Bronze Age': 'EBA',
    'Middle Bronze Age': 'MBA',
    'Late Bronze Age': 'LBA',
    'Early Proto Geometric': 'EPG',
    'Middle Proto Geometric': 'MPG',
    'Late Proto Geometric': 'LPG',
    'Proto Geometric': 'PG',
    'Early Geometric': 'EG',
    'Middle Geometric': 'MG',
    'Late Geometric': 'LG',
    Geometric: 'G',
    'Early Archaic': 'EA',
    'Middle Archaic': 'MA',
    'Late Archaic': 'LA',
    Archaic: 'A',
    'Early Classical': 'EC',
    'Middle Classical': 'MC',
    'Late Classical': 'LC',
    Classical: 'C',
    'Early Hellenistic': 'EH',
    'Middle Hellenistic': 'MH',
    'Late Hellenistic': 'LH',
    Hellenistic: 'H',
    'Early Roman': 'ER',
    'Middle Roman': 'MR',
    'Late Roman': 'LR',
    Roman: 'R',
    'Early Byzantine': 'EB',
    'Middle Byzantine': 'MB',
    'Late Byzantine': 'LB',
    Byzantine: 'B',
    Frankish: 'F',
    Ottoman: 'O',
    Modern: 'M',
    'Uncertain prehistoric date': 'xPh',
    'Uncertain Final Neolithic': 'xFN',
    'Uncertain Neolithic': 'xN',
    'Uncertain Early Bronze Age': 'xEBA',
    'Uncertain Middle Bronze Age': 'xMBA',
    'Uncertain Late Bronze Age': 'xLBA',
    'Uncertain Early Proto Geometric': 'xEPG',
    'Uncertain Middle Proto Geometric': 'xMPG',
    'Uncertain Late Proto Geometric': 'xLPG',
    'Uncertain Proto Geometric': 'xPG',
    'Uncertain Early Geometric': 'xEG',
    'Uncertain Middle Geometric': 'xMG',
    'Uncertain Late Geometric': 'xLG',
    'Uncertain Geometric': 'xG',
    'Uncertain Early Archaic': 'xEA',
    'Uncertain Middle Archaic': 'xMA',
    'Uncertain Late Archaic': 'xLA',
    'Uncertain Archaic': 'xA',
    'Uncertain Early Classical': 'xEC',
    'Uncertain Middle Classical': 'xMC',
    'Uncertain Late Classical': 'xLC',
    'Uncertain Classical': 'xC',
    'Uncertain Early Hellenistic': 'xEH',
    'Uncertain Middle Hellenistic': 'xMH',
    'Uncertain Late Hellenistic': 'xLH',
    'Uncertain Hellenistic': 'xH',
    'Uncertain Early Roman': 'xER',
    'Uncertain Middle Roman': 'xMR',
    'Uncertain Late Roman': 'xLR',
    'Uncertain Roman': 'xR',
    'Uncertain Early Byzantine': 'xEB',
    'Uncertain Middle Byzantine': 'xMB',
    'Uncertain Late Byzantine': 'xLB',
    'Uncertain Byzantine': 'xB',
    'Uncertain Frankish': 'xF',
    'Uncertain Ottoman': 'xO',
    'Uncertain Modern': 'xM'
};

const features = [
    {
        text: 'Find Spots',
        state: { checked: 0 },
        children: [
            {
                text: 'Neolithic',
                children: [
                    {
                        text: 'Late Neolithic'
                    },
                    {
                        text: 'Final Neolithic'
                    },
                    {
                        text: 'Neolithic'
                    },
                    {
                        text: 'Uncertain Final Neolithic'
                    },
                    {
                        text: 'Uncertain Neolithic'
                    }
                ]
            },
            {
                text: 'Bronze Age',
                children: [
                    {
                        text: 'Early Bronze Age'
                    },
                    {
                        text: 'Middle Bronze Age'
                    },
                    {
                        text: 'Late Bronze Age'
                    },
                    {
                        text: 'Uncertain Early Bronze Age'
                    },
                    {
                        text: 'Uncertain Middle Bronze Age'
                    },
                    {
                        text: 'Uncertain Late Bronze Age'
                    }
                ]
            },
            {
                text: 'Proto Geometric',
                children: [
                    {
                        text: 'Early Proto Geometric'
                    },
                    {
                        text: 'Middle Proto Geometric'
                    },
                    {
                        text: 'Late Proto Geometric'
                    },
                    {
                        text: 'Proto Geometric'
                    },
                    {
                        text: 'Uncertain Early Proto Geometric'
                    },
                    {
                        text: 'Uncertain Middle Proto Geometric'
                    },
                    {
                        text: 'Uncertain Late Proto Geometric'
                    },
                    {
                        text: 'Uncertain Proto Geometric'
                    }
                ]
            },
            {
                text: 'Geometric',
                children: [
                    {
                        text: 'Early Geometric'
                    },
                    {
                        text: 'Middle Geometric'
                    },
                    {
                        text: 'Late Geometric'
                    },
                    {
                        text: 'Geometric'
                    },
                    {
                        text: 'Uncertain Early Geometric'
                    },
                    {
                        text: 'Uncertain Middle Geometric'
                    },
                    {
                        text: 'Uncertain Late Geometric'
                    },
                    {
                        text: 'Uncertain Geometric'
                    }
                ]
            },
            {
                text: 'Archaic',
                children: [
                    {
                        text: 'Early Archaic'
                    },
                    {
                        text: 'Middle Archaic'
                    },
                    {
                        text: 'Late Archaic'
                    },
                    {
                        text: 'Archaic'
                    },
                    {
                        text: 'Uncertain Early Archaic'
                    },
                    {
                        text: 'Uncertain Middle Archaic'
                    },
                    {
                        text: 'Uncertain Late Archaic'
                    },
                    {
                        text: 'Uncertain Archaic'
                    }
                ]
            },
            {
                text: 'Classical',
                children: [
                    {
                        text: 'Early Classical'
                    },
                    {
                        text: 'Middle Classical'
                    },
                    {
                        text: 'Late Classical'
                    },
                    {
                        text: 'Classical'
                    },
                    {
                        text: 'Uncertain Early Classical'
                    },
                    {
                        text: 'Uncertain Middle Classical'
                    },
                    {
                        text: 'Uncertain Late Classical'
                    },
                    {
                        text: 'Uncertain Classical'
                    }
                ]
            },
            {
                text: 'Hellenistic',
                children: [
                    {
                        text: 'Early Hellenistic'
                    },
                    {
                        text: 'Middle Hellenistic'
                    },
                    {
                        text: 'Late Hellenistic'
                    },
                    {
                        text: 'Hellenistic'
                    },
                    {
                        text: 'Uncertain Early Hellenistic'
                    },
                    {
                        text: 'Uncertain Middle Hellenistic'
                    },
                    {
                        text: 'Uncertain Late Hellenistic'
                    },
                    {
                        text: 'Uncertain Hellenistic'
                    }
                ]
            },
            {
                text: 'Roman',
                children: [
                    {
                        text: 'Early Roman'
                    },
                    {
                        text: 'Middle Roman'
                    },
                    {
                        text: 'Late Roman'
                    },
                    {
                        text: 'Roman'
                    },
                    {
                        text: 'Uncertain Early Roman'
                    },
                    {
                        text: 'Uncertain Middle Roman'
                    },
                    {
                        text: 'Uncertain Late Roman'
                    },
                    {
                        text: 'Uncertain Roman'
                    }
                ]
            },
            {
                text: 'Byzantine',
                children: [
                    {
                        text: 'Early Byzantine'
                    },
                    {
                        text: 'Middle Byzantine'
                    },
                    {
                        text: 'Late Byzantine'
                    },
                    {
                        text: 'Byzantine'
                    },
                    {
                        text: 'Uncertain Early Byzantine'
                    },
                    {
                        text: 'Uncertain Middle Byzantine'
                    },
                    {
                        text: 'Uncertain Late Byzantine'
                    },
                    {
                        text: 'Uncertain Byzantine'
                    }
                ]
            },
            {
                text: 'Frankish',
                children: [
                    {
                        text: 'Frankish'
                    },
                    {
                        text: 'Uncertain Frankish'
                    }
                ]
            },
            {
                text: 'Ottoman',
                children: [
                    {
                        text: 'Ottoman'
                    },
                    {
                        text: 'Uncertain Ottoman'
                    }
                ]
            },
            {
                text: 'Modern',
                children: [
                    {
                        text: 'Modern'
                    },
                    {
                        text: 'Uncertain Modern'
                    }
                ]
            },
            {
                text: 'Uncertain prehistoric date'
            }
        ]
    }
];

for (let featureName of features) {
    const feature = new Cesium.GeoJsonDataSource();
    feature
        .load('../features/find_spots.json', {
            markerColor: Cesium.Color.RED
        })
        .then(function(feature) {
            viewer.dataSources.add(feature);
            stylePoints(feature.entities.values);
        });
    feature.show = true;
    data[featureName.text] = feature;
}

const imagery = [
    {
        text: 'WW2',
        children: [
            { text: 'RLM_13628_sharpened1' },
            { text: 'RLM_13633_sharpened1' },
            { text: 'RLM_13657_detail1_Paleochora1' },
            { text: 'RLM_13728sharpened1' },
            { text: 'RLM_13729sharpened1' },
            { text: 'RLM_13732_sharpened1' },
            { text: 'RLM_13782_11' },
            { text: 'RLM_13632_sharpened1' },
            { text: 'RLM_13638_detail11' },
            { text: 'RLM_13716_11' },
            { text: 'RLM_13728sharpened1_reproj' },
            { text: 'RLM_13731sharpened1' },
            { text: 'RLM_13771_enhanced1' },
            { text: 'RLM_13784_11' }
        ]
    },
    {
        text: 'Drone',
        children: [
            { text: 'fs38_kiln_20151106' },
            { text: 'fs376_EBA_settlement_2015111' },
            { text: 'fs376_elliniko_20151021' },
            { text: 'fs534_quarry_20151012' },
            { text: 'Karababa_1-2-3-4-5-6-7-8-9' }
        ]
    }
];

for (let imageCategory of imagery) {
    for (let imageName of imageCategory.children) {
        const image = viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.createTileMapServiceImageryProvider({
                url: '../imagery/' + imageCategory.text + '/' + imageName.text,
                maximumLevel: 18,
                credit: ''
            })
        );
        image.show = false;
        image.name = imageName.text;

        data[imageName.text] = image;
    }
}

const maps = [
    {
        text: 'Geology'
    }
];

for (let mapName of maps) {
    const map = viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.createTileMapServiceImageryProvider({
            url: '../maps/' + mapName.text,
            maximumLevel: 15,
            credit: ''
        })
    );
    map.show = false;
    map.name = mapName.text;

    data[mapName.text] = map;
}

const treeData = [
    {
        text: 'Imagery',
        children: imagery
    },
    {
        text: 'Features',
        children: features
    },
    {
        text: 'Maps',
        children: maps
    }
];

function isDescendant(parent, child) {
    let node = child.parent;
    while (node != null) {
        if (node.data.text == parent) {
            return true;
        }
        node = node.parent;
    }
    return false;
}

const visibleSpots = {};

function updateSpotVisibility() {
    for (let entity of data['Find Spots'].entities.values) {
        const id = Cesium.Property.getValueOrUndefined(
            entity.properties.find_spot_id
        );
        if (String(id) in visibleSpots) {
            entity.show = true;
        } else {
            entity.show = false;
        }
    }
    viewer.scene.requestRender();
}

function addSpots(spot_ids) {
    for (let id of spot_ids) {
        visibleSpots[id] = (visibleSpots[id] || 0) + 1;
    }
    updateSpotVisibility();
}

function removeSpots(spot_ids) {
    for (let id of spot_ids) {
        visibleSpots[id] -= 1;
    }
    for (const spot_id in visibleSpots) {
        if (visibleSpots.hasOwnProperty(spot_id)) {
            const value = visibleSpots[spot_id];
            if (value <= 0) {
                delete visibleSpots[spot_id];
            }
        }
    }
    updateSpotVisibility();
}

const layerSelector = new Vue({
    el: '#layerSelector',
    data() {
        return {
            treeData: treeData,
            treeFilter: '',
            treeOptions: {
                checkbox: true,
                filter: {
                    emptyText: 'No matching layers found..'
                }
            }
        };
    },
    mounted() {
        this.$nextTick(() => {
            if (parseInt(urlParams.findspots)) {
                this.$refs.tree.find('Find Spots').check();
            }
            if (parseInt(urlParams.geomap)) {
                this.$refs.tree.find('Geology').check();
            }
            if (parseInt(urlParams.histairphoto)) {
                this.$refs.tree.find('Imagery').check();
            }
        });
    },
    methods: {
        onNodeChecked(node) {
            if (isDescendant('Features', node)) {
                if (node.children.length === 0) {
                    const period = descToCode[node.text];
                    fetch('../api/periods/' + period, {
                        credentials: 'include'
                    }).then(function(response) {
                        response.json().then(function(json) {
                            addSpots(json.spot_ids);
                        });
                    });
                }
            } else if (node.children.length === 0) {
                data[node.text].show = true;
            }
            viewer.scene.requestRender();
        },
        onNodeUnchecked(node) {
            if (isDescendant('Features', node)) {
                if (node.children.length === 0) {
                    const period = descToCode[node.text];
                    fetch('../api/periods/' + period, {
                        credentials: 'include'
                    }).then(function(response) {
                        response.json().then(function(json) {
                            removeSpots(json.spot_ids);
                        });
                    });
                }
            } else if (node.children.length === 0) {
                data[node.text].show = false;
            }
            viewer.scene.requestRender();
        }
    }
});

new Vue({
    el: '#opacitySlider',
    data() {
        return {
            opacity: 100
        };
    },
    components: {
        vueSlider: window['vue-slider-component']
    },
    methods: {
        onChange() {
            for (const image in data) {
                if (data.hasOwnProperty(image)) {
                    if (data[image].show === true) {
                        if (data[image].alpha !== null) {
                            data[image].alpha = this.opacity / 100;
                        }
                    }
                }
            }
            viewer.scene.requestRender();
        }
    }
});

const listToString = (list, delimiter) => {
    return _.replace(list.join(delimiter), new RegExp('_', 'g'), ' ')
        .split(' ')
        .map(_.capitalize)
        .join(' ');
};

viewer.selectedEntityChanged.addEventListener(function(entity) {
    if (typeof entity !== 'undefined') {
        const id = Cesium.Property.getValueOrUndefined(
            entity.properties.find_spot_id
        );
        entity.name = 'Find Spot ' + id;

        const findSpotInfo = fetch('../api/find_spots/' + id, {
            credentials: 'include'
        });

        const findInfo = fetch('../api/finds/' + id, {
            credentials: 'include'
        });

        Promise.all([findSpotInfo, findInfo]).then(function(responses) {
            const promises = [];
            for (let response of responses) {
                promises.push(response.json());
            }
            Promise.all(promises).then(function(jsons) {
                const findSpotJson = jsons[0];
                const findJson = jsons[1];
                const findSpotHTML =
                    '<h3>Type</h3><p>' +
                    _.startCase(
                        _.toLower(_.replace(findSpotJson.type, '_', ' '))
                    ) +
                    '</p>' +
                    '<h3>Toponym</h3><p>' +
                    findSpotJson.toponym +
                    '</p>' +
                    '<h3>Description</h3><p>' +
                    findSpotJson.description +
                    '</p>' +
                    '<h3>Chronology</h3><p>' +
                    findSpotJson.chronology.join(' | ') +
                    '</p></div>';
                let findHTML = '';
                if (findJson.description !== null) {
                    findHTML +=
                        '<h3>Description</h3><p>' +
                        findJson.description +
                        '</p>';
                }
                if (findJson.features !== null) {
                    findHTML +=
                        '<h3>Features</h3><p>' +
                        listToString(findJson.features, ' | ') +
                        '</p>';
                }
                if (findJson.features_architecture !== null) {
                    findHTML +=
                        '<h3>Features architecture</h3><p>' +
                        listToString(findJson.features_architecture, ' | ') +
                        '</p>';
                }
                if (findJson.features_sepulchral !== null) {
                    findHTML +=
                        '<h3>Features sepulchral</h3><p>' +
                        listToString(findJson.features_sepulchral, ' | ') +
                        '</p>';
                }
                if (findJson.material !== null) {
                    findHTML +=
                        '<h3>Material</h3><p>' +
                        listToString(findJson.material, ' | ') +
                        '</p>';
                }
                if (findJson.material_bone !== null) {
                    findHTML +=
                        '<h3>Material bone</h3><p>' +
                        listToString(findJson.material_bone, ' | ') +
                        '</p>';
                }
                if (findJson.material_building !== null) {
                    findHTML +=
                        '<h3>Material building</h3><p>' +
                        listToString(findJson.material_building, ' | ') +
                        '</p>';
                }
                findHTML += '</div>';

                entity.description =
                    '<div id="findSpotInfo">' +
                    '<h2>Find Spot</h2>' +
                    findSpotHTML +
                    '</div>' +
                    '<div id="findInfo">' +
                    '<h2>Find</h2>' +
                    findHTML +
                    '</div>';
            });
        });
    }
});
