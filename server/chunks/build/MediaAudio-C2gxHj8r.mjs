import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MediaAudio",
  __ssrInlineRender: true,
  props: {
    file: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.file.publicUrl) {
        _push(`<audio${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
          class: [[_ctx.$attrs.class, _ctx.$attrs.staticClass], "t3-ce-media-audio"],
          controls: ""
        }, _attrs))}><source${ssrRenderAttr("src", _ctx.file.publicUrl)} type="audio/mp3"></audio>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/MediaFile/type/MediaAudio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MediaAudio-C2gxHj8r.mjs.map
