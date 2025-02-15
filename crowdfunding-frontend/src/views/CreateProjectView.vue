<script setup>
import { ref, onMounted } from "vue";
import { useRemoteData } from "@/composables/useRemoteData.js";
import { useApplicationStore } from "@/stores/application.js";
const backendEnvVar = import.meta.env.VITE_BACKEND;

const applicationStore = useApplicationStore();

const formDataRef = ref({
    name: "",
    description: "",
    approved: false,
    fundingGoal: null,
    currentFunding: null,
    creator: applicationStore.userData?.username || '' // Set default creator
});

const urlRef = ref(backendEnvVar + "/project");
const authRef = ref(true);
const methodRef = ref("POST");

const { data, performRequest } = useRemoteData(urlRef, authRef, methodRef, formDataRef);

// Update creator when component mounts (in case store wasn't ready during initial ref creation)
onMounted(() => {
    formDataRef.value.creator = applicationStore.userData?.username || '';
});

const onSubmit = () => {
    // Ensure creator is set before submission
    formDataRef.value.creator = applicationStore.userData?.username;
    performRequest();
};
</script>

<template>
    <div class="container mb-4">
        <h1>New Project</h1>
    </div>
    <div>
        <pre>{{ data }}</pre>
    </div>
    <div class="container mb-4">
        <div class="mb-2">
            <label for="name">Name</label>
            <input class="form-control" id="name" v-model="formDataRef.name" type="text" />
        </div>
        <div class="mb-2">
            <label for="description">Description</label>
            <textarea class="form-control" id="description" v-model="formDataRef.description"></textarea>
        </div>
        <div class="mb-2 d-none">
            <label for="creator">Creator</label>
            <input
                class="form-control"
                id="creator"
                v-model="formDataRef.creator"
                type="text"
                readonly
                disabled
            />
            <small class="form-text text-muted">Automatically set to current user</small>
        </div>
        <div class="mb-2">
            <label for="fundingGoal">Funding Goal</label>
            <input class="form-control" id="fundingGoal" v-model="formDataRef.fundingGoal" type="number" />
        </div>
        <div class="">
            <button class="btn btn-primary" @click="onSubmit" type="button">Create new project</button>
        </div>
    </div>
</template>

<style scoped>
.form-text {
    font-size: 0.875em;
    color: #6c757d;
}

/* Style for disabled input to make it look less faded */
input:disabled {
    background-color: #f8f9fa;
    opacity: 1;
    cursor: not-allowed;
}
</style>