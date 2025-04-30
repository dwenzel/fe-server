import _sfc_main$1 from './T3MediaGallery-9iBzJquo.mjs';
import _sfc_main$2 from './T3CeHeader-Czpk-uK_.mjs';
import _sfc_main$3 from './T3HtmlParser-CQ9DKlrt.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './MediaFile-BpdiDXv9.mjs';
import './useMediaFile-DLdyHopL.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeTextpic",
  __ssrInlineRender: true,
  props: {
    bodytext: {},
    gallery: {},
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
      const _component_T3MediaGallery = _sfc_main$1;
      const _component_T3CeHeader = _sfc_main$2;
      const _component_T3HtmlParser = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-ce-textpic" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_T3MediaGallery, { gallery: _ctx.gallery }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_T3CeHeader, props, null, _parent2, _scopeId));
            if (_ctx.bodytext) {
              _push2(ssrRenderComponent(_component_T3HtmlParser, { content: _ctx.bodytext }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_T3CeHeader, props, null, 16),
              _ctx.bodytext ? (openBlock(), createBlock(_component_T3HtmlParser, {
                key: 0,
                content: _ctx.bodytext
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeTextpic/T3CeTextpic.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeTextpic-DbpMcHRg.mjs.map
