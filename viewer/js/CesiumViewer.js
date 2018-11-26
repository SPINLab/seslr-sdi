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

const terrainProviders = {
    seslr: new Cesium.CesiumTerrainProvider({
        url: '/terrain/tilesets/tiles',
        requestVertexNormals: true
    }),
    cesiumWorld: Cesium.createWorldTerrain(),
    ellipsoid: new Cesium.EllipsoidTerrainProvider(),
    viewModels: [
        new Cesium.ProviderViewModel({
            name: 'SESLR Terrain Model',
            iconUrl: Cesium.buildModuleUrl(
                'Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'
            ),
            creationFunction: function() {
                return terrainProviders.seslr;
            }
        }),
        new Cesium.ProviderViewModel({
            name: 'Cesium World Terrain',
            iconUrl: Cesium.buildModuleUrl(
                'Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'
            ),
            creationFunction: function() {
                return terrainProviders.cesiumWorld;
            }
        }),
        new Cesium.ProviderViewModel({
            name: 'World Ellipsoid',
            iconUrl: Cesium.buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
            creationFunction: function() {
                return terrainProviders.ellipsoid;
            }
        })
    ]
};

const viewer = new Cesium.Viewer('cesiumContainer', {
    baseLayerPicker: true,
    animation: false,
    timeline: false,
    vrButton: false,
    sceneModePicker: true,
    navigationInstructionsInitiallyVisible: false,
    selectionIndicator: false,
    terrainProvider: terrainProviders.seslr,
    terrainProviderViewModels: terrainProviders.viewModels,
    // selectedTerrainProviderViewModel: terrainProviders.viewModels[1],
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

viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
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

const data = {};

const features = [
    {
        id: 'find_spots',
        label: 'Find Spots'
    },
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

const geologyColors = {
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

const surveyColors = {
    'Kampos 2006-2008': '#FF00FF',
    'Keller 1979-1981': '#8B008B',
    'NASK 2012-2014': '#9B30FF',
    'SEEP 1986-1988': '#AB82FF',
    'SEEP 1989-1993': '#5D478B',
    'SESLR 2016-2019': '#EE0000'
};

for (let featureName of features) {
    const feature = new Cesium.GeoJsonDataSource();
    feature
        .load(`../features/${featureName.id}.json`, {
            clampToGround: true
        })
        .then(function(feature) {
            viewer.dataSources.add(feature);

            if (featureName.id === 'find_spots') {
                for (const entity of feature.entities.values) {
                    entity.billboard = undefined;
                }
            } else if (featureName.id === 'mines') {
                for (const entity of feature.entities.values) {
                    entity.billboard = {
                        image: 'assets/' + entity.properties.Mines + '.svg',
                        scale: 0.3,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: 50000
                    };
                }
            } else if (featureName.id === 'archaeological_surveys') {
                for (const entity of feature.entities.values) {
                    const survey = Cesium.Property.getValueOrUndefined(
                        entity.properties.arch_proje
                    );
                    entity.polygon.material = Cesium.Color.fromCssColorString(surveyColors[survey]);
                }
            } else if (featureName.id === 'geology') {
                for (const entity of feature.entities.values) {
                    const geologyUnit = Cesium.Property.getValueOrUndefined(
                        entity.properties.geology_lo
                    );
                    entity.polygon.material = Cesium.Color.fromCssColorString(
                        geologyColors[geologyUnit]
                    );
                }
            }
        });
    feature.show = false;
    data[featureName.id] = feature;
}

const imagery = [
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
    }
];

for (let imageCategory of imagery) {
    for (let imageName of imageCategory.children) {
        const image = viewer.scene.imageryLayers.addImageryProvider(
            new Cesium.createTileMapServiceImageryProvider({
                url: '../tms/1.0.0/' + imageName.id,
                maximumLevel: 19,
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
        id: 'topo_1860',
        label: 'Topography (1860)'
    }
];

for (let mapName of maps) {
    const map = viewer.scene.imageryLayers.addImageryProvider(
        new Cesium.createTileMapServiceImageryProvider({
            url: '../tms/1.0.0/' + mapName.id,
            // maximumLevel: 15,
            credit: ''
        })
    );
    map.show = false;
    map.name = mapName.label;

    data[mapName.id] = map;
}

function exportSVG(svg) {
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

function styleSpot(spot, period) {
    let type = Cesium.Property.getValueOrUndefined(spot.properties.type);
    type = type.replace(/ /g, '_');
    const color = periodColors[period];

    if (typeof icons[type] !== 'undefined') {
        spot.billboard = {
            image: exportSVG(icons[type].replace(/#afafaf/g, color)),
            scale: 0.15,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: 50000
        };
    } else {
        console.log(type);
        spot.billboard = undefined;
    }
}

const visibleSpots = {};

function updateSpotVisibility() {
    for (let entity of data['find_spots'].entities.values) {
        const id = Cesium.Property.getValueOrUndefined(entity.properties.find_spot_id);
        const find_spot_type = Cesium.Property.getValueOrUndefined(entity.properties.type);
        if (typeof visibleSpots[id] !== 'undefined') {
            if (visibleSpots[id].length > 0) {
                if (find_spot_type !== 'void') {
                    styleSpot(entity, visibleSpots[id][0]);
                    entity.show = true;
                }
            } else {
                entity.show = false;
            }
        }
    }
    viewer.scene.requestRender();
}

function addSpots(spot_ids, period) {
    for (let id of spot_ids) {
        if (typeof visibleSpots[id] !== 'undefined') {
            visibleSpots[id].push(period);
        } else {
            visibleSpots[id] = [period];
        }
    }
    updateSpotVisibility();
}

function removeSpots(spot_ids, period) {
    for (let id of spot_ids) {
        visibleSpots[id].splice(visibleSpots[id].indexOf(period), 1);
    }
    updateSpotVisibility();
}

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
            const tilesLoaded = viewer.scene.globe.tileLoadProgressEvent.addEventListener(e => {
                if (e === 0) {
                    this.selectedFeatures.push(features[0]);
                    tilesLoaded();
                }
            });
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
                'prev' + layerGroupName[0].toUpperCase() + layerGroupName.slice(1),
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
            let selectedFeature;
            if (this.prevSelectedFeatures.length > this.selectedFeatures.length) {
                for (let feature of this.prevSelectedFeatures) {
                    if (!this.selectedFeatures.includes(feature)) {
                        selectedFeature = feature;
                    }
                }
            } else {
                for (let feature of this.selectedFeatures) {
                    if (!this.prevSelectedFeatures.includes(feature)) {
                        selectedFeature = feature;
                    }
                }
            }
            let shown = data[selectedFeature.id].show;
            if (!shown) {
                switch (selectedFeature.id) {
                    case 'find_spots':
                        legendCarousel.$refs.carousel.goToPage(0);
                        break;
                    case 'mines':
                        legendCarousel.$refs.carousel.goToPage(1);
                        break;
                    case 'archaeological_surveys':
                        legendCarousel.$refs.carousel.goToPage(2);
                        break;
                    case 'geology':
                        legendCarousel.$refs.carousel.goToPage(3);
                        break;
                    default:
                        break;
                }
            }
            data[selectedFeature.id].show = !shown;

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
            this.onSelect(layerGroup, layerGroupName);
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
                const period = periodCode[node.text];
                fetch('../api/periods/' + period, {
                    credentials: 'include'
                }).then(function(response) {
                    response.json().then(function(json) {
                        addSpots(json.spot_ids, period);
                    });
                });
            }
            viewer.scene.requestRender();
        },
        onNodeUnchecked(node) {
            if (node.children.length === 0) {
                const period = periodCode[node.text];
                fetch('../api/periods/' + period, {
                    credentials: 'include'
                }).then(function(response) {
                    response.json().then(function(json) {
                        removeSpots(json.spot_ids, period);
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

const legendItems = {
    findspot: [],
    mines: [],
    survey: [],
    geology: []
};

for (let type of Object.keys(icons)) {
    legendItems.findspot.push({
        name: _.startCase(_.toLower(type)),
        icon: 'assets/' + type + '.svg'
    });
}

for (let mine of ['ASB', 'Fe-Cu', 'Fe-Mn', 'Fe', 'Mn', 'PBG', 'tc']) {
    legendItems.mines.push({
        name: mine,
        icon: 'assets/' + mine + '.svg'
    });
}

for (let survey in surveyColors) {
    if (surveyColors.hasOwnProperty(survey)) {
        legendItems.survey.push({
            name: _.startCase(_.toLower(survey)),
            color: surveyColors[survey]
        });
    }
}

for (let unit in geologyColors) {
    if (geologyColors.hasOwnProperty(unit)) {
        legendItems.geology.push({
            name: _.startCase(_.toLower(unit)),
            color: geologyColors[unit]
        });
    }
}

const legendCarousel = new Vue({
    el: '#legend',
    data: {
        items: legendItems
    },
    components: {
        carousel: VueCarousel.Carousel,
        slide: VueCarousel.Slide
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
        const id = Cesium.Property.getValueOrUndefined(entity.properties.find_spot_id);

        if (typeof id !== 'undefined') {
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
                        _.startCase(_.toLower(_.replace(findSpotJson.type, '_', ' '))) +
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
                        findHTML += '<h3>Description</h3><p>' + findJson.description + '</p>';
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
    }
});
