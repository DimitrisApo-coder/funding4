<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useApplicationStore } from '@/stores/application.js';

const backendEnvVar = import.meta.env.VITE_BACKEND;
const router = useRouter();
const route = useRoute();
const applicationStore = useApplicationStore();

const project = ref({
    name: '',
    description: '',
    approved: false,
    fundingGoal: 0,
    currentFunding: 0
});

const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        const response = await fetch(`${backendEnvVar}/api/project/${route.params.id}`, {
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched project data:', data); // Debug log
        project.value = data;
    } catch (err) {
        console.error('Error fetching project:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
});

const updateProject = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${backendEnvVar}/api/project/${route.params.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project.value)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await response.json();
        router.push({ name: 'projects' });
    } catch (err) {
        console.error('Error updating project:', err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="bg-body-tertiary">
        <div class="container">
            <div class="row py-4 px-3">
                <div class="col-12">
                    <h2>Update Project</h2>

                    <!-- Error Message -->
                    <div v-if="error" class="alert alert-danger" role="alert">
                        {{ error }}
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="d-flex justify-content-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <!-- Form -->
                    <form v-if="!loading && !error" @submit.prevent="updateProject" class="mt-4">
                        <div class="mb-3">
                            <label for="name" class="form-label">Name:</label>
                            <input type="text" id="name" v-model="project.name" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description:</label>
                            <textarea id="description" v-model="project.description" class="form-control" required></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="fundingGoal" class="form-label">Funding Goal:</label>
                            <input type="number" id="fundingGoal" v-model="project.fundingGoal" class="form-control" required>
                        </div>

                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            {{ loading ? 'Updating...' : 'Update Project' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>