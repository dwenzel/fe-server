import _sfc_main$1 from './T3Link-BBeWASBP.mjs';
import { defineComponent, computed, mergeProps, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useMediaFile } from './useMediaFile-DLdyHopL.mjs';
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
  __name: "MediaImage",
  __ssrInlineRender: true,
  props: {
    file: {}
  },
  setup(__props) {
    const props = __props;
    const { hasLink } = useMediaFile(props.file);
    const wrapperComponent = computed(() => hasLink.value ? _sfc_main$1 : "div");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
        class: [[_ctx.$attrs.class, _ctx.$attrs.staticClass], "t3-ce-media-image"]
      }, _attrs))}>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(wrapperComponent.value), {
        link: _ctx.file.properties.linkData
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<figure${_scopeId}>`);
            if (_ctx.file.publicUrl) {
              _push2(`<img${ssrRenderAttr("src", _ctx.file.publicUrl)}${ssrRenderAttr("height", _ctx.file.properties.dimensions.height)}${ssrRenderAttr("width", _ctx.file.properties.dimensions.width)}${ssrRenderAttr("alt", _ctx.file.properties.alternative)}${ssrRenderAttr("title", _ctx.file.properties.title || "")}${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.file.properties.description) {
              _push2(`<figcaption${_scopeId}>${ssrInterpolate(_ctx.file.properties.description)}</figcaption>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</figure>`);
          } else {
            return [
              createVNode("figure", null, [
                _ctx.file.publicUrl ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: _ctx.file.publicUrl,
                  height: _ctx.file.properties.dimensions.height,
                  width: _ctx.file.properties.dimensions.width,
                  alt: _ctx.file.properties.alternative,
                  title: _ctx.file.properties.title || ""
                }, null, 8, ["src", "height", "width", "alt", "title"])) : createCommentVNode("", true),
                _ctx.file.properties.description ? (openBlock(), createBlock("figcaption", { key: 1 }, toDisplayString(_ctx.file.properties.description), 1)) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }), _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/MediaFile/type/MediaImage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MediaImage-DxbZU2EA.mjs.map
