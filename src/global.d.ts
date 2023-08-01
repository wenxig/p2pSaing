/// <reference types="vite/client" />
declare function alert(...message: any[]): void //那个文件有import

interface Array<T> {
  find<S extends T>(predicate: (value: T, index: number, obj: Array<T>) => value is S, thisArg?: any): S ;
  find(predicate: (value: T, index: number, obj: Array<T>) => unknown, thisArg?: any): T ;
}

