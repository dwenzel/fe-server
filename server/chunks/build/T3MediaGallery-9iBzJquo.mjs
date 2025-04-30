import _sfc_main$1 from './MediaFile-BpdiDXv9.mjs';
import { defineComponent, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import './useMediaFile-DLdyHopL.mjs';

const useT3MediaGallery = (gallery) => {
  const galleryClassList = computed(() => {
    return [
      `t3-ce-gallery--horizontal-${gallery.position.horizontal}`,
      `t3-ce-gallery--vertical-${gallery.position.vertical}`,
      { "t3-ce-gallery--no-wrap": gallery.position.noWrap },
      { "t3-ce-gallery--border": gallery.border.enabled }
    ];
  });
  return {
    galleryClassList
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3MediaGallery",
  __ssrInlineRender: true,
  props: {
    gallery: {}
  },
  setup(__props) {
    const props = __props;
    const { galleryClassList } = useT3MediaGallery(props.gallery);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [unref(galleryClassList), "t3-ce-gallery"]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "before", {}, null, _push, _parent);
      if (_ctx.gallery.position.vertical === "below") {
        _push(`<div class="t3-ce-gallery__text">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.gallery.count.files) {
        _push(`<div class="t3-ce-gallery__container"><!--[-->`);
        ssrRenderList(_ctx.gallery.rows, (row, rowKey) => {
          _push(`<div class="t3-ce-gallery__row"><!--[-->`);
          ssrRenderList(row.columns, (col, colKey) => {
            _push(`<div class="t3-ce-gallery__col">`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_sfc_main$1), { file: col }, null), _parent);
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.gallery.position.vertical === "above" || _ctx.gallery.position.vertical === "intext") {
        _push(`<div class="t3-ce-gallery__text">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "after", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3MediaGallery/T3MediaGallery.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3MediaGallery-9iBzJquo.mjs.map
