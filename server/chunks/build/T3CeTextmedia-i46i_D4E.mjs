import _sfc_main$1 from './T3CeTextpic-DbpMcHRg.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import './T3MediaGallery-9iBzJquo.mjs';
import './MediaFile-BpdiDXv9.mjs';
import './useMediaFile-DLdyHopL.mjs';
import './T3CeHeader-Czpk-uK_.mjs';
import './T3Link-BBeWASBP.mjs';
import './server.mjs';
import 'node:http';
import 'node:https';
import '../nitro/nitro.mjs';
import 'node:fs';
import 'node:path';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import './T3HtmlParser-CQ9DKlrt.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeTextmedia",
  __ssrInlineRender: true,
  props: {
    bodytext: {},
    gallery: {},
    header: {},
    headerLayout: {},
    headerPosition: {},
    headerLink: {},
    subheader: {},
    uid: {},
    index: {},
    appearance: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_T3CeTextpic = _sfc_main$1;
      _push(ssrRenderComponent(_component_T3CeTextpic, mergeProps(props, { class: "t3-ce-textmedia" }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeTextmedia/T3CeTextmedia.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeTextmedia-i46i_D4E.mjs.map
