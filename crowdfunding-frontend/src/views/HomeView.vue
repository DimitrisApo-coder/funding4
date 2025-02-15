<script setup>
import { useApplicationStore } from '@/stores/application.js';
const { userData } = useApplicationStore();
import { computed } from 'vue';
const applicationStore = useApplicationStore();
const isAdmin = computed(() => {
    return applicationStore.userData?.roles.includes('ROLE_ADMIN');
});
</script>

<template>
    <div v-if="isAdmin" class="container py-3">
        <div class="d-flex gap-2 mb-4">
            <h4 class="mb-0">Admin Tools:</h4>
            <RouterLink :to="{ name: 'user-management' }" class="btn btn-secondary">
                User Management
            </RouterLink>
        </div>
    </div>
    <div class="bg-body-tertiary">
        <div class="container">
            <div class="row py-4 px-3">
                <div class="col-12">
                    <div class="mb-4">
                        <h1 class="fs-3">Home</h1>
                    </div>
                    <div>
                        <p>
                            Logged in as: <strong>{{ userData.username }}</strong>
                        </p>
                        <p>
                            Logged in as: <strong>{{ userData.roles }}</strong>
                        </p>
                        <p>
                            Logged in as: <strong>{{ userData.id }}</strong>
                        </p>
                      <!--  <ul>
                            <li>
                                <RouterLink :to="{ name: 'students' }">Manage Students</RouterLink>
                            </li>
                            <li>
                                <RouterLink :to="{ name: 'courses' }">Manage Courses</RouterLink>
                            </li>
                        </ul> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
