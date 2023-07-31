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
  allConn: Set<DataConnection> = reactive(new Set())
  constructor(open: (id: string) => void, id?: string) {
    //@ts-ignore
    st.serverList.push(this)
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
        conn.send({
          ok: true,
          server: true
        })
        conn.once('close', () => this.allConn.delete(conn))
        this.allConn.add(conn)
      })
      open(id)
    })
  }
}