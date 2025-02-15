import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from '../views/HomeView.vue';
import { useApplicationStore } from '@/stores/application.js';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            // component: HomeView,
            component: () => import('../views/HomeView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/projects',
            name: 'projects',
            component: () => import('../views/ProjectsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/projects/new',
            name: 'project-new',
            component: () => import('../views/CreateProjectView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/my-projects',
            name: 'my-projects',
            component: () => import('../views/MyProjectsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/projects/:id',
            name: 'project',
            component: () => import('../views/ProjectView.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '', // default child route
                    name: 'project-details',
                    component: () => import('../views/ProjectDetailsView.vue'),
                },
                {
                    path: 'edit',
                    name: 'project-edit',
                    component: () => import('../views/UpdateProjectView.vue'),
                }
            ]
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/SignupView.vue')
        },
        {
            path: '/user-management',
            name: 'user-management',
            component: () => import('../views/UserManagement.vue'),
            meta: { requiresAdmin: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/logout',
            name: 'logout',
            component: () => import('../views/LogoutView.vue'),
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useApplicationStore();
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !isAuthenticated) {
        console.log('user not authenticated. redirecting to /login');
        next('/login');
    } else {
        next();
    }
});

export default router;
