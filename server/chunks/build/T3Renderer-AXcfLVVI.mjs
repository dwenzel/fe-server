import { defineComponent, createVNode, resolveDynamicComponent, useSSRContext, h } from 'vue';
import { ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { a as useT3DynamicCe, b as useT3DynamicComponent } from './useT3DynamicComponent-DuRXCZlv.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3Renderer",
  __ssrInlineRender: true,
  props: {
    content: { default: () => [] },
    frame: { type: Boolean, default: true }
  },
  setup(__props) {
    const renderComponent = (element, index) => {
      const { id, type, appearance, content } = element;
      const component = useT3DynamicCe(type);
      return h(component, {
        ...{
          uid: id,
          appearance,
          index
        },
        id: appearance.frameClass === "none" ? `c${id}` : null,
        ...content
      });
    };
    const renderFrame = (element, index) => {
      const component = useT3DynamicComponent({
        prefix: "T3",
        type: "Frame",
        mode: ""
      });
      return h(
        component,
        {
          ...element.appearance,
          id: `c${element.id}`
        },
        {
          default: () => renderComponent(element, index)
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(_ctx.content, (component, index) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.frame && component.appearance.frameClass !== "none" ? renderFrame(component, index) : renderComponent(component, index)), { key: index }, null), _parent);
      });
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3Renderer/T3Renderer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3Renderer-AXcfLVVI.mjs.map
