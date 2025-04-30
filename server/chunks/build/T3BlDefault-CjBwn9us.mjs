import _sfc_main$1 from './T3Renderer-AXcfLVVI.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import './useT3DynamicComponent-DuRXCZlv.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3BlDefault",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_T3Renderer = _sfc_main$1;
      if ((_a = _ctx.content) == null ? void 0 : _a.colPos0) {
        _push(ssrRenderComponent(_component_T3Renderer, mergeProps({
          content: _ctx.content.colPos0
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3BlDefault/T3BlDefault.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3BlDefault-CjBwn9us.mjs.map
