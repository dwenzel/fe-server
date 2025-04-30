import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MediaYoutube",
  __ssrInlineRender: true,
  props: {
    file: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (_ctx.file.publicUrl) {
        _push(`<iframe${ssrRenderAttrs(mergeProps({ id: "ytplayer" }, _ctx.$attrs, {
          class: [[_ctx.$attrs.class, _ctx.$attrs.staticClass], "t3-ce-media-video t3-ce-media-youtube"],
          width: _ctx.file.properties.dimensions.width || 640,
          height: _ctx.file.properties.dimensions.height || 360,
          src: _ctx.file.publicUrl,
          type: "text/html",
          frameborder: "0"
        }, _attrs))}></iframe>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/MediaFile/type/MediaYoutube.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MediaYoutube--A52FMqe.mjs.map
