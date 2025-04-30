import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MediaVimeo",
  __ssrInlineRender: true,
  props: {
    file: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<iframe${ssrRenderAttrs(mergeProps(_ctx.$attrs, {
        class: [[_ctx.$attrs.class, _ctx.$attrs.staticClass], "t3-ce-media-video t3-ce-media-vimeo"],
        src: _ctx.file.publicUrl,
        width: _ctx.file.properties.dimensions.width || 640,
        height: _ctx.file.properties.dimensions.height || 360,
        title: _ctx.file.properties.title,
        frameborder: "0",
        webkitallowfullscreen: "",
        mozallowfullscreen: "",
        allowfullscreen: ""
      }, _attrs))}></iframe>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/MediaFile/type/MediaVimeo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MediaVimeo-D2mmmnkZ.mjs.map
