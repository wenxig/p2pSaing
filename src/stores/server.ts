import { Room } from '@t/room'
import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useRoomStore = defineStore('room', () => {
  const serverList: Server[] = reactive([])
  return { serverList }
})

let st = useRoomStore()
export class Server {
  id?: string
  peerObj: Peer
  isReady = ref(false)
  allConn: DataConnection[] = reactive([])
  constructor(open: (id: string) => void, options: Room.options) {
    if (options.id && options.id.startsWith('2-')) {
      this.peerObj = new Peer(options.id)
      this.id = options.id
    } else if (options.id) {
      this.peerObj = new Peer(`2-${options.id}`)
      this.id = `2-${options.id}`
    } else {
      this.peerObj = new Peer()
    }
    this.peerObj.once('open', (id) => {
      this.isReady.value = true
      this.id = id
      this.peerObj.on('connection', (conn) => {
        conn.once('data', (d) => {
          const data = d as Room.joinData
          if (options.maxUser??Infinity>this.allConn.length) {
            if (data.type == 'join') { //请求加入消息判断
              conn.send({
                ok: true,
                server: true
              })
              conn.once('close', () => this.allConn.splice(this.allConn.indexOf(conn), 1))
              this.allConn.push(conn)
              conn.on("data", (d) => this.broadcast(d as Room.MsgType, conn))
            } else {
              conn.send({
                ok: true
              })
              conn.once('close', () => this.allConn.splice(this.allConn.indexOf(conn), 1))
              this.allConn.push(conn)
              conn.on("data", (d) => this.broadcast(d as Room.MsgType, conn))
            }
          }
        })
      })
      //@ts-ignore
      st.serverList.push(this)
      open(id)
    })
  }
  public broadcast(d: Room.MsgType, unbroadcast: DataConnection) {
    this.allConn.forEach((v) => {
      if (unbroadcast.peer != v.peer) v.send(d)
    })
  }
}
