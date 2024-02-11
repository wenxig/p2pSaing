import { Link } from '@t/link'
import { Room } from '@t/room'
import Peer, { type DataConnection } from 'peerjs'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Server } from './server'
import { random } from 'lodash-es'

export const useLinkStore = defineStore('link', () => {
  const userList: Link.RoomListType[] = reactive([])
  const roomList: Room.RoomListType[] = reactive([])
  const peerObj = reactive(new Peer(`p2psaing_${random(10000000)}`))
  const myId = ref("")
  peerObj.once("open", (id) => {
    myId.value = id
    peerObj.on('disconnected', () => {
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
  async function linkto(id: string, yes: (id: string, conn: DataConnection) => void, no: () => void, isRoom?: boolean) {
    const connForThey = peerObj.connect(`p2psaing_${id}`)
    const main = () => {
      return new Promise((reolved) => {
        connForThey.once('open', () => {
          if (isRoom) {
            connForThey.send({ type: 'join' })
          }
          connForThey.once("data", async (d) => {
            const data = d as Room.joinData
            if (data.ok) {
              alert(data)
              if (data.server) {
                let connForThey2 = peerObj.connect(`p2psaing_${id}`)
                if (data.isServer) {
                  connForThey2 = await newServer()
                } else {
                  connForThey2 = peerObj.connect(`p2psaing_${id}`)
                }
                connForThey2.once('open', () => {
                  reolved(addToRoomlist(connForThey, connForThey2))
                })
              } else {
                reolved(addToLinklist(connForThey))
              }
            } else {
              connForThey.close()
              no()
            }
          })
        })
      })
    }
    await main()
    yes(id, connForThey)

    function newServer(): Promise<DataConnection> {
      const serid = connForThey.peer.startsWith("2-") ? connForThey.peer.substring(2) : "2-" + connForThey.peer
      return new Promise((resolve) => {
        const ser = new Server(() => {
          console.log(connForThey.peer, serid)
          ser.otherServer = ser.peerObj.connect(connForThey.peer)
          alert('ser.otherServer:', ser.otherServer)
          ser.otherServer.on('open', () => {
            ser.otherServer?.on('data', (d) => {
              console.log('online:', true, d)
              ser.otherServer?.send({ online: true })
            })

            if (ser.otherServer) {
              resolve(ser.otherServer)
            }
          })
        }, {
          id: serid,
        })
      })
    }
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
  function addToRoomlist(connForThey: DataConnection, connForThey2: DataConnection) {
    roomList.push({
      id: connForThey.peer,
      msg: [],
      connForThey,
      connForThey2
    })
  }
  function endLink(connForThey: DataConnection) {
    connForThey.close()
    peerObj.off("connection")
  }
  return { roomList, userList, peerObj, myId, onConnection, linkto, addToLinklist, endLink }
})