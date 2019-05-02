<template>
  <div id="navigation-help-button"></div>
</template>

<script>
import NavigationHelpButton from 'cesium/Widgets/NavigationHelpButton/NavigationHelpButton';

export default {
  name: 'NavigationHelpButton',
  mounted() {
    this.navigationHelpButton = new NavigationHelpButton({
      container: this.$el
    });
  }
};
</script>

<style scoped>
#navigation-help-button >>> .cesium-navigation-help {
  max-height: none;
  z-index: 1;
}

#navigation-help-button >>> .cesium-navigation-help-instructions {
  border-radius: 2px;
  background-color: #34495e;
}

#navigation-help-button >>> .cesium-navigation-button-right {
  border-radius: 2px;
}

#navigation-help-button >>> .cesium-navigation-button-left {
  border-radius: 2px;
}

#navigation-help-button >>> .cesium-navigation-button-selected {
  background-color: #34495e;
}

#navigation-help-button >>> .cesium-navigation-button-unselected {
  background-color: #2c3e50;
}
</style>
