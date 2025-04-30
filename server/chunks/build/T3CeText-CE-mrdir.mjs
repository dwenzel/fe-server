import _sfc_main$1 from './T3CeHeader-Czpk-uK_.mjs';
import _sfc_main$2 from './T3HtmlParser-CQ9DKlrt.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeText",
  __ssrInlineRender: true,
  props: {
    bodytext: {},
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
      const _component_T3CeHeader = _sfc_main$1;
      const _component_T3HtmlParser = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-ce-text" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_T3CeHeader, props, null, _parent));
      if (_ctx.bodytext) {
        _push(ssrRenderComponent(_component_T3HtmlParser, { content: _ctx.bodytext }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeText/T3CeText.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeText-CE-mrdir.mjs.map
