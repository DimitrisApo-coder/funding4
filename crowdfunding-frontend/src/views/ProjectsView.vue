<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRemoteData } from '@/composables/useRemoteData.js';
import { useApplicationStore } from '@/stores/application.js';
import FundProjectModal from './FundProjectModal.vue';

const backendEnvVar = import.meta.env.VITE_BACKEND;
const applicationStore = useApplicationStore();

const urlRef = ref(backendEnvVar + '/project');
const authRef = ref(true);
const { data, loading, performRequest } = useRemoteData(urlRef, authRef);

// Filter for approved projects that haven't reached their funding goal
const approvedProjects = computed(() => {
    if (!data.value || !data.value._embedded || !data.value._embedded.projects) {
        return [];
    }
    return data.value._embedded.projects.filter(project => 
        project.approved === true && 
        project.currentFunding < project.fundingGoal
    );
});

// Check if user has admin role
const isAdmin = computed(() => {
    return applicationStore.userData?.roles.some(role => role === 'ROLE_ADMIN');
});

// New state for funding modal
const showFundingModal = ref(false);
const selectedProject = ref(null);

const openFundingModal = (project) => {
    selectedProject.value = project;
    showFundingModal.value = true;
};

const handleFundingSuccess = () => {
    performRequest(); // Refresh the projects list
};

// Function to toggle project approval
const toggleApproval = async (project) => {
    try {
        const updatedProject = {
            ...project,
            approved: !project.approved
        };

        const response = await fetch(`${backendEnvVar}/api/project/${project.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
        });

        if (!response.ok) {
            throw new Error('Failed to update project approval status');
        }

        // Refresh the projects list
        performRequest();
    } catch (error) {
        console.error('Error updating project:', error);
        alert('Failed to update project approval status');
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
                    <!-- Approved Projects Section -->
                    <div class="mb-4">
                        <h1 class="fs-3">Active Projects</h1>
                    </div>
                    <div v-if="loading" class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else-if="approvedProjects.length === 0" class="alert alert-info">
                        No active projects available at the moment.
                    </div>
                    <div v-else>
                        <table class="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Funding Goal</th>
                                <th>Current Funding</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody v-if="loading">
                            <tr>
                                <td colspan="6">Loading...</td>
                            </tr>
                            </tbody>
                            <tbody v-else-if="approvedProjects.length === 0">
                            <tr>
                                <td colspan="6">No approved projects available.</td>
                            </tr>
                            </tbody>
                            <tbody v-else>
                            <tr v-for="project in approvedProjects" :key="project.id">
                                <td>{{ project.id }}</td>
                                <td>{{ project.name }}</td>
                                <td>{{ project.description }}</td>
                                <td>{{ project.fundingGoal }}</td>
                                <td>{{ project.currentFunding }}</td>
                                <td class="d-flex gap-2">
                                    <button
                                        @click="openFundingModal(project)"
                                        class="btn btn-success btn-sm"
                                    >
                                        Fund Project
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Admin Section -->
                    <div v-if="isAdmin" class="mt-5">
                        <h2 class="fs-4">Admin Project Management</h2>
                        <small class="text-muted">All projects including completed ones</small>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Creator</th>
                                    <th>Description</th>
                                    <th>Funding Goal</th>
                                    <th>Current Funding</th>
                                    <th>Approval Status</th>
                                </tr>
                                </thead>
                                <tbody v-if="loading">
                                <tr>
                                    <td colspan="7">Loading...</td>
                                </tr>
                                </tbody>
                                <tbody v-if="data">
                                <tr v-for="project in data._embedded.projects" :key="project.id">
                                    <td>{{ project.id }}</td>
                                    <td>{{ project.name }}</td>
                                    <td>{{ project.creator }}</td>
                                    <td>{{ project.description }}</td>
                                    <td>{{ project.fundingGoal }}</td>
                                    <td>{{ project.currentFunding }}</td>
                                    <td>
                                        <div class="form-check form-switch">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :id="'approval-' + project.id"
                                                :checked="project.approved"
                                                @change="toggleApproval(project)"
                                            >
                                            <label
                                                class="form-check-label"
                                                :for="'approval-' + project.id"
                                            >
                                                {{ project.approved ? 'Approved' : 'Not Approved' }}
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Funding Modal -->
    <FundProjectModal
        v-if="selectedProject"
        :project="selectedProject"
        :show="showFundingModal"
        @close="showFundingModal = false"
        @fund-success="handleFundingSuccess"
    />
</template>

<style scoped>
.form-switch {
    padding-left: 2.5em;
}
.form-check-input {
    cursor: pointer;
}
</style>