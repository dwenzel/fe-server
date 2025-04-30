import { g as useT3PageState, d as useT3i18nState, a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import '../nitro/nitro.mjs';
import 'node:fs';
import 'node:path';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const useT3LocaleSwitcher = () => {
  const data = useT3PageState();
  const locale = useT3i18nState();
  const locales = computed(() => {
    var _a;
    return ((_a = data.value) == null ? void 0 : _a.i18n) || [];
  });
  const currentLocale = computed(
    () => {
      var _a;
      return (_a = locales.value) == null ? void 0 : _a.find(
        (t3locale) => t3locale.twoLetterIsoCode === locale.value
      );
    }
  );
  return {
    locales,
    currentCode: locale,
    currentLocale
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3LocaleSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locales, currentCode } = useT3LocaleSwitcher();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-locale-switcher" }, _attrs))}> Current locale: ${ssrInterpolate(unref(currentCode))} <!--[-->`);
      ssrRenderList(unref(locales), ({ title, link }) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: title,
          to: link
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3LocaleSwitcher/T3LocaleSwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3LocaleSwitcher-B9clTdm_.mjs.map
