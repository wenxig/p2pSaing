import type { InjectionKey } from 'vue'
type setTitleBarF = (vnode: JSX.Element) => void;
export const setTitleBar: InjectionKey<setTitleBarF> = Symbol('')
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $setTitleBarF: setTitleBarF;
  }
}