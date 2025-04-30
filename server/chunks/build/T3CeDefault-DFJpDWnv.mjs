import { defineComponent, h, useSSRContext } from 'vue';

const _sfc_main = defineComponent({
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () => h(
      "pre",
      {
        style: {
          overflowX: "scroll"
        }
      },
      [
        h(
          "code",
          {
            style: {
              fontSize: "12px",
              fontFamily: "SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace"
            }
          },
          JSON.stringify(attrs, null, 2)
        )
      ]
    );
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeDefault/T3CeDefault.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeDefault-DFJpDWnv.mjs.map
