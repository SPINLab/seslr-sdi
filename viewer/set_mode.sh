if [ $SESLR_APP_MODE = 'demo']; then
    sed -i 's|../features/find_spots.json|../demo/features/find_spots.json|g' ./src/components/FindSpots/features.js
    sed -i 's|../features/|../demo/features/|g' ./src/components/Layers/features.js
fi
