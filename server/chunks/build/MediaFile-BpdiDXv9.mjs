import { defineComponent, createVNode, resolveDynamicComponent, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderVNode } from 'vue/server-renderer';
import { u as useMediaFile } from './useMediaFile-DLdyHopL.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MediaFile",
  __ssrInlineRender: true,
  props: {
    file: {}
  },
  setup(__props) {
    const props = __props;
    const { mediaTypeComponent } = useMediaFile(props.file);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(mediaTypeComponent)), mergeProps({ file: _ctx.file }, _attrs), null), _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/MediaFile/MediaFile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=MediaFile-BpdiDXv9.mjs.map
