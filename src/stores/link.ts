import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useLinkStore = defineStore('link', () => {
  const userList: userListType[] = reactive([])
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
  function linkto(id: string, yes: (id: string) => void, no: () => void): Function {
    const connForThey = peerObj.connect(id)
    //@ts-ignore
    connForThey.once("data", (d: { ok: boolean }) => {
      if (d.ok) {
        addToLinklist(connForThey)
        yes(id)
      } else {
        connForThey.close()
        no()
      }
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
  function endLink(connForThey: DataConnection) {
    connForThey.close()
    peerObj.off("connection")
    countOfOnConnection = 0
  }
  return { userList, peerObj, myId, onConnection, linkto, addToLinklist, endLink }
})
export type userListType = {
  id: string
  msg: {
    text: string
    index: number
    type: "my" | "they" | "sys"
  }[],
  connForThey: DataConnection
  isDisconnected?: boolean
  islink?: boolean
}