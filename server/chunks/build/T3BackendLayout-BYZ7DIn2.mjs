import { defineComponent, createVNode, resolveDynamicComponent, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderVNode } from 'vue/server-renderer';
import { u as useT3DynamicBl } from './useT3DynamicComponent-DuRXCZlv.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3BackendLayout",
  __ssrInlineRender: true,
  props: {
    name: {},
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(useT3DynamicBl)(_ctx.name)), mergeProps({ content: _ctx.content }, _ctx.$attrs, _attrs), null), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3BackendLayout/T3BackendLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3BackendLayout-BYZ7DIn2.mjs.map
