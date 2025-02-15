import { ref } from 'vue';
import { useApplicationStore } from '@/stores/application.js';

export function useRemoteData(urlRef, authRef, methodRef = ref("GET"), bodyRef = ref(null)) {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const store = useApplicationStore();

    const performRequest = async () => {
        loading.value = true;
        error.value = null;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (authRef.value === true) {
            // Get token from userData
            const token = store.userData?.accessToken;
            console.log('Token being used:', token); // Debug log

            if (!token) {
                error.value = 'No authentication token available';
                loading.value = false;
                return;
            }

            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method: methodRef.value,
            headers: headers,
            credentials: 'include'
        };

        if (bodyRef.value !== null) {
            config.body = JSON.stringify(bodyRef.value);
        }

        console.log('Request URL:', urlRef.value); // Debug log
        console.log('Request Config:', config); // Debug log

        try {
            const response = await fetch(urlRef.value, config);
            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('Response data:', responseData); // Debug log
            data.value = responseData;
        } catch (err) {
            console.error('Request error:', err); // Debug log
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    return { data, error, loading, performRequest };
}