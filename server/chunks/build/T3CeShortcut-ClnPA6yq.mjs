import _sfc_main$1 from './T3Renderer-AXcfLVVI.mjs';
import { useSSRContext, h } from 'vue';
import 'vue/server-renderer';
import './useT3DynamicComponent-DuRXCZlv.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';

const T3CeShortcut = (props) => {
  return h("div", null, [
    h(_sfc_main$1, {
      content: props.shortcut
    })
  ]);
};
const _sfc_main = T3CeShortcut;
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeShortcut/T3CeShortcut.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeShortcut-ClnPA6yq.mjs.map
