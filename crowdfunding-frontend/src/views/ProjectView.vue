<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const projectIdRef = ref(null);

onMounted(() => {
    projectIdRef.value = route.params.id;
});
</script>

<template>
    <div class="bg-body-tertiary">
        <div class="container">
            <div class="row py-4 px-3">
                <div class="col-12">
                    <div class="mb-4">
                        <RouterLink class="small" :to="{ name: 'projects' }"
                        >Back to Projects</RouterLink>
                        <h1 class="fs-3">Project #{{ projectIdRef }}</h1>
                    </div>
                    <div class="mb-4">
                    </div>
                    <!-- This is the important part - it renders the child route component -->
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>