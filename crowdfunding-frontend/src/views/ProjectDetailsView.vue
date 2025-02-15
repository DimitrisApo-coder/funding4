<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const backendEnvVar = import.meta.env.VITE_BACKEND;
const route = useRoute();

const project = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await fetch(`${backendEnvVar}/api/project/${route.params.id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        project.value = await response.json();
        loading.value = false;
    } catch (error) {
        console.error('Error fetching project:', error);
    }
});
</script>

<template>
    <div>
        <div v-if="loading">Loading...</div>
        <div v-else-if="project">
            <h3>{{ project.name }}</h3>
            <p>{{ project.description }}</p>
            <p>Funding Goal: {{ project.fundingGoal }}</p>
            <p>Current Funding: {{ project.currentFunding }}</p>
            <p>Status: {{ project.approved ? 'Approved' : 'Pending Approval' }}</p>
        </div>
    </div>
</template>