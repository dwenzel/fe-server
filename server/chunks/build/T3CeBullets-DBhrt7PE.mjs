import _sfc_main$1 from './T3CeHeader-Czpk-uK_.mjs';
import { defineComponent, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderVNode, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import './T3Link-BBeWASBP.mjs';
import './server.mjs';
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

const useT3CeBullets = (props) => {
  const listTag = computed(() => {
    return props.bulletsType === 1 ? "ol" : "ul";
  });
  const showBaseList = computed(() => {
    return props.bulletsType === 0 || props.bulletsType === 1;
  });
  return { listTag, showBaseList };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeBullets",
  __ssrInlineRender: true,
  props: {
    bodytext: { default: () => [] },
    bulletsType: { default: 0 },
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
    const { listTag, showBaseList } = useT3CeBullets(props);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_T3CeHeader = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-ce-bullets" }, _attrs))}>`);
      if (props.header) {
        _push(ssrRenderComponent(_component_T3CeHeader, props, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(showBaseList)) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(listTag)), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(_ctx.bodytext, (el, i) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(el)}</li>`);
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.bodytext, (el, i) => {
                  return openBlock(), createBlock("li", { key: i }, toDisplayString(el), 1);
                }), 128))
              ];
            }
          }),
          _: 1
        }), _parent);
      } else {
        _push(`<dl><!--[-->`);
        ssrRenderList(_ctx.bodytext, (el, i) => {
          _push(`<!--[--><dt>${ssrInterpolate(el[0])}</dt>`);
          if (el[1]) {
            _push(`<dd>${ssrInterpolate(el[1])}</dd>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></dl>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeBullets/T3CeBullets.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeBullets-DBhrt7PE.mjs.map
