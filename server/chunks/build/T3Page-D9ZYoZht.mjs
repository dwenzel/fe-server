import _sfc_main$1 from './T3BackendLayout-BYZ7DIn2.mjs';
import { defineComponent, withAsyncContext, unref, mergeProps, useSSRContext, computed, ref, shallowRef, toRef, getCurrentInstance, onServerPrefetch } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useHead } from './index-BCu11Mei.mjs';
import { h as useT3Api, i as useError, j as useRoute, u as useNuxtApp, d as useT3i18nState, e as useT3Options, f as useT3i18n, g as useT3PageState, s as showError, b as asyncDataDefaults, n as navigateTo, c as createError } from './server.mjs';
import { i as hasProtocol, D as cleanDoubleSlashes } from '../nitro/nitro.mjs';
import './useT3DynamicComponent-DuRXCZlv.mjs';
import '@unhead/shared';
import 'node:http';
import 'node:https';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import 'vue-router';
import 'node:fs';
import 'node:path';
import 'node:url';

const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
function useAsyncData(...args) {
  var _a2, _b2, _c, _d, _e, _f, _g, _h;
  var _b;
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, _handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  const handler = _handler ;
  const getDefault = () => asyncDataDefaults.value;
  const getDefaultCachedData = () => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key];
  options.server = (_a2 = options.server) != null ? _a2 : true;
  options.default = (_b2 = options.default) != null ? _b2 : getDefault;
  options.getCachedData = (_c = options.getCachedData) != null ? _c : getDefaultCachedData;
  options.lazy = (_d = options.lazy) != null ? _d : false;
  options.immediate = (_e = options.immediate) != null ? _e : true;
  options.deep = (_f = options.deep) != null ? _f : asyncDataDefaults.deep;
  options.dedupe = (_g = options.dedupe) != null ? _g : "cancel";
  const initialCachedData = options.getCachedData(key, nuxtApp);
  const hasCachedData = initialCachedData != null;
  if (!nuxtApp._asyncData[key] || !options.immediate) {
    (_h = (_b = nuxtApp.payload._errors)[key]) != null ? _h : _b[key] = asyncDataDefaults.errorValue;
    const _ref = options.deep ? ref : shallowRef;
    nuxtApp._asyncData[key] = {
      data: _ref(hasCachedData ? initialCachedData : options.default()),
      pending: ref(!hasCachedData),
      error: toRef(nuxtApp.payload._errors, key),
      status: ref("idle"),
      _default: options.default
    };
  }
  const asyncData = { ...nuxtApp._asyncData[key] };
  delete asyncData._default;
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    var _a3;
    if (nuxtApp._asyncDataPromises[key]) {
      if (isDefer((_a3 = opts.dedupe) != null ? _a3 : options.dedupe)) {
        return nuxtApp._asyncDataPromises[key];
      }
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial || nuxtApp.isHydrating && opts._initial !== false) {
      const cachedData = opts._initial ? initialCachedData : options.getCachedData(key, nuxtApp);
      if (cachedData != null) {
        return Promise.resolve(cachedData);
      }
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxtApp));
        } catch (err) {
          reject(err);
        }
      }
    ).then(async (_result) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = await options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      nuxtApp.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = asyncDataDefaults.errorValue;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxtApp._asyncDataPromises[key];
    });
    nuxtApp._asyncDataPromises[key] = promise;
    return nuxtApp._asyncDataPromises[key];
  };
  asyncData.clear = () => clearNuxtDataByKey(nuxtApp, key);
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = void 0;
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    nuxtApp._asyncData[key].pending.value = false;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const layouts = {};
const useT3Utils = () => {
  const nuxtApp = useNuxtApp();
  const currentLocale = useT3i18nState();
  const { currentSiteOptions } = useT3Options();
  const redirect = async (redirectData) => {
    await nuxtApp.callHook("t3:redirect", redirectData);
    const { redirectUrl, statusCode } = redirectData;
    const isExternal = hasProtocol(redirectUrl, { acceptRelative: true });
    return await nuxtApp.runWithContext(() => navigateTo(redirectUrl, {
      redirectCode: statusCode,
      external: isExternal,
      replace: true
    }));
  };
  const localePath = (path) => {
    const { i18n } = currentSiteOptions.value;
    const code = i18n.default === currentLocale.value ? "" : currentLocale.value;
    return cleanDoubleSlashes(`/${code}${path ? `/${path}` : ""}`);
  };
  return {
    redirect,
    localePath
  };
};
const hasLayout = (name = "default") => {
  return name in layouts;
};
const useT3Meta = () => {
  const { getCurrentLocaleData } = useT3i18n();
  const currentLocale = getCurrentLocaleData();
  const data = useT3PageState();
  const { currentSiteOptions } = useT3Options();
  const metaData = computed(() => {
    var _a;
    return (_a = data.value) == null ? void 0 : _a.meta;
  });
  const twitter = computed(() => {
    const { twitterTitle, twitterDescription, twitterImage, twitterCard, title, description, ogImage } = metaData.value;
    return [
      {
        id: "twitter:title",
        name: "twitter:title",
        content: twitterTitle || title
      },
      {
        id: "twitter:description",
        name: "twitter:description",
        content: twitterDescription || description
      },
      {
        id: "twitter:image",
        name: "twitter:image",
        content: (twitterImage == null ? void 0 : twitterImage.publicUrl) || (ogImage == null ? void 0 : ogImage.publicUrl) || void 0
      },
      {
        id: "twitter:card",
        name: "twitter:card",
        content: twitterCard || "summary"
      }
    ];
  });
  const openGraph = computed(() => {
    const { ogTitle, ogDescription, ogImage, title, description } = metaData.value;
    return [
      {
        id: "og:title",
        property: "og:title",
        content: ogTitle || title
      },
      {
        id: "og:description",
        property: "og:description",
        content: ogDescription || description
      },
      {
        id: "og:type",
        property: "og:type",
        content: "website"
      },
      {
        id: "og:image",
        property: "og:image",
        content: (ogImage == null ? void 0 : ogImage.publicUrl) || void 0
      }
    ];
  });
  const base = computed(() => {
    var _a, _b;
    return [
      {
        id: "generator",
        name: "generator",
        content: "TYPO3 CMS x T3Headless"
      },
      {
        id: "description",
        name: "description",
        content: (_a = metaData == null ? void 0 : metaData.value) == null ? void 0 : _a.description
      },
      {
        id: "robots",
        name: "robots",
        content: Object.keys(((_b = metaData.value) == null ? void 0 : _b.robots) || {}).filter((key) => {
          var _a2;
          return (_a2 = metaData.value) == null ? void 0 : _a2.robots[key];
        }).join(", ")
      }
    ];
  });
  const links = computed(() => {
    var _a, _b, _c, _d;
    const link = [];
    const baseUrl = (_a = currentSiteOptions.value) == null ? void 0 : _a.baseUrl;
    const canonical = {
      rel: "canonical",
      href: ((_c = (_b = metaData.value) == null ? void 0 : _b.canonical) == null ? void 0 : _c.href) || ""
    };
    if (baseUrl) {
      (_d = data.value) == null ? void 0 : _d.i18n.forEach((item) => {
        if (item.active) {
          canonical.href = baseUrl + (canonical.href || item.link);
        }
        if (item.languageId === 0) {
          link.push({
            rel: "alternate",
            hreflang: "x-default",
            href: baseUrl + item.link
          });
        }
        if (item.available) {
          link.push({
            rel: "alternate",
            hreflang: item.twoLetterIsoCode,
            href: baseUrl + item.link
          });
        }
      });
    }
    if (canonical.href) {
      link.push(canonical);
    }
    return link;
  });
  const headData = computed(() => {
    var _a;
    if (!metaData.value) {
      return {};
    }
    const meta = Array.prototype.concat(base.value, twitter.value, openGraph.value);
    return {
      title: (_a = metaData == null ? void 0 : metaData.value) == null ? void 0 : _a.title,
      htmlAttrs: {
        lang: currentLocale == null ? void 0 : currentLocale.twoLetterIsoCode,
        dir: currentLocale == null ? void 0 : currentLocale.direction
      },
      bodyAttrs: {
        class: bodyClassString
      },
      meta: metaFilter(meta),
      link: links
    };
  });
  const bodyClassString = computed(() => {
    var _a, _b, _c;
    const classPrefixes = {
      pid: (_a = data.value) == null ? void 0 : _a.id,
      layout: (_c = (_b = data.value) == null ? void 0 : _b.appearance) == null ? void 0 : _c.layout
    };
    const classStringArray = [];
    for (const prefix in classPrefixes) {
      if (classPrefixes[prefix] !== void 0) {
        classStringArray.push(`${prefix}-${classPrefixes[prefix]}`);
      }
    }
    const classString = classStringArray.join(" ");
    return classString;
  });
  const metaFilter = (meta) => {
    return meta.filter(
      ({ content }) => !!content && (Object.keys(content).length > 0 || typeof content === "string" && content.length > 0)
    );
  };
  return {
    metaData,
    headData,
    twitter,
    base,
    opengraph: openGraph,
    openGraph
  };
};
const useT3Page = async (options = {
  route: useRoute(),
  fetchOnInit: true
}) => {
  var _a, _b, _c, _d, _e;
  const { route, fetchOnInit } = options;
  const { pageData, getPage } = useT3Api();
  const { headData } = useT3Meta();
  const { redirect } = useT3Utils();
  const getPageData = async (path) => {
    var _a2, _b2, _c2, _d2, _e2;
    const { data, error } = await useAsyncData("t3:page", () => getPage(path));
    if (data.value) {
      if ((_a2 = data == null ? void 0 : data.value) == null ? void 0 : _a2.redirectUrl) {
        return redirect(data.value);
      }
      pageData.value = data.value;
    }
    if (error.value) {
      const _error = error;
      showError({
        unhandled: false,
        fatal: true,
        message: (_b2 = _error.value) == null ? void 0 : _b2.message,
        statusCode: ((_c2 = _error.value) == null ? void 0 : _c2.statusCode) || 500,
        data: (_d2 = _error.value) == null ? void 0 : _d2.data,
        statusMessage: (_e2 = _error.value) == null ? void 0 : _e2.message
      });
    }
    return { data, error };
  };
  const pageDataFallback = computed(() => {
    const error = useError();
    if (!error.value || !("data" in error.value)) {
      return null;
    }
    try {
      if (typeof error.value.data === "string") {
        return JSON.parse(error.value.data);
      }
      return error.value.data;
    } catch {
      return null;
    }
  });
  if (fetchOnInit && route) {
    await getPageData(route.fullPath);
  }
  const backendLayout = ((_b = (_a = pageData.value) == null ? void 0 : _a.appearance) == null ? void 0 : _b.backendLayout) || "default";
  const frontendLayout = hasLayout((_d = (_c = pageData.value) == null ? void 0 : _c.appearance) == null ? void 0 : _d.layout) ? (_e = pageData.value) == null ? void 0 : _e.appearance.layout : "default";
  return {
    pageDataFallback,
    pageData,
    getPageData,
    headData,
    backendLayout,
    frontendLayout
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3Page",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { headData, pageData, backendLayout } = ([__temp, __restore] = withAsyncContext(() => useT3Page()), __temp = await __temp, __restore(), __temp);
    useHead(headData);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_T3BackendLayout = _sfc_main$1;
      if ((_a = unref(pageData)) == null ? void 0 : _a.content) {
        _push(ssrRenderComponent(_component_T3BackendLayout, mergeProps({
          name: unref(backendLayout),
          content: unref(pageData).content
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/pages/T3Page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3Page-D9ZYoZht.mjs.map
