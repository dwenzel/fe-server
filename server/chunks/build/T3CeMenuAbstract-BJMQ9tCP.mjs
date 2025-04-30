import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import _sfc_main$1 from './T3CeMenuPages-Cd5LKeFL.mjs';
import _sfc_main$2 from './T3HtmlParser-CQ9DKlrt.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeMenuAbstract",
  __ssrInlineRender: true,
  props: {
    menu: {},
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps(_ctx.$props, { class: "t3-ce-menu-abstract" }, _attrs), {
        link: withCtx(({ link }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(link.title)} `);
            if (link.abstract) {
              _push2(ssrRenderComponent(_sfc_main$2, {
                content: link.abstract
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createTextVNode(toDisplayString(link.title) + " ", 1),
              link.abstract ? (openBlock(), createBlock(_sfc_main$2, {
                key: 0,
                content: link.abstract
              }, null, 8, ["content"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeMenuAbstract/T3CeMenuAbstract.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeMenuAbstract-BJMQ9tCP.mjs.map
