if [ $SESLR_APP_MODE = 'demo' ]; then
    sed -i 's|../features/find_spots.json|../demo/features/find_spots.json|g' ./src/components/FindSpots/features.js
    sed -i 's|../features/|../demo/features/|g' ./src/components/Layers/features.js
    sed -i 's|../tms/1.0.0/|../../tms/1.0.0/|g' ./src/components/Layers/imagery.js
    sed -i 's|../tms/1.0.0/|../../tms/1.0.0/|g' ./src/components/Layers/maps.js
    sed -i 's|../terrain/tilesets/tiles|../../terrain/tilesets/tiles|g' ./src/components/Layers/terrain.js
fi
