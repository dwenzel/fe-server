import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {
  name: "T3Frame",
  props: {
    /**
     * Frame main css class
     */
    frameClass: {
      type: String,
      default: "default"
    },
    /**
     * Layout name
     */
    layout: {
      type: String,
      default: "default"
    },
    /**
     * Top space
     */
    spaceBefore: {
      type: String,
      default: "default"
    },
    /**
     * Bottom space
     */
    spaceAfter: {
      type: String,
      default: "default"
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: [
      "t3-ce-frame",
      `frame-${$props.frameClass}`,
      `layout-${$props.layout}`,
      `space-before-${$props.spaceBefore.length ? $props.spaceBefore : "default"}`,
      `space-after-${$props.spaceAfter.length ? $props.spaceAfter : "default"}`
    ]
  }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3Frame/T3Frame.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const T3Frame = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { T3Frame as default };
//# sourceMappingURL=T3Frame-DKUyTOP_.mjs.map
