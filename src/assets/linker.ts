import { Ref } from "vue";

export abstract class linker{
  abstract send(str: string, type?: "text" | "img", blob?: Blob):void
  abstract disconnected():void
  abstract tomsg:Ref<string>
  abstract isDisconnected:boolean
  abstract islink:boolean
}