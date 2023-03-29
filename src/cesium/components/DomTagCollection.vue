<template>
  <div class="dom-tag-collection" v-if="visible">
    <dom-tag
      ref="tags"
      v-for="(point, index) in points"
      :key="index"
      :track-pos="point"
      text="示例标签"
    ></dom-tag>
  </div>
</template>

<script>
import DomTag from "./DomTag.vue";
import { findRealParent } from "../utils";
export default {
  props: {
    pointArr: {
      type: Array,
      // example: [121, 31, 121.2, 31.1, 121.5, 31.2]
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      points: [],
    };
  },
  components: {
    DomTag,
  },
  mounted() {
    this.points = Object.freeze(
      Cesium.Cartesian3.fromDegreesArray(this.pointArr)
    );
  },
  methods: {
    // 飞入点位
    flyCenter() {
      this.parentContainer = findRealParent(this.$parent);
      const viewer = this.parentContainer.viewer;
      const points = Object.freeze(
        Cesium.Cartesian3.fromDegreesArray(this.pointArr)
      );
      viewer.scene.camera.flyToBoundingSphere(
        Cesium.BoundingSphere.fromPoints(points)
      );
    },
    setVisible(visible = true) {
      this.$refs.tags?.setVisible(visible);
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
