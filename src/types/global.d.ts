/// <reference types="vite/client" />
export { };

declare global {
  declare module "element-plus";
  declare function alert(...message: any[]): void 
  interface Array<T> {
    find<S extends T>(predicate: (value: T, index: number, obj: Array<T>) => value is S, thisArg?: any): S;
    find(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T;
  }
  interface Window{
    mozRtcPeerConnection: RTCPeerConnection
    webkitRTCPeerConnection: RTCPeerConnection
  }
}