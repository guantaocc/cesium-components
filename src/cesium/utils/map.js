// 改变鼠标样式
export const changeMouseStyle = (viewer, cursor) => {
  viewer._container.style.cursor = cursor;
};

/**
 * 经纬度转笛卡尔坐标
 * @param lng
 * @param lat
 * @param alt
 * @returns
 */
export const lnglatToCartesian3 = (lng, lat, alt) => {
  const cartesian3 = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
  return cartesian3;
};

/**
 * 笛卡尔坐标转屏幕坐标
 * @param cartesian3
 * @returns
 */
export const cartesian3ToCartesian2 = (viewer, cartesian3) => {
  return Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    viewer.scene,
    cartesian3
  );
};

/**
 * 笛卡尔坐标转经纬度
 * @param cartesian3
 * @returns
 */
export const cartesian3ToLngLat = (viewer, cartesian3) => {
  if (cartesian3) {
    // 在地球上的经纬度，高度为无模型的高度
    const radians =
      viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
    const latitude = Cesium.Math.toDegrees(radians.latitude); //弧度转度
    const longitude = Cesium.Math.toDegrees(radians.longitude);
    const height = radians.height;
    return { longitude, latitude, height };
  }
};

// 屏幕坐标（鼠标点击的位置）转换笛卡尔坐标
export const cartesian2ToCartesian3 = (viewer, position) => {
  let cartesian3 = null;
  if (viewer && position) {
    const picks = this.viewer.scene.drillPick(position);
    let isOn3dtiles = false;
    for (let i in picks) {
      if (!isNaN(Number(i))) {
        const pick = picks[i];
        isOn3dtiles =
          (pick && pick.primitive instanceof Cesium.Cesium3DTileFeature) ||
          (pick && pick.primitive instanceof Cesium.Cesium3DTileset) ||
          (pick && pick.primitive instanceof Cesium.Model);
        if (isOn3dtiles) {
          viewer.scene.pick(position);
          cartesian3 = viewer.scene.pickPosition(position);
          if (cartesian3) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
            // 高度
            if (cartographic.height < 0) cartographic.height = 0;
            const lon = Cesium.Math.toDegrees(cartographic.longitude),
              lat = Cesium.Math.toDegrees(cartographic.latitude),
              height = cartographic.height;
            cartesian3 = lnglatToCartesian3(lon, lat, height);
            return cartesian3;
          }
        }
      }
    }
    //不在模型上
    if (!isOn3dtiles) {
      const isTerrain =
        viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider; //是否存在地形
      if (!isTerrain) {
        //无地形
        const ray = viewer.scene.camera.getPickRay(position);
        if (!ray) return null;
        cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
        return cartesian3;
      } else {
        // 有地形则 pick地球即可
        cartesian3 = viewer.scene.camera.pickEllipsoid(
          position,
          viewer.scene.globe.ellipsoid
        );
        if (cartesian3) {
          const position = cartesian3ToLngLat(viewer, cartesian3);
          if (position && position.height < 0) {
            cartesian3 = lnglatToCartesian3(
              position.longitude,
              position.latitude,
              0.1
            );
          }
          return cartesian3;
        }
      }
    }
  }
  return cartesian3;
};

/**
 * 获取当前的视图范围
 */
export const computeViewerBounds = (viewer) => {
  const extend = viewer.camera.computeViewRectangle();
  let bounds = [];
  if (typeof extend === "undefined") {
    const coordToLonlat = (viewer, x, y) => {
      const { camera, scene } = viewer;
      const d2 = new Cesium.Cartesian2(x, y);
      const ellipsoid = scene.globe.ellipsoid;
      //2D转3D世界坐标
      const d3 = camera.pickEllipsoid(d2, ellipsoid);
      if (d3) {
        //3D世界坐标转弧度
        const upperLeftCartographic =
          scene.globe.ellipsoid.cartesianToCartographic(d3);
        //弧度转经纬度
        const lon = Cesium.Math.toDegrees(upperLeftCartographic.longitude);
        const lat = Cesium.Math.toDegrees(upperLeftCartographic.latitude);
        return { lon, lat };
      }
    };
    const canvas = viewer.scene.canvas;
    const upperLeftLonLat = coordToLonlat(viewer, 0, 0);
    const lowerRightLonLat = coordToLonlat(
      viewer,
      canvas.clientWidth,
      canvas.clientHeight
    );
    if (
      upperLeftLonLat?.lon &&
      upperLeftLonLat?.lat &&
      lowerRightLonLat?.lon &&
      lowerRightLonLat?.lat
    )
      bounds = [
        upperLeftLonLat.lon,
        upperLeftLonLat.lat,
        lowerRightLonLat.lon,
        lowerRightLonLat.lat,
      ];
  } else {
    //三维视图
    bounds = [
      Cesium.Math.toDegrees(extend.west),
      Cesium.Math.toDegrees(extend.south),
      Cesium.Math.toDegrees(extend.east),
      Cesium.Math.toDegrees(extend.north),
    ];
  }
  return bounds;
};

// 判断点的可见性
export const isVisibleByBounds = (viewer, position) => {
  let visible = false;
  const bounds = computeViewerBounds(viewer);
  if (bounds) {
    const lnglat = cartesian3ToLngLat(viewer, position);
    if (lnglat) {
      const lng = lnglat.longitude;
      const lat = lnglat.latitude;
      if (
        lng >= bounds[0] &&
        lng <= bounds[2] &&
        lat >= bounds[1] &&
        lat <= bounds[3]
      ) {
        visible = true;
      }
    }
  }
  return visible;
};
