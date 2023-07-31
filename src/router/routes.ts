import start from '@/page/start.vue';
import addLink from '@/page/addLink.vue';
const routes = [
  {
    path: "/",
    component: start
  },
  {
    path: "/saing/:id",
    component: () => import("@/page/saing.vue")
  },
  {
    path:"/addLink",
    component: addLink
  }
];
export default routes;
