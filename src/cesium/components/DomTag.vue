<template>
  <div
    ref="tagItem"
    :class="['cesium-div-graph']"
    :style="tagStyle"
    v-if="visible"
  >
    <div class="BlueGradientPnl">
      <div>
        <slot :content="text">{{ text }}</slot>
      </div>
    </div>
  </div>
</template>

<script>
import {
  findRealParent,
  cartesian3ToCartesian2,
  isVisibleByBounds,
} from "../utils";

export default {
  name: "DomTag",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    position: Object,
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
        // "transform-origin": "left bottom 0px",
        // transform: "matrix(1, 0, 0, 1, 0, 0)",
        left: 0,
        top: 0,
        display: "block",
      },
      tagCollection: [],
    };
  },
  mounted() {
    this.viewer = findRealParent(this.$parent).viewer;
    this.addMapListener();
    this.addScreenEventHandler();
  },
  beforeDestroy() {
    this.eventHandler?.destroy();
  },
  methods: {
    addScreenEventHandler() {
      this.eventHandler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
    },
    addMapListener() {
      this.viewer?.scene.postRender.addEventListener(() => {
        const position = this.position;
        if (position) {
          if (isVisibleByBounds(this.viewer, position)) {
            this.setPosition(position);
            this.setVisible(true);
          } else {
            this.setVisible(false);
          }
        }
      });
    },
    setVisible(visible) {
      this.tagStyle.display = visible ? "block" : "none";
    },
    // 设置点位置
    setPosition(cartsian3) {
      let screenPos = cartesian3ToCartesian2(this.viewer, cartsian3);
      const element = this.$el;
      if (screenPos) {
        let offsetLeft = screenPos.x;
        let offsetTop = screenPos.y;
        if (element) {
          offsetLeft -= element.clientWidth / 2;
          offsetTop -= element.clientHeight / 2;
        }
        // this.tagStyle.transform = `matrix(1, 0, 0, 1, ${screenPos.x}, ${screenPos.y})`;
        this.tagStyle.display = "block";
        this.tagStyle.left = offsetLeft + "px";
        this.tagStyle.top = offsetTop + "px";
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
  z-index: 9999;
  .BlueGradientPnl {
    text-align: center;
    padding: 5px 30px;
    margin: 0;
    color: #fff;
    background: linear-gradient(rgb(7 10 203 / 75%), rgb(16 238 220));
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    // max-height: 130px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    white-space: nowrap;
    // &::after {
    //   content: "";
    //   position: absolute;
    //   bottom: -60px;
    //   left: calc(50% - 3px);
    //   display: block;
    //   height: 60px;
    //   border-right: 3px solid #2bcdbb;
    // }
  }
}
</style>
