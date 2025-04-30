import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3HtmlParser",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    ref();
    const htmlparser = ref();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "htmlparser",
        ref: htmlparser,
        class: "t3-ce-rte"
      }, _attrs))}>${(_a = _ctx.content) != null ? _a : ""}</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3HtmlParser/T3HtmlParser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3HtmlParser-CQ9DKlrt.mjs.map
