import { Link } from '@/link'
import { Room } from '@/room'
import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useLinkStore = defineStore('link', () => {
  const userList: Link.RoomListType[] = reactive([])
  const roomList:Room.RoomListType[] = reactive([])
  const peerObj = reactive(new Peer())
  const myId = ref("")
  let countOfOnConnection = 0
  peerObj.on("open", (id) => {
    myId.value = id
  })

  function onConnection(callback: (id: string, yes: () => DataConnection, no: () => void) => void) {
    if (countOfOnConnection < 1) {
      countOfOnConnection++
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
  }
  function linkto(id: string, yes: (id: string) => void, no: () => void, isRoom?: boolean): () => void {
    const connForThey = peerObj.connect(id)
    connForThey.once('open', () => {
      if (isRoom) {
        connForThey.send({ type: 'join' })
      }
      //@ts-ignore
      connForThey.once("data", (d: { ok: boolean, server?: boolean }) => {
        alert('on data', d);
        if (d.ok) {
          if (d.server) {
            addToRoomlist(connForThey)
          } else {
            addToLinklist(connForThey)
          }
          yes(id)
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
    countOfOnConnection = 0
  }
  return { roomList, userList, peerObj, myId, onConnection, linkto, addToLinklist, endLink }
})