import { v1 as uuidv1 } from "uuid";
import "./index.css";

export class CesiumPopupPositionUtil {
  constructor(viewer) {
    this.viewer = viewer;
  }

  changeMouseStyle(isDefault) {
    const v = this.viewer;
    v._container.style.cursor = isDefault ? "default" : "crosshair";
  }

  /**
   * 屏幕坐标转笛卡尔坐标
   * @param position
   * @returns
   */
  cartesian2ToCartesian3(position) {
    const { viewer } = this;
    let cartesian3 = null;
    if (viewer && position) {
      const picks = this.viewer.scene.drillPick(position);
      let isOn3dtiles = false;
      for (let i in picks) {
        //为了防止别人用了Array.prototype扩展后出现bug
        if (!isNaN(Number(i))) {
          const pick = picks[i];
          isOn3dtiles =
            (pick && pick.primitive instanceof Cesium3DTileFeature) ||
            (pick && pick.primitive instanceof Cesium3DTileset) ||
            (pick && pick.primitive instanceof Model);
          if (isOn3dtiles) {
            viewer.scene.pick(position);
            cartesian3 = viewer.scene.pickPosition(position);
            if (cartesian3) {
              const cartographic = Cartographic.fromCartesian(cartesian3);
              if (cartographic.height < 0) cartographic.height = 0;
              const lon = CesiumMath.toDegrees(cartographic.longitude),
                lat = CesiumMath.toDegrees(cartographic.latitude),
                height = cartographic.height;
              cartesian3 = this.lnglatToCartesian3(lon, lat, height);
              return cartesian3;
            }
          }
        }
      }

      //不在模型上
      if (!isOn3dtiles) {
        const isTerrain =
          viewer.terrainProvider instanceof EllipsoidTerrainProvider; //是否存在地形
        if (!isTerrain) {
          //无地形
          const ray = viewer.scene.camera.getPickRay(position);
          if (!ray) return null;
          cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
          return cartesian3;
        } else {
          cartesian3 = viewer.scene.camera.pickEllipsoid(
            position,
            viewer.scene.globe.ellipsoid
          );
          if (cartesian3) {
            const position = this.cartesian3ToLngLat(cartesian3);
            if (position && position.height < 0) {
              cartesian3 = this.lnglatToCartesian3(
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
  }

  /**
   * 经纬度转笛卡尔坐标
   * @param lng
   * @param lat
   * @param alt
   * @returns
   */
  lnglatToCartesian3(lng, lat, alt) {
    const cartesian3 = Cartesian3.fromDegrees(lng, lat, alt);
    return cartesian3;
  }

  /**
   * 笛卡尔坐标转屏幕坐标
   * @param cartesian3
   * @returns
   */
  cartesian3ToCartesian2(cartesian3) {
    return SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      cartesian3
    );
  }

  /**
   * 笛卡尔坐标转经纬度
   * @param cartesian3
   * @returns
   */
  cartesian3ToLngLat(cartesian3) {
    if (cartesian3) {
      const radians =
        this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
      const latitude = CesiumMath.toDegrees(radians.latitude); //弧度转度
      const longitude = CesiumMath.toDegrees(radians.longitude);
      const height = radians.height;
      return { longitude, latitude, height };
    }
  }

  /**
   * 获取当前的视图范围
   */
  computeViewerBounds() {
    const extend = this.viewer.camera.computeViewRectangle();
    let bounds = [];
    if (typeof extend === "undefined") {
      const coordToLonlat = (viewer, x, y) => {
        const { camera, scene } = viewer;
        const d2 = new Cartesian2(x, y);
        const ellipsoid = scene.globe.ellipsoid;
        //2D转3D世界坐标
        const d3 = camera.pickEllipsoid(d2, ellipsoid);
        if (d3) {
          //3D世界坐标转弧度
          const upperLeftCartographic =
            scene.globe.ellipsoid.cartesianToCartographic(d3);
          //弧度转经纬度
          const lon = CesiumMath.toDegrees(upperLeftCartographic.longitude);
          const lat = CesiumMath.toDegrees(upperLeftCartographic.latitude);
          return { lon, lat };
        }
      };
      const canvas = this.viewer.scene.canvas;
      const upperLeftLonLat = coordToLonlat(this.viewer, 0, 0);
      const lowerRightLonLat = coordToLonlat(
        this.viewer,
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
        CesiumMath.toDegrees(extend.west),
        CesiumMath.toDegrees(extend.south),
        CesiumMath.toDegrees(extend.east),
        CesiumMath.toDegrees(extend.north),
      ];
    }
    return bounds;
  }

  // 判断点的可见性
  isVisibleByBounds(position) {
    let visible = false;
    const bounds = this.computeViewerBounds();
    if (bounds) {
      const lnglat = this.cartesian3ToLngLat(position);
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
  }
}

/**
 * 气泡弹窗
 * { position: cartesian3, html, className: "earth-popup-imgbg-blue", popPosition: "leftbottom"}
 */
export class CesiumPopup {
  constructor(viewer, options) {
    this.viewer = viewer;
    this.positionUtil = new CesiumPopupPositionUtil(viewer);
    this.options = options;
    this.options.id = options?.id ? options.id : uuidv1();
    this.action = action;
    this.addPopup();
    if (!this.action?.noLisener) {
      this.addMapListener();
      this.eventHandler = new Cesium.ScreenSpaceEventHandler(
        viewer.scene.canvas
      );
      let self = this;
      this.element?.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          if (!self.moved) {
            if (self.action?.onClick) {
              self.action.onClick(self);
            }
          }
        },
        false
      );
    }
    this.addCameraLisener();
    if (this.action?.pickPosition) {
      this.actionState = "draw";
      this.addMouseLisener();
    }
  }

  addMouseLisener() {
    this.addMouseMoveLisener();
  }

  addMouseLeftDownListener() {
    this.eventHandler?.setInputAction((movement) => {
      this.removeMouseLeftDownLisener();
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
  }

  showTooltip(position) {
    if (this.viewer) {
      if (!this.tooltip) {
        const html4 = `<div>按下鼠标右键结束</div>`;
        if (!this.tooltip) {
          this.tooltip = new CesiumPopup(
            this.viewer,
            {
              position,
              popPosition: "leftmiddle",
              html: html4,
              className: "earth-popup-bubble",
            },
            { noLisener: true, contextDisabled: true }
          ); //一丁不能添加监听
        }
      } else {
        this.tooltip.setPosition(position);
      }
    }
  }

  addMouseMoveLisener() {
    this.eventHandler?.setInputAction((movement) => {
      const { endPosition } = movement;
      const cartesians3 = this.positionUtil.cartesian2ToCartesian3(endPosition);
      if (this.actionState === "edit") {
        if (this.element?.id === this.selectValue?.id) {
          if (this.moved && cartesians3) {
            this.positionUtil.changeMouseStyle(false);
            this.showTooltip(cartesians3);
            this.moving = true;
            if (cartesians3) this.setPosition(cartesians3);
            if (this.viewer) {
              this.showTooltip(cartesians3);
            }
          }
        }
      } else {
        this.moving = true;
        if (cartesians3) {
          this.setPosition(cartesians3);
          this.moved = true;
          this.showTooltip(cartesians3);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  removeMouseLisener() {
    this.eventHandler?.removeInputAction(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
    this.eventHandler?.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_DOWN
    );
    this.removeMouseLeftDownLisener();
  }

  removeMouseLeftDownLisener() {
    this.eventHandler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
  }

  removeCommon(type) {
    if (this.viewer) {
      const { container } = this.viewer;
      if (this.element) {
        container.removeChild(this.element);
        this.element = undefined;
      }
      if (this.cameraMoveEnd)
        this.viewer.camera.moveEnd.removeEventListener(this.cameraMoveEnd);
      this.eventHandler?.destroy();
    }
    if (this.action?.remove) {
      this.action.remove(this, type);
    }
  }

  /**
   * 移除弹窗
   */
  remove() {
    this.removeCommon("method");
  }

  /**
   * 通过抓手移除弹窗
   */
  removeByHandler() {
    this.removeCommon("handler");
  }

  /**
   * 设置弹窗的内容
   * @param html 内容
   */
  setContent(html, init) {
    const { element } = this;
    if (element) {
      element.innerHTML = html;
    }
    if (this.options) {
      this.options.html = html;
    }
    if (!init && this.action?.onChange) {
      this.action.onChange(this);
    }
  }

  /**
   * 处理弹窗的屏幕位置
   * @param position
   */
  setPosition(position) {
    if (this.viewer && position) {
      const screenPosition = this.positionUtil.Cartesian3ToCartesian2(position);
      const { element } = this;

      if (element && screenPosition) {
        let x = screenPosition.x - element.clientWidth / 2;
        let y = screenPosition.y - element.clientHeight - 15;
        if (this.options?.popPosition) {
          if (this.options?.popPosition === "leftbottom") {
            x = screenPosition.x;
            y = screenPosition.y - element.clientHeight;
          } else if (this.options?.popPosition === "leftmiddle") {
            x = screenPosition.x + 20;
            y = screenPosition.y - element.clientHeight / 2;
          }
        }

        element.style.display = "block";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
      }

      if (this.options) this.options.position = position;
    }
  }

  /**
   * 添加相机的监听
   */
  addCameraLisener() {
    if (this.options?.visibleMaxCameraHeight) {
      this.cameraMoveEnd = this.viewer?.camera.moveEnd.addEventListener(() => {
        const h = this.viewer?.camera.getMagnitude();
        const min = 6375000;
        if (h && this.options?.visibleMaxCameraHeight && this.element) {
          if (h - min > this.options.visibleMaxCameraHeight) {
            this.hide();
          } else {
            this.show();
          }
        }
      });
    }
  }

  hide() {
    if (this.element) this.element.style.visibility = "hidden";
  }

  show() {
    if (this.element) this.element.style.visibility = "visible";
  }

  /**
   * 地图添加监听，用于更新弹窗的位置
   */
  addMapListener() {
    this.viewer?.scene.postRender.addEventListener(() => {
      const position = this.options?.position;
      if (position) {
        if (this.options?.renderInViewBounds) {
          if (this.positionUtil.isVisibleByBounds(position)) {
            if (!this.moving) {
              this.setPosition(position);
            }
            this.show();
          } else {
            this.hide();
          }
        } else {
          if (!this.moving) {
            this.setPosition(position);
          }
        }
      }
    });
  }

  /**
   * 添加弹窗
   */
  addPopup() {
    if (this.viewer && this.options) {
      const { options } = this;
      const id = options.id;
      if (id) {
        if (document.getElementById(id)) {
          throw new Error(`id为${id}的div已存在！`);
        } else {
          this.element = this.createPopupDom(id);
          if (this.options?.position) {
            this.setPosition(this.options.position);
          }
          if (options.html !== undefined) this.setContent(options.html, true);
        }
      }
    }
  }

  /**
   * 创建弹窗的dom
   * @param id
   * @returns
   */
  createPopupDom(id) {
    const { viewer, options } = this;
    if (viewer) {
      const container = viewer.container;
      const popupContainer = document.createElement("div");
      popupContainer.id = id;
      popupContainer.className = options?.className
        ? options.className
        : "earth-popup-common";
      container.appendChild(popupContainer);
      return popupContainer;
    }
  }
}
