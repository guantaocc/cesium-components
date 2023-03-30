<template>
  <div
    ref="tagItem"
    :class="['cesium-div-graph']"
    :style="tagStyle"
    v-if="visible"
  >
    <div class="BlueGradientPnl">
      <div>{{ text }}</div>
    </div>
  </div>
</template>

<script>
import { findRealParent } from "../utils";

export default {
  name: "DomTag",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    trackPos: Object,
    text: String,
    alignX: {
      type: String,
      default: "left",
    },
    alignY: {
      type: String,
      default: "center",
    },
  },
  data() {
    return {
      tagStyle: {
        "transform-origin": "left bottom 0px",
        transform: "matrix(1, 0, 0, 1, 0, 0)",
      },
      tagCollection: [],
    };
  },
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    this.bindOnUpdate = this.onUpdate.bind(this);
    this.setVisible(this.visible);
  },
  beforeDestroy() {
    this.parentContainer.viewer.scene.preRender.removeEventListener(
      this.bindOnUpdate
    );
  },
  methods: {
    setVisible(visible = true) {
      this.visible = visible;
      if (this.visible) {
        this.parentContainer.viewer.scene.preRender.addEventListener(
          this.bindOnUpdate
        );
      } else {
        this.parentContainer.viewer.scene.preRender.removeEventListener(
          this.bindOnUpdate
        );
      }
    },
    onUpdate() {
      if (this.visible) {
        // 获取屏幕坐标
        const viewer = this.parentContainer.viewer;
        const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          viewer.scene,
          this.trackPos
        );
        // 获取 viewer 区域的边界，超出边界则隐藏
        // let tagItem = this.$refs.tagItem;
        // let rect = tagItem?.getBoundingClientRect();
        // let maxY = window.innerHeight + rect?.width || 0;
        // let maxX = window.innerWidth + rect?.height || 0;
        // let minX = rect?.width ? -rect.width : 0;
        // let minY = rect?.height ? -rect.height : 0;
        // if (screenPos.x < minX || screenPos.x > maxX) {
        //   this.tagStyle.display = "none";
        //   return;
        // }
        // if (screenPos.y < minY || screenPos.y > maxY) {
        //   this.tagStyle.display = "none";
        //   return;
        // }
        if (screenPos) {
          // 判断 是否超出屏幕范围，或者在地球的反面
          this.tagStyle.transform = `matrix(1, 0, 0, 1, ${screenPos.x}, ${screenPos.y})`;
          this.tagStyle.display = "block";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cesium-div-graph {
  pointer-events: all;
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  .BlueGradientPnl {
    text-align: center;
    padding: 5px 30px;
    margin: 0;
    color: #fff;
    background: linear-gradient(rgb(7 10 203 / 75%), rgb(16 238 220));
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    max-height: 130px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    white-space: nowrap;
    &::after {
      content: "";
      position: absolute;
      bottom: -60px;
      left: calc(50% - 3px);
      display: block;
      height: 60px;
      border-right: 3px solid #2bcdbb;
    }
  }
}
</style>
