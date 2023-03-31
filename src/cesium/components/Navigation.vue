<template>
  <div class="nk-navigation"></div>
</template>

<script>
import { findRealParent } from "../utils";
export default {
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    this.initNavigation();
  },
  methods: {
    initNavigation() {
      const viewer = this.parentContainer.viewer;
      viewer.camera.setView(Cesium.Rectangle.fromDegrees(80, 22, 130, 50));
      let options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true;
      //修改重置视图的tooltip
      options.resetTooltip = "重置视图";
      //修改放大按钮的tooltip
      options.zoomInTooltip = "放大";
      //修改缩小按钮的tooltip
      options.zoomOutTooltip = "缩小";
      // eslint-disable-next-line no-undef
      new CesiumNavigation(viewer, options);
    },
  },
};
</script>

<style lang="scss" scoped></style>
