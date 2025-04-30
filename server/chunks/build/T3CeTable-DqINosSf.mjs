import _sfc_main$1 from './T3CeHeader-Czpk-uK_.mjs';
import { defineComponent, mergeProps, unref, createVNode, resolveDynamicComponent, withCtx, createTextVNode, toDisplayString, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
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

const useT3CeTable = (props) => {
  const thead = computed(() => {
    return props.tableHeaderPosition === 1 && [...props.bodytext].shift() || [];
  });
  const tbody = computed(() => {
    var _a, _b;
    const tbody2 = [...props.bodytext];
    if ((_a = thead == null ? void 0 : thead.value) == null ? void 0 : _a.length) {
      tbody2.shift();
    }
    if ((_b = tfoot == null ? void 0 : tfoot.value) == null ? void 0 : _b.length) {
      tbody2.pop();
    }
    return tbody2;
  });
  const tfoot = computed(() => {
    return props.tableTfoot === "1" && [...props.bodytext].pop() || [];
  });
  return { thead, tbody, tfoot };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeTable",
  __ssrInlineRender: true,
  props: {
    tableCaption: {},
    tableHeaderPosition: {},
    tableClass: {},
    tableTfoot: {},
    bodytext: { default: () => [] },
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
    const { thead, tbody, tfoot } = useT3CeTable(props);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_T3CeHeader = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [`t3-ce-table--${_ctx.tableClass}`, "t3-ce-table"]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_T3CeHeader, props, null, _parent));
      _push(`<table>`);
      if (_ctx.tableCaption) {
        _push(`<caption>${ssrInterpolate(_ctx.tableCaption)}</caption>`);
      } else {
        _push(`<!---->`);
      }
      if ((_a = unref(thead)) == null ? void 0 : _a.length) {
        _push(`<thead><tr><!--[-->`);
        ssrRenderList(unref(thead), (col, colKey) => {
          _push(`<th>${ssrInterpolate(col)}</th>`);
        });
        _push(`<!--]--></tr></thead>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(tbody)) {
        _push(`<tbody><!--[-->`);
        ssrRenderList(unref(tbody), (row, rowKey) => {
          _push(`<tr><!--[-->`);
          ssrRenderList(row, (col, colKey) => {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.tableHeaderPosition === 2 && colKey === 0 ? "th" : "td"), { key: colKey }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(col)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(col), 1)
                  ];
                }
              }),
              _: 2
            }), _parent);
          });
          _push(`<!--]--></tr>`);
        });
        _push(`<!--]--></tbody>`);
      } else {
        _push(`<!---->`);
      }
      if ((_b = unref(tfoot)) == null ? void 0 : _b.length) {
        _push(`<tfoot><tr><!--[-->`);
        ssrRenderList(unref(tfoot), (col, colKey) => {
          _push(`<td>${ssrInterpolate(col)}</td>`);
        });
        _push(`<!--]--></tr></tfoot>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</table></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeTable/T3CeTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeTable-DqINosSf.mjs.map
