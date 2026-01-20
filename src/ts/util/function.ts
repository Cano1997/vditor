export const genUUID = () => ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (parseInt(c, 10) ^ (window.crypto.getRandomValues(new Uint32Array(1))[0] & (15 >> (parseInt(c, 10) / 4)))).toString(16)
);

export const getSearch = (key: string, link = window.location.search) => {
    const params = link.substring(link.indexOf("?"));
    const hashIndex = params.indexOf("#");
    // REF https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams
    const urlSearchParams = new URLSearchParams(params.substring(0, hashIndex >= 0 ? hashIndex : undefined));
    return urlSearchParams.get(key);
};

export const looseJsonParse = (text: string) => {
    return Function(`"use strict";return (${text})`)();
};

/**
 * @description 函数防抖
 * @export
 * @param {((...args: unknown[]) => void | Promise<void>)} func 要执行的函数
 * @param {number} wait 延迟时间（毫秒）
 * @param {boolean} [immediate] 是否立即执行
 * @returns {*}  {(...args: unknown[]) => void} 包装后的防抖函数
 */
export function debounce(
  func: (...args: unknown[]) => void | Promise<void>,
  wait: number,
  immediate?: boolean,
): (...args: unknown[]) => void {
  let timer: unknown;

  return function (this: unknown, ...args: unknown[]): void {
    if (timer) {
      clearTimeout(timer as number);
    }
    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        func.apply(this, args);
      }
    } else {
      timer = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    }
  };
}

/**
 * @description 节流函数，限制函数在指定时间间隔内只能执行一次
 * @export
 * @param {((...args: unknown[]) => void | Promise<void>)} fn 要执行的函数
 * @param {number} wait 节流时间间隔（毫秒）
 * @returns {*}  {(...args: unknown[]) => void} 包装后的节流函数
 */
export function throttle(
  fn: (...args: unknown[]) => void | Promise<void>,
  wait: number,
): (...args: unknown[]) => void {
  let timer: unknown = null;
  return function (this: unknown, ...args: unknown[]): void {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}
