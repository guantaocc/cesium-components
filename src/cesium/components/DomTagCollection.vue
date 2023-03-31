<template>
  <div class="dom-tag-collection" v-if="visible">
    <dom-tag
      ref="tags"
      v-for="(point, index) in points"
      :key="index"
      :position="point"
      text="示例标签"
    ></dom-tag>
  </div>
</template>

<script>
import DomTag from "./DomTag.vue";
import { findRealParent, throttle } from "../utils";
export default {
  props: {
    pointArr: {
      type: Array,
      // example: [121, 31, 121.2, 31.1, 121.5, 31.2]
      default: () => [],
    },
    maxHeight: {
      type: Number,
      default: Infinity,
    },
  },
  data() {
    return {
      points: [],
      visible: false,
    };
  },
  components: {
    DomTag,
  },
  mounted() {
    this.points = Cesium.Cartesian3.fromDegreesArrayHeights(this.pointArr);
    this.parentContainer = findRealParent(this.$parent);
    this.viewer = this.parentContainer.viewer;
    this.bindEvent();
  },
  beforeDestroy() {
    this.removeEvent & this.removeEvent();
  },
  methods: {
    bindEvent() {
      const viewer = this.viewer;
      const throttleFn = throttle(() => {
        let height = viewer.camera.positionCartographic.height;
        if (height > this.maxHeight) {
          this.setVisible(false);
        } else {
          this.setVisible(true);
        }
      }, 500);
      this.removeEvent =
        this.viewer.camera.changed.addEventListener(throttleFn);
    },
    // 飞入点位
    flyCenter() {
      const viewer = this.parentContainer.viewer;
      viewer.scene.camera.flyToBoundingSphere(
        Cesium.BoundingSphere.fromPoints(this.points)
      );
    },
    setVisible(visible = true) {
      if (visible == this.visible) return;
      this.visible = visible;
    },
  },
};
</script>

<style lang="scss" scoped>
.dom-tag-collection {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
}
</style>
