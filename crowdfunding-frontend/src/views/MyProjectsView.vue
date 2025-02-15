<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';
import { useApplicationStore } from '@/stores/application.js';
const backendEnvVar = import.meta.env.VITE_BACKEND;

const applicationStore = useApplicationStore();
const urlRef = ref(backendEnvVar + '/project');
const authRef = ref(true);
const { data, loading, performRequest } = useRemoteData(urlRef, authRef);

// Filter projects to only show the user's own projects
const myProjects = computed(() => {
    if (!data.value || !data.value._embedded || !data.value._embedded.projects) {
        return [];
    }
    return data.value._embedded.projects.filter(
        project => project.creator === applicationStore.userData?.username
    );
});

const deleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    try {
        const response = await fetch(`${backendEnvVar}/api/project/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refresh the projects list
        performRequest();
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
    }
};

onMounted(() => {
    performRequest();
});
</script>

<template>
    <div class="bg-body-tertiary">
        <div class="container">
            <div class="row py-4 px-3">
                <div class="col-12">
                    <div class="mb-4">
                        <h1 class="fs-3">My Projects</h1>
                    </div>
                    <div>
                        <table class="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Approved</th>
                                <th>Funding Goal</th>
                                <th>Current Funding</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody v-if="loading">
                            <tr>
                                <td colspan="7">Loading...</td>
                            </tr>
                            </tbody>
                            <tbody v-else-if="myProjects.length === 0">
                            <tr>
                                <td colspan="7">You haven't created any projects yet.</td>
                            </tr>
                            </tbody>
                            <tbody v-else>
                            <tr v-for="project in myProjects" :key="project.id">
                                <td>{{ project.id }}</td>
                                <td>{{ project.name }}</td>
                                <td>{{ project.description }}</td>
                                <td>{{ project.approved }}</td>
                                <td>{{ project.fundingGoal }}</td>
                                <td>{{ project.currentFunding }}</td>
                                <td class="d-flex gap-2">
                                    <RouterLink
                                        :to="{ name: 'project-edit', params: { id: project.id }}"
                                        class="btn btn-primary btn-sm"
                                    >
                                        Edit Project
                                    </RouterLink>
                                    <button
                                        @click="deleteProject(project.id)"
                                        class="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <RouterLink :to="{ name: 'project-new' }" class="btn btn-success">
                        Create New Project
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>