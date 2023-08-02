import { Link } from '@t/link'
import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useRoomStore } from './room';
export const useLinkStore = defineStore('link', () => {
  const userList: Link.RoomListType[] = reactive([])
  const userIdList: string[] = reactive([])
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
    const room = useRoomStore()
    const connForThey = peerObj.connect(id)
    connForThey.once('open', () => {
      if (isRoom) {
        connForThey.send({ type: 'join' })
      }
      //@ts-ignore
      connForThey.once("data", (d: { ok: boolean, server?: boolean }) => {
        if (d.ok) {
          if (d.server) {
            room.addToRoomlist(connForThey)
          } else {
            addToLinklist(connForThey)
          }
          yes(id)
          connForThey.once('close', () => {
            delelyToLinklist(connForThey.peer)
          })
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
    userIdList.push(connForThey.peer)
  }

  function delelyToLinklist(id: string | DataConnection) {
    if (typeof id === "string") {
      userList.splice(userIdList.indexOf(id), 1)
    } else {
      userList.splice(userIdList.indexOf(id.peer), 1)
    }
  }

  function endLink(connForThey: DataConnection) {
    connForThey.close()
    peerObj.off("connection")
  }
  return { userList, peerObj, myId, onConnection, linkto, addToLinklist, endLink, userIdList, delelyToLinklist }
})