/// <reference types="vite/client" />
import type { DataConnection } from 'peerjs';

declare namespace Room {
  type RoomListType = {
    id: string,
    msg: MsgType[],
    connForThey: DataConnection
  }
  interface MsgType {
    from: string,
    msg: string,
    type: "text" | "img",
    is: "sys" | "my" | "they",
    md5?: string,
    serverId: [string, string],
    time:Date,
    blob?: Blob
  }
}
