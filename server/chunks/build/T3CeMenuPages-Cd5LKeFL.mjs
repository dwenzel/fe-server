import _sfc_main$2 from './T3CeHeader-Czpk-uK_.mjs';
import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import _sfc_main$1 from './T3CeMenuPagesList-C7UFai7J.mjs';
import './T3Link-BBeWASBP.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeMenuPages",
  __ssrInlineRender: true,
  props: {
    menu: {},
    header: {},
    headerLayout: {},
    headerPosition: {},
    headerLink: {},
    subheader: {},
    uid: {},
    index: {},
    appearance: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_T3CeHeader = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-ce-menu" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_T3CeHeader, props, null, _parent));
      if (props.menu) {
        _push(`<ul><!--[-->`);
        ssrRenderList(_ctx.menu, (menuItem, key) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: menuItem.link,
            target: menuItem.target || null,
            title: menuItem.title
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(menuItem.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(menuItem.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          ssrRenderSlot(_ctx.$slots, "link", { link: menuItem }, null, _push, _parent);
          if (menuItem.children) {
            _push(ssrRenderComponent(_sfc_main$1, {
              children: menuItem.children
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeMenuPages/T3CeMenuPages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeMenuPages-Cd5LKeFL.mjs.map
