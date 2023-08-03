import { Link } from '@t/link'
import { Room } from '@t/room'
import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useLinkStore = defineStore('link', () => {
  const userList: Link.RoomListType[] = reactive([])
  const roomList: Room.RoomListType[] = reactive([])
  const peerObj = reactive(new Peer())
  const myId = ref("")
  peerObj.once("open", (id) => {
    myId.value = id
    peerObj.on('disconnected',()=>{
      peerObj.reconnect()
    })
  })

  function onConnection(callback: (id: string, yes: () => DataConnection, no: () => void) => void) {
    peerObj.once("connection", (connForThey: DataConnection) => {
      callback(connForThey.peer, () => {
        connForThey.send({
          ok: true
        })
        addToLinklist(connForThey)
        return connForThey
      }, () => {
        connForThey.send({
          ok: false
        })
        connForThey.close()
      })
    })
  }
  function linkto(id: string, yes: (id: string, conn: DataConnection) => void, no: () => void, isRoom?: boolean): () => void {
    const connForThey = peerObj.connect(id)
    connForThey.once('open', () => {
      if (isRoom) {
        connForThey.send({ type: 'join' })
      }
      console.log(connForThey.open)

      connForThey.once("data", (d) => {
        const data = d as Room.joinData
        alert('on data', data);
        if (data.ok) {
          if (data.server) {
            addToRoomlist(connForThey)
          } else {
            addToLinklist(connForThey)
          }
          console.log(connForThey.open)
          yes(id, connForThey)
        } else {
          connForThey.close()
          no()
        }
      })
    })

    return () => {
      connForThey.off("data")
      connForThey.close()
    }
  }
  function addToLinklist(connForThey: DataConnection) {
    userList.push({
      id: connForThey.peer,
      msg: [],
      connForThey,
      islink: true,
      isDisconnected: false
    })
  }
  function addToRoomlist(connForThey: DataConnection) {
    roomList.push({
      id: connForThey.peer,
      msg: [],
      connForThey
    })
  }
  function endLink(connForThey: DataConnection) {
    connForThey.close()
    peerObj.off("connection")
  }
  return { roomList, userList, peerObj, myId, onConnection, linkto, addToLinklist, endLink }
})