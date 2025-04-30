import _sfc_main$1 from './T3HtmlParser-CQ9DKlrt.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeHtml",
  __ssrInlineRender: true,
  props: {
    bodytext: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_T3HtmlParser = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-ce-html" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_T3HtmlParser, { content: _ctx.bodytext }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeHtml/T3CeHtml.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeHtml-kS0RyrMF.mjs.map
