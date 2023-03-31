<template>
  <div class="home">
    <cesium-map @ready="ready"></cesium-map>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      point: {},
    };
  },
  components: {},
  methods: {
    ready(viewer) {
      const point = Cesium.Cartesian3.fromDegrees(
        103.75703775549388,
        36.08774979703967,
        1000
      );
      // 飞入点的包围盒
      const boundingSphere = new Cesium.BoundingSphere(point);
      viewer.camera.flyToBoundingSphere(boundingSphere);
    },
  },
};
</script>
