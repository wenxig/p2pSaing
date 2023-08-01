import { Ref } from "vue"

export abstract class linker{
  abstract send(str: string, type?: "text" | "img", blob?: Blob):void
  abstract islink?:boolean
  abstract tomsg: Ref<string>
}