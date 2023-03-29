<template>
  <div class="dom-tag" :style="tagStyle" v-if="visible">
    <span class="dom-tag-span">
      <slot>
        {{ text }}
      </slot>
    </span>
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
        position: "absolute",
        left: 0,
        top: 0,
        display: "inline-block",
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
    this.parentContainer.viewer.scene.preUpdate.removeEventListener(
      this.bindOnUpdate
    );
  },
  methods: {
    setVisible(visible = true) {
      this.visible = visible;
      if (this.visible) {
        this.parentContainer.viewer.scene.preUpdate.addEventListener(
          this.bindOnUpdate
        );
      } else {
        this.parentContainer.viewer.scene.preUpdate.removeEventListener(
          this.bindOnUpdate
        );
      }
    },
    onUpdate() {
      // 获取屏幕坐标
      const viewer = this.parentContainer.viewer;
      const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        this.trackPos
      );
      if (screenPos) {
        // 判断 是否超出屏幕范围，或者在地球的反面
        this.tagStyle.left = screenPos.x + "px";
        this.tagStyle.top = screenPos.y + "px";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dom-tag {
  width: 200px;
  .dom-tag-span {
    z-index: 3000;
    display: inline-block;
    color: rgb(255, 51, 255);
    pointer-events: none;
    font-size: 24px;
    user-select: none;
  }
}
</style>
