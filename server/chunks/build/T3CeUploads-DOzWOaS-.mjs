import _sfc_main$1 from './T3CeHeader-Czpk-uK_.mjs';
import { e as useT3Options, a as __nuxt_component_0 } from './server.mjs';
import _sfc_main$2 from './MediaFile-BpdiDXv9.mjs';
import { defineComponent, mergeProps, withCtx, unref, openBlock, createBlock, createVNode, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import './T3Link-BBeWASBP.mjs';
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
import './useMediaFile-DLdyHopL.mjs';

const useT3CeUploads = () => {
  var _a;
  const { currentSiteOptions } = useT3Options();
  const baseUrl = (_a = currentSiteOptions.value) == null ? void 0 : _a.api.baseUrl;
  const getExtensionImg = (extension) => {
    return `${baseUrl}/typo3/sysext/frontend/Resources/Public/Icons/FileIcons/${extension}.gif`;
  };
  const onError = (event) => {
    const element = event.target;
    element.src = getExtensionImg("default");
  };
  return { getExtensionImg, onError };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "T3CeUploads",
  __ssrInlineRender: true,
  props: {
    media: {},
    target: {},
    displayFileSizeInformation: {},
    displayDescription: {},
    displayInformation: {},
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
    const { getExtensionImg, onError } = useT3CeUploads();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_T3CeHeader = _sfc_main$1;
      const _component_nuxt_link = __nuxt_component_0;
      const _component_MediaFile = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "t3-ce-uploads" }, _attrs))}>`);
      if (props.header) {
        _push(ssrRenderComponent(_component_T3CeHeader, props, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (props.media) {
        _push(`<ul><!--[-->`);
        ssrRenderList(props.media, (file, key) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: file.publicUrl,
            target: props.target || "_self"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (props.displayInformation === "1") {
                  _push2(`<span class="t3-ce-uploads__icon"${_scopeId}><img${ssrRenderAttr("src", unref(getExtensionImg)(file.properties.extension))}${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (props.displayInformation === "2" && file.properties.type === "image") {
                  _push2(`<span class="t3-ce-uploads__thumb"${_scopeId}>`);
                  _push2(ssrRenderComponent(_component_MediaFile, { file }, null, _parent2, _scopeId));
                  _push2(`</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span class="t3-ce-uploads__name"${_scopeId}>${ssrInterpolate(file.properties.title || file.publicUrl)}</span>`);
                if (props.displayFileSizeInformation) {
                  _push2(`<span class="t3-ce-uploads__size"${_scopeId}>${ssrInterpolate(file.properties.size)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  props.displayInformation === "1" ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "t3-ce-uploads__icon"
                  }, [
                    createVNode("img", {
                      src: unref(getExtensionImg)(file.properties.extension),
                      onError: unref(onError)
                    }, null, 40, ["src", "onError"])
                  ])) : createCommentVNode("", true),
                  props.displayInformation === "2" && file.properties.type === "image" ? (openBlock(), createBlock("span", {
                    key: 1,
                    class: "t3-ce-uploads__thumb"
                  }, [
                    createVNode(_component_MediaFile, { file }, null, 8, ["file"])
                  ])) : createCommentVNode("", true),
                  createVNode("span", { class: "t3-ce-uploads__name" }, toDisplayString(file.properties.title || file.publicUrl), 1),
                  props.displayFileSizeInformation ? (openBlock(), createBlock("span", {
                    key: 2,
                    class: "t3-ce-uploads__size"
                  }, toDisplayString(file.properties.size), 1)) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (props.displayDescription && file.properties.description) {
            _push(`<p class="t3-ce-uploads__desc">${ssrInterpolate(file.properties.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@t3headless/nuxt-typo3/dist/runtime/components/T3CeUploads/T3CeUploads.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=T3CeUploads-DOzWOaS-.mjs.map
