import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, useSSRContext, h } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "T3CeMenuPagesList",
  __ssrInlineRender: true,
  props: {
    children: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const renderItems = () => {
      return props.children.map((el) => {
        return h("li", {}, [
          h(
            __nuxt_component_0,
            {
              to: el.link,
              target: el.target || null,
              title: el.title
            },
            () => [el.title]
          ),
          el.children ? h(_sfc_main, { children: el.children }) : null
        ]);
      });
    };
    const T3CeMenuPagesList = () => {
      return h(
        "ul",
        {},
        {
          default: () => renderItems()
        }
      );
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(T3CeMenuPagesList, _attrs, null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeMenuPages/T3CeMenuPagesList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeMenuPagesList-C7UFai7J.mjs.map
