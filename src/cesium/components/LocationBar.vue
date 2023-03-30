<template>
  <div class="cesium-locationbar no-print">
    <div class="cesium-locationbar-content">
      <div class="cesium-performanceDisplay-fps"></div>
    </div>
    <div class="cesium-locationbar-content">
      <div>经度:{{ locationInfo.lon }}</div>
      <div>纬度:{{ locationInfo.lat }}</div>
      <!-- <div class="hide1000">横40518664 纵2885552</div> -->
      <div>海拔：{{ locationInfo.alt }}米</div>
      <div class="hide700">层级：{{ locationInfo.level }}</div>
      <div>方向：{{ locationInfo.heading }}°</div>
      <div>俯仰角：{{ locationInfo.pitch }}°</div>
      <div class="hide700">视高：{{ locationInfo.height }}米</div>
    </div>
  </div>
</template>

<script>
import { findRealParent, throttle } from "../utils";
export default {
  name: "LocationBar",
  data() {
    return {
      locationInfo: {
        lon: "113.960462",
        lat: "30.124358",
        alt: "0",
        level: "4",
        heading: "",
        pitch: "",
        roll: "",
        height: "",
      },
      appInfo: {},
    };
  },
  mounted() {
    const viewer = findRealParent(this.$parent).viewer;
    const throttleFn = throttle((evt) => {
      // 获取地形的高程坐标
      let ray = viewer.camera.getPickRay(evt.endPosition);
      let cartesian = (cartesian = viewer.scene.globe.pick(ray, viewer.scene));
      if (cartesian) {
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
        let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
        // 地理海拔高度
        let alt = cartographic.height.toFixed(2);
        // 视高 km
        let height = viewer.camera.positionCartographic.height.toFixed(2);
        // 方位角
        let heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2);
        // 俯仰角
        let pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2);
        // 翻滚角
        let roll = Cesium.Math.toDegrees(viewer.camera.roll).toFixed(2);
        // 级别
        let level = 0;
        let tileRender = viewer.scene._globe._surface._tilesToRender;
        if (tileRender && tileRender.length > 0) {
          level = viewer.scene._globe._surface._tilesToRender[0]._level;
        }
        this.locationInfo.height = height;
        this.locationInfo.heading = heading;
        this.locationInfo.pitch = pitch;
        this.locationInfo.roll = roll;
        this.locationInfo.level = level;
        this.locationInfo.lon = lon;
        this.locationInfo.lat = lat;
        this.locationInfo.alt = alt;
      }
    }, 1000);
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(throttleFn, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler = handler;
  },
  beforeDestroy() {
    this.handler?.destory();
  },
};
</script>

<style lang="scss" scoped>
.cesium-locationbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2001;
  padding: 3px 10px;
  font-size: 16px;
  color: #e9e9e9;
  background-color: rgba(0, 0, 0, 0.4);
  min-height: 26px;
  pointer-events: none;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  .cesium-locationbar-content {
    display: flex;
    align-items: center;
    div {
      margin-right: 20px;
    }
  }
}
</style>
