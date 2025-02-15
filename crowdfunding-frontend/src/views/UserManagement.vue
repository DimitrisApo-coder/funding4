<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';

const backendEnvVar = import.meta.env.VITE_BACKEND;
const applicationStore = useApplicationStore();
const router = useRouter();

const users = ref([]);
const loading = ref(true);
const error = ref(null);

// Check if user is admin, if not redirect
onMounted(async () => {
    const isAdmin = applicationStore.userData?.roles.includes('ROLE_ADMIN');
    if (!isAdmin) {
        router.push({ name: 'home' });
        return;
    }
    await fetchUsers();
});

// Filter out users with admin role
const filteredUsers = computed(() => {
    return users.value.filter(user => !user.roles.some(role => role.name === 'ROLE_ADMIN'));
});

// Fetch all users
const fetchUsers = async () => {
    try {
        const response = await fetch(`${backendEnvVar}/api/users`, {
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        users.value = data;
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

// Delete user
const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${backendEnvVar}/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete user');
        await fetchUsers(); // Refresh the list
    } catch (err) {
        error.value = err.message;
    }
};

// Toggle admin role
const toggleAdminRole = async (user) => {
    try {
        const isAdmin = user.roles.some(role => role.name === 'ROLE_ADMIN');
        const currentRoles = user.roles.map(role => role.name);
        let newRoles;
        
        if (isAdmin) {
            // Remove admin role but keep other roles
            newRoles = currentRoles.filter(role => role !== 'ROLE_ADMIN');
        } else {
            // Add admin role while keeping existing roles
            newRoles = [...currentRoles, 'ROLE_ADMIN'];
        }

        const response = await fetch(`${backendEnvVar}/api/users/${user.id}/roles`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roles: newRoles })
        });

        if (!response.ok) throw new Error('Failed to update user roles');
        await fetchUsers(); // Refresh the list
    } catch (err) {
        console.error('Error details:', err);
        error.value = err.message;
    }
};
</script>

<template>
    <div class="container py-4">
        <h1 class="mb-4">User Management</h1>

        <div v-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <div v-else class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filteredUsers" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <span
                                v-for="role in user.roles"
                                :key="role.name"
                                class="badge bg-primary me-1"
                            >
                                {{ role.name }}
                            </span>
                        </td>
                        <td>
                            <div class="btn-group">
                                <button
                                    @click="toggleAdminRole(user)"
                                    class="btn btn-sm btn-success"
                                >
                                    Make Admin
                                </button>
                                <button
                                    @click="deleteUser(user.id)"
                                    class="btn btn-sm btn-danger"
                                    :disabled="user.id === applicationStore.userData?.id"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>