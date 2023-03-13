import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const route = [
    {
        path: '/',
        component: () => import('@/components/ExtensionCheck.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: route,
})

export default router;