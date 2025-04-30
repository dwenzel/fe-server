import { resolveDynamicComponent } from 'vue';
import { F as pascalCase } from '../nitro/nitro.mjs';

const useT3DynamicComponent = ({
  type,
  prefix,
  mode
} = {
  type: "Default",
  prefix: "T3Ce",
  mode: "Lazy"
}) => {
  const componentName = (mode || "Lazy") + (prefix || "T3Ce") + pascalCase(type || "default");
  const component = resolveDynamicComponent(componentName);
  if (typeof component === "string") {
    return resolveDynamicComponent(`${prefix}Default`);
  }
  return component;
};
const useT3DynamicBl = (type = "default") => {
  return useT3DynamicComponent({ type, prefix: "T3Bl", mode: "" });
};
const useT3DynamicCe = (type = "default") => {
  return useT3DynamicComponent({ type, prefix: "T3Ce", mode: "" });
};

export { useT3DynamicCe as a, useT3DynamicComponent as b, useT3DynamicBl as u };
//# sourceMappingURL=useT3DynamicComponent-DuRXCZlv.mjs.map
