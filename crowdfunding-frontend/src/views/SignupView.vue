<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const backendEnvVar = import.meta.env.VITE_BACKEND;

const router = useRouter();
const loading = ref(false);
const signupFailed = ref(false);
const errorMessage = ref('');
const isAdmin = ref(false);

const formData = ref({
    username: '',
    email: '',
    password: '',
    role: null // This will be set only if admin is selected
});

const onFormSubmit = async (event) => {
    event.preventDefault();
    loading.value = true;
    signupFailed.value = false;
    errorMessage.value = '';

    try {
        // Create request body
        const requestBody = {
            username: formData.value.username,
            email: formData.value.email,
            password: formData.value.password
        };

        // Only add role if admin is selected
        if (isAdmin.value) {
            requestBody.role = new Set(['admin']);
        }

        console.log('Sending request:', requestBody); // Debug log

        const response = await fetch(`${backendEnvVar}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        console.log('Response:', data); // Debug log

        if (response.ok) {
            router.push({
                name: 'login',
                query: { registered: 'success' }
            });
        } else {
            signupFailed.value = true;
            errorMessage.value = data.message || 'Registration failed';
        }
    } catch (err) {
        console.error('Signup error:', err);
        signupFailed.value = true;
        errorMessage.value = 'An error occurred during registration';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="bg-body-tertiary">
        <div class="container">
            <div class="row py-4 px-3">
                <div class="col-4">
                    <div class="mb-4">
                        <h1 class="fs-3">Sign Up</h1>
                    </div>
                    <div class="spinner-border" role="status" v-if="loading">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <form v-else @submit="onFormSubmit">
                        <div class="mb-2" v-if="signupFailed">
                            <div class="alert alert-danger" role="alert">
                                {{ errorMessage }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="usernameFormControl" class="form-label mb-1">Username</label>
                            <input
                                v-model="formData.username"
                                type="text"
                                class="form-control"
                                id="usernameFormControl"
                                required
                                minlength="3"
                                maxlength="20"
                            />
                            <small class="form-text text-muted">Username must be between 3 and 20 characters</small>
                        </div>

                        <div class="mb-3">
                            <label for="emailFormControl" class="form-label mb-1">Email address</label>
                            <input
                                v-model="formData.email"
                                type="email"
                                class="form-control"
                                id="emailFormControl"
                                required
                                maxlength="50"
                            />
                        </div>

                        <div class="mb-3">
                            <label for="passwordFormControl" class="form-label mb-1">Password</label>
                            <input
                                v-model="formData.password"
                                type="password"
                                class="form-control"
                                id="passwordFormControl"
                                required
                                minlength="6"
                                maxlength="40"
                            />
                            <small class="form-text text-muted">Password must be between 6 and 40 characters</small>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">Sign Up</button>
                            <RouterLink :to="{ name: 'login' }" class="btn btn-link">
                                Already have an account? Login
                            </RouterLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-text {
    font-size: 0.875em;
    color: #6c757d;
}
</style>