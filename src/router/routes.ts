import start from '@/page/start.vue';
const routes = [
  {
    path: "/",
    component: start
  },
  {
    path: "/link/:id",
    component: () => import("@/page/link/saing.vue")
  },
  {
    path:"/link",
    component: () => import("@/page/link/addLink.vue")
  },
  {
    path: "/room/:id",
    component: () => import("@/page/room/room.vue")
  },
  {
    path: "/room",
    component: () => import("@/page/room/addRoom.vue")
  }
];
export default routes;
