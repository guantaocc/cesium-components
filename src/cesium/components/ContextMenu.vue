<template>
  <div class="cesium-context-menu" v-show="visible" :style="style">
    <ul>
      <li @click="viewPos">
        <i class="el-icon-view"></i>
        <a href="javascript:void(0)"> 查看此处坐标 </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { findRealParent } from "../utils";
export default {
  name: "ContextMenu",
  data() {
    return {
      visible: false,
      style: {
        left: 0,
        top: 0,
      },
      currentPos: {
        lon: "",
        lat: "",
        // 高程
        alt: "",
      },
    };
  },
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    this.bindEvent();
  },
  beforeDestroy() {
    this.handler?.destory();
  },
  methods: {
    viewPos() {
      this.$alert(
        `{lon: ${this.currentPos.lon}, lat: ${this.currentPos.lat}, alt: ${this.currentPos.alt}}`,
        "当前坐标",
        {
          confirmButtonText: "确定",
        }
      );
    },
    bindEvent() {
      const viewer = this.parentContainer.viewer;
      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction((evt) => {
        //查看当前视角的 x,y,z,heading,pitch,roll值
        const pick = viewer.scene.pickPosition(evt.position);
        if (pick) {
          let cartographic = Cesium.Cartographic.fromCartesian(pick);
          let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
          let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
          // 地理海拔高度
          let alt = cartographic.height.toFixed(2);
          // console.log(lon, lat, alt);
          this.currentPos.lon = lon;
          this.currentPos.lat = lat;
          this.currentPos.alt = alt;
          let screenPos = viewer.scene.cartesianToCanvasCoordinates(pick);
          // 转换经度和纬度
          console.log(pick);
          this.style.left = screenPos.x + 10 + "px";
          this.style.top = screenPos.y + 10 + "px";
          this.visible = true;
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      handler.setInputAction(() => {
        this.visible = false;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
      this.handler = handler;
    },
  },
};
</script>

<style lang="scss" scoped>
.cesium-context-menu {
  background: rgba(41, 87, 124, 0.8);
  border: 1px solid #2b2c2f;
  min-width: 110px;
  position: absolute;
  list-style: none;
  margin: 0;
  padding: 0;
  left: 0;
  top: 0;
  z-index: 9999;
  ul {
    padding-left: 0;
  }
  li {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 18px;
    padding-left: 10px;
    background: #213944;
    list-style: none;
    &:hover {
      background: #3ea6ff;
      i {
        color: #3ea6ff;
      }
    }
    a {
      padding: 6px 10px 6px 10px;
      -webkit-transition: background-color 0.25s;
      -o-transition: background-color 0.25s;
      transition: background-color 0.25s;
      display: block;
      clear: both;
      line-height: 22px;
      color: #76838f;
      white-space: nowrap;
      color: #edffff;
      text-decoration: none;
      margin-top: 1px;
      font-size: 14px;
      margin-right: 2px;
    }
  }
  li::before {
    content: "";
    display: block;
    height: 1px;
    width: 100%;
    background: -webkit-linear-gradient(
      to left,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    background: linear-gradient(
      to left,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
