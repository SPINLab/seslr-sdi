if [ $SESLR_APP_MODE = 'demo' ]; then
    sed -i 's|../tms/1.0.0/|../../tms/1.0.0/|g' ./src/components/Layers/imagery.js
    sed -i 's|../tms/1.0.0/|../../tms/1.0.0/|g' ./src/components/Layers/maps.js
    sed -i 's|../terrain/tilesets/tiles|../../terrain/tilesets/tiles|g' ./src/components/Layers/terrain.js
    sed -i 's|"../photos/air/${flightPhoto}"|"../../photos/air/${flightPhoto}"|g' ./src/components/Infobox.vue
fi
