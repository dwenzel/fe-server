import { defineComponent, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import _sfc_main$1 from './T3Link-BBeWASBP.mjs';
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

function useT3CeHeader(props) {
  const headerLevel = computed(() => {
    return props.headerLayout === 0 ? 1 : props.headerLayout || 1;
  });
  const headerClass = computed(() => {
    return props.headerPosition ? `t3-ce-header--${props.headerPosition}` : "";
  });
  return { headerLevel, headerClass };
}
const __default__ = {
  inheritAttrs: false
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __name: "T3CeHeader",
  __ssrInlineRender: true,
  props: {
    header: { default: "" },
    headerLayout: { default: 0 },
    headerPosition: { default: "" },
    headerLink: { default: () => ({
      additionalAttributes: [],
      class: "",
      href: "",
      linkText: "",
      target: "",
      title: ""
    }) },
    subheader: { default: "" },
    uid: {},
    index: {},
    appearance: {}
  },
  setup(__props) {
    const props = __props;
    const { headerLevel, headerClass } = useT3CeHeader(props);
    return (_ctx, _push, _parent, _attrs) => {
      if (props.header && props.headerLayout !== 100) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: [unref(headerClass), "t3-ce-header"]
        }, _attrs))}>`);
        if (props.headerLayout >= 0 && props.headerLayout !== 100) {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(`h${unref(headerLevel)}`), {
            class: props.headerPosition
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (props.headerLink) {
                  _push2(ssrRenderComponent(_sfc_main$1, {
                    link: props.headerLink
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(props.header)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(props.header), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!--[-->${ssrInterpolate(props.header)}<!--]-->`);
                }
              } else {
                return [
                  props.headerLink ? (openBlock(), createBlock(_sfc_main$1, {
                    key: 0,
                    link: props.headerLink
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(props.header), 1)
                    ]),
                    _: 1
                  }, 8, ["link"])) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                    createTextVNode(toDisplayString(props.header), 1)
                  ], 64))
                ];
              }
            }),
            _: 1
          }), _parent);
        } else {
          _push(`<!---->`);
        }
        if (props.subheader) {
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(`h${unref(headerLevel) + 1}`), null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(props.subheader)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(props.subheader), 1)
                ];
              }
            }),
            _: 1
          }), _parent);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeHeader/T3CeHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeHeader-Czpk-uK_.mjs.map
