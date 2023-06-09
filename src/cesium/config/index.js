export const MapConfig = {
  global: {
    enableLighting: false,
    depthTestAgainstTerrain: true,
  },
  tokens: {
    TIANDITU_TOKEN: "30e0ed17677a95129072c03f6c0fb6c",
    SUPERMAP_TOKEN: "",
  },
  MAPOPTIONS: {
    imageryProvider: new Cesium.TiandituImageryProvider({
      name: "天地图",
      token: "030e0ed17677a95129072c03f6c0fb6c",
      mapStyle: Cesium.TiandituMapsStyle.IMG_W,
      maximumLevel: 18,
    }), //设置影像图列表
    shouldAnimate: true,
    geocoder: false, //右上角查询按钮
    shadows: false,
    terrainProviderViewModels: [], //设置地形图列表
    animation: false, //动画小窗口
    baseLayerPicker: false, //图层选择器
    fullscreenButton: false, //全屏
    vrButton: false, //vr按钮
    homeButton: false, //home按钮
    infoBox: false,
    sceneModePicker: false, //2D,2.5D,3D切换
    selectionIndicator: false,
    timeline: false, //时间轴
    navigationHelpButton: false, //帮助按钮
    terrainShadows: Cesium.ShadowMode.DISABLED,
  },
};
