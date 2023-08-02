import { Room } from '@t/room'
import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
export const useRoomStore = defineStore('room', () => {
  const serverList: Server[] = reactive([])
  const roomList: Room.RoomListType[] = reactive([])
  function addToRoomlist(connForThey: DataConnection) {
    roomList.push({
      id: connForThey.peer,
      msg: [],
      connForThey
    })
  }
  return { serverList, addToRoomlist, roomList }
})

export class Server {
  id?: string
  peerObj: Peer
  isReady = ref(false)
  allConn: DataConnection[] = reactive([])
  constructor(open: (id: string) => void, roomStore: any, id?: string) {
    if (id && id.startsWith('2-')) {
      this.peerObj = new Peer(id)
      this.id = id
    } else if (id) {
      this.peerObj = new Peer(`2-${id}`)
      this.id = `2-${id}`
    } else {
      this.peerObj = new Peer()
    }
    this.peerObj.once('open', (id) => {
      this.isReady.value = true
      this.id = id
      this.peerObj.on('connection', (conn) => {
        conn.once('data', (d: any) => {
          const data = d as { type: string }
          if (data.type == 'join') { //请求加入消息判断
            conn.send({
              ok: true,
              server: true
            })
            conn.once('close', () => this.allConn.splice(this.allConn.indexOf(conn), 1))
            this.allConn.push(conn)
            conn.on("data", (d) => this.broadcast(d as Room.MsgType, conn))
          }
        })
      })
      roomStore.serverList.push(this)
      open(id)
    })
  }
  public broadcast(d: Room.MsgType, unbroadcast: DataConnection) {
    this.allConn.forEach((v) => {
      if (unbroadcast.peer != v.peer) v.send(d)
    })
  }
}
