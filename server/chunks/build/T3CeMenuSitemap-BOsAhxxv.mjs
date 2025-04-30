import { ssrRenderComponent } from 'vue/server-renderer';
import _sfc_main$1 from './T3CeMenuPages-Cd5LKeFL.mjs';
import { useSSRContext } from 'vue';
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
import './T3CeMenuPagesList-C7UFai7J.mjs';

const _sfc_main = {
  __name: "T3CeMenuSitemap",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, null, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeMenuSitemap/T3CeMenuSitemap.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeMenuSitemap-BOsAhxxv.mjs.map
