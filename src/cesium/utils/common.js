export const debounce = (fn, time) => {
  let timeout;

  const debouncedFunction = function (...args) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(context, args);
      timeout = null;
    }, time);
  };

  debouncedFunction.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return debouncedFunction;
};

export const throttle = (fn, time) => {
  let last = Date.now();
  return function (...args) {
    const context = this;
    let now = Date.now();
    if (now - last > time) {
      fn.apply(context, args);
      last = now;
    }
  };
};

export const toCamelCase = (str) => {
  return str.replace(/([A-Z])/g, (match, p1) => {
    // 一个捕获组捕获全部，所以match等于p1
    return "-" + p1.toLowerCase();
  });
};

export const capitalizeFirstLetter = (string) => {
  if (!string || typeof string.charAt !== "function") {
    return string;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const constantComponentPrefix = "Cesium";

export const setVueComponentName = (componentName) => {
  return `${constantComponentPrefix}${componentName}`;
};

/**
 * 查找到最上级 viewer实例
 * @param {*} firstVueParent
 * @returns
 */
export const findRealParent = (firstVueParent) => {
  let found = false;
  while (firstVueParent && !found) {
    if (firstVueParent.viewer === undefined) {
      firstVueParent = firstVueParent.$parent;
    } else {
      found = true;
    }
  }
  return firstVueParent;
};
