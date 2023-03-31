import Vue from "vue";
import path from "path";
import { setVueComponentName } from "./utils";

const files = require.context("@/cesium/components", false, /\.vue$/);

files.keys().forEach((key) => {
  const name = path.basename(key, ".vue");
  const componentName = setVueComponentName(name);
  Vue.component(componentName, files(key).default || files(key));
});

export * from "./utils";
