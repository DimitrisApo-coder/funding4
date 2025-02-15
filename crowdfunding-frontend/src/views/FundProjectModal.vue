<script setup>
import { ref } from 'vue';
import { useApplicationStore } from '@/stores/application.js';

const props = defineProps({
    project: {
        type: Object,
        required: true
    },
    show: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'fund-success']);
const applicationStore = useApplicationStore();
const backendEnvVar = import.meta.env.VITE_BACKEND;
const fundingAmount = ref(0);
const loading = ref(false);
const error = ref(null);

const fundProject = async () => {
    if (fundingAmount.value <= 0) {
        error.value = "Please enter a valid funding amount";
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        const updatedProject = {
            ...props.project,
            currentFunding: props.project.currentFunding + Number(fundingAmount.value)
        };

        const response = await fetch(`${backendEnvVar}/api/project/${props.project.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${applicationStore.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
        });

        if (!response.ok) {
            throw new Error('Failed to update funding');
        }

        emit('fund-success');
        emit('close');
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div v-if="show" class="modal-backdrop show"></div>
    <div v-if="show" class="modal d-block" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Fund Project: {{ project.name }}</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <div v-if="error" class="alert alert-danger">{{ error }}</div>
                    <div class="mb-3">
                        <label for="fundingAmount" class="form-label">Funding Amount:</label>
                        <input
                            type="number"
                            class="form-control"
                            id="fundingAmount"
                            v-model="fundingAmount"
                            min="1"
                        >
                    </div>
                    <div class="funding-info">
                        <p>Current Funding: {{ project.currentFunding }}</p>
                        <p>Funding Goal: {{ project.fundingGoal }}</p>
                        <p>Remaining to Goal: {{ project.fundingGoal - project.currentFunding }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="$emit('close')">Close</button>
                    <button
                        type="button"
                        class="btn btn-primary"
                        @click="fundProject"
                        :disabled="loading"
                    >
                        {{ loading ? 'Processing...' : 'Fund Project' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>