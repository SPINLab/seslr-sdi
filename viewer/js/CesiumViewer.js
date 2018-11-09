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
        id: 'find_spots',
        label: 'Find Spots'
    }
];

for (let featureName of features) {
    const feature = new Cesium.GeoJsonDataSource();
    feature.load(`../features/${featureName.id}.json`).then(function(feature) {
        viewer.dataSources.add(feature);
        stylePoints(feature.entities.values);
    });
    feature.show = false;
    data[featureName.id] = feature;
}

const imagery = [
    {
        id: 'WW2',
        label: 'World War 2',
        children: [
            { id: 'RLM_13628_sharpened1', label: 'RLM_13628' },
            { id: 'RLM_13633_sharpened1', label: 'RLM_13633' },
            { id: 'RLM_13657_detail1_Paleochora1', label: 'RLM_13657' },
            { id: 'RLM_13728sharpened1', label: 'RLM_13728' },
            { id: 'RLM_13729sharpened1', label: 'RLM_13729' },
            { id: 'RLM_13732_sharpened1', label: 'RLM_13732' },
            { id: 'RLM_13782_11', label: 'RLM_13782' },
            { id: 'RLM_13632_sharpened1', label: 'RLM_13632' },
            // { id: 'RLM_13638_detail11', label: 'RLM_13638' },
            { id: 'RLM_13716_11', label: 'RLM_13716' },
            // { id: 'RLM_13728sharpened1_reproj', label: 'RLM_13728' },
            { id: 'RLM_13731sharpened1', label: 'RLM_13731' },
            { id: 'RLM_13771_enhanced1', label: 'RLM_13771' },
            { id: 'RLM_13784_11', label: 'RLM_13784' }
        ]
    },
    {
        id: 'Drone',
        label: 'Drone',
        children: [
            { id: 'fs38_kiln_20151106', label: 'Kiln' },
            { id: 'fs376_EBA_settlement_2015111', label: 'EBA_settlement' },
            { id: 'fs376_elliniko_20151021', label: 'Elliniko' },
            { id: 'fs534_quarry_20151012', label: 'Quarry' },
            { id: 'Karababa_1-2-3-4-5-6-7-8-9', label: 'Karababa' }
        ]
    }
];

for (let imageCategory of imagery) {
    for (let imageName of imageCategory.children) {
        const image = viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.createTileMapServiceImageryProvider({
                url: '../imagery/' + imageCategory.id + '/' + imageName.id,
                maximumLevel: 23,
                credit: ''
            })
        );
        image.show = false;
        image.name = imageName.label;
        data[imageName.id] = image;
    }
}

const maps = [
    {
        id: 'Geology',
        label: 'Geology'
    }
];

for (let mapName of maps) {
    const map = viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.createTileMapServiceImageryProvider({
            url: '../maps/' + mapName.id,
            maximumLevel: 15,
            credit: ''
        })
    );
    map.show = false;
    map.name = mapName.labal;

    data[mapName.id] = map;
}

const visibleSpots = {};

function updateSpotVisibility() {
    for (let entity of data['find_spots'].entities.values) {
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

const getLeafNodes = function(nodes, result = []) {
    for (var i = 0, length = nodes.length; i < length; i++) {
        if (!nodes[i].children) {
            result.push(nodes[i]);
        } else {
            result = getLeafNodes(nodes[i].children, result);
        }
    }
    return result;
};

const layerSelector = new Vue({
    el: '#layerSelector',
    data: {
        selectedImagery: [],
        prevSelectedImagery: [],
        selectedFeatures: [],
        prevSelectedFeatures: [],
        selectedMaps: [],
        prevSelectedMaps: [],
        imagery: imagery,
        features: features,
        maps: maps,
        valueConsistsOf: 'LEAF_PRIORITY',
        clearable: false,
        searchable: false,
        valueFormat: 'object',
        opacities: {}
    },
    mounted() {
        if (parseInt(urlParams.findspots)) {
            this.selectedFeatures.push(features[0]);
        }

        if (parseInt(urlParams.geomap)) {
            for (let node of maps) {
                this.selectedMaps.push(node);
            }
        }

        if (parseInt(urlParams.histairphoto)) {
            for (let node of imagery[0].children) {
                this.selectedImagery.push(node);
            }
        }
    },
    methods: {
        onSelect(layerGroup, layerGroupName) {
            this.$set(
                this,
                'prev' +
                    layerGroupName[0].toUpperCase() +
                    layerGroupName.slice(1),
                layerGroup.slice(0)
            );
        },
        onChangeImagery() {
            for (let node of this.prevSelectedImagery) {
                data[node.id].show = false;
            }
            for (let node of this.selectedImagery) {
                this.opacities[node.id] = 1;
                data[node.id].alpha = 1;
                data[node.id].show = true;
            }
            viewer.scene.requestRender();
        },
        onChangeFeatures() {
            for (let node of this.prevSelectedFeatures) {
                data[node.id].show = false;
            }
            for (let node of this.selectedFeatures) {
                data[node.id].show = true;
            }
            viewer.scene.requestRender();
        },
        onChangeMaps() {
            for (let node of this.prevSelectedMaps) {
                data[node.id].show = false;
            }
            for (let node of this.selectedMaps) {
                this.opacities[node.id] = 1;
                data[node.id].alpha = 1;
                data[node.id].show = true;
            }
            viewer.scene.requestRender();
        },
        removeLayer(node, layerGroup, layerGroupName) {
            data[node.id].show = false;
            this.$set(
                this,
                layerGroupName,
                layerGroup.filter(layerNode => {
                    return node !== layerNode;
                })
            );
            viewer.scene.requestRender();
        },
        toggleLayer(node) {
            data[node.id].show = !data[node.id].show;
        },
        mouseOver(node) {
            data[node.id].hue = 2.0;
            viewer.scene.requestRender();
        },
        mouseLeave(node) {
            data[node.id].hue = 0.0;
            viewer.scene.requestRender();
        },
        changeOpacity(node) {
            data[node.id].alpha = this.opacities[node.id];
            viewer.scene.requestRender();
        }
    },
    components: {
        treeselect: VueTreeselect.Treeselect,
        'vue-slider': window['vue-slider-component']
    }
});

const periodSelector = new Vue({
    el: '#periodSelector',
    data() {
        return {
            prehistoric: periods.prehistoric,
            neolithic: periods.neolithic,
            bronzeAge: periods.bronzeAge,
            protoGeometric: periods.protoGeometric,
            geometric: periods.geometric,
            archaic: periods.archaic,
            classical: periods.classical,
            hellenistic: periods.hellenistic,
            roman: periods.roman,
            byzantine: periods.byzantine,
            frankish: periods.frankish,
            ottoman: periods.ottoman,
            modern: periods.modern,
            treeOptions: {
                checkbox: true,
                selectable: false
            }
        };
    },
    methods: {
        onTreeMounted(tree) {
            if (parseInt(urlParams.findspots)) {
                tree.find(tree.data[0].text).check();
            }
        },
        onNodeChecked(node) {
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
            viewer.scene.requestRender();
        },
        onNodeUnchecked(node) {
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
            viewer.scene.requestRender();
        },
        onNodeExpanded(node) {
            for (let sibling of node.vm.$parent.$parent.$children) {
                if (sibling.model[0] !== node) {
                    sibling.collapseAll();
                }
            }
        },
        documentClick(e) {
            const el = this.$el;
            const target = e.target;
            if (el !== target && !el.contains(target)) {
                for (let child of this.$children) {
                    child.collapseAll();
                }
            }
        }
    },
    created() {
        document.addEventListener('click', this.documentClick);
    },
    destroyed() {
        document.removeEventListener('click', this.documentClick);
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
