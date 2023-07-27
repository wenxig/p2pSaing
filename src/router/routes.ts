import start from '@/page/start.vue';
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
    component: () => import("@/page/addLink.vue")
  }
];
export default routes;
