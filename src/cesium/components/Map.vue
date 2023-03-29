<template>
  <div class="v-map-container">
    <div id="cesiumContainer" :style="viewerStyle"></div>
    <slot v-if="ready" />
  </div>
</template>

<script>
import { MapConfig } from "../config";

/**
 * Base component, contains and wraps all the other components.
 */
export default {
  name: "Map",
  props: {},
  data() {
    return {
      ready: false,
      viewerStyle: {},
      containerId: "cesiumContainer",
    };
  },
  mounted() {
    Cesium.Ion.defaultAccessToken = this.options?.ION || MapConfig.ION;
    let viewer = new Cesium.Viewer(this.containerId, {
      ...MapConfig.MAPOPTIONS,
    });
    viewer.cesiumWidget.creditContainer.style.display = "none"; //去除版权信息
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    ); //移除双击选中

    viewer.scene.globe.enableLighting = MapConfig.global.enableLighting; //光照开关
    viewer.scene.globe.depthTestAgainstTerrain =
      MapConfig.global.depthTestAgainstTerrain; //深度检测
    viewer.scene.highDynamicRange = true;

    // 不要放入 响应式对象上面（对象过大，防止性能问题）
    this.viewer = viewer;
    this.$nextTick(() => {
      this.ready = true;
      this.$emit("ready", this.viewer);
    });
  },
  beforeDestroy() {
    this.viewer?.destroy();
    console.log("cesium destroyed");
    this.viewer = null;
  },
  methods: {},
};
</script>

<style lang="scss" type="text/css">
.v-map-container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  #cesiumContainer {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2000;
    width: 100vw;
    height: 100vh;
  }
}
</style>
