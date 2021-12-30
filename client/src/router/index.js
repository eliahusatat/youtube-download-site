import VueRouter from 'vue-router';
const routes = [
    {
        path: '/youtube',
        name: 'Youtube',
        component: () => import('../pages/youtube/YoutubePage'),
        meta: {requiresAuth: true},
    }
]

const router = new VueRouter({
    mode: 'history',
    saveScrollPosition: true,
    routes
});

export default router;