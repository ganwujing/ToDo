import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../src/components/index'
import todo from '../src/components/todo'
Vue.use(VueRouter)

export default new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: "/home",
            name: "index",
            components: index
        },
        {
            path: "/todo",
            name: "todo",
            component: todo,

        }
    ]
})