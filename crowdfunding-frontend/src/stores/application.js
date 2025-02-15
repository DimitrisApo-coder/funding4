import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

function checkJWT(token) {
    if (token === null || token === undefined) {
        return false;
    }
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    // Debug log to see token payload
    console.log('JWT Payload:', payload);

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime < payload.exp;
}

export const useApplicationStore = defineStore('application', () => {
    const userData = ref(null);

    const setUserData = (tempUserData) => {
        userData.value = tempUserData;
        console.log('User data set:', tempUserData); // Debug log
    };

    const persistUserData = () => {
        localStorage.setItem('userData', JSON.stringify(userData.value));
        console.log('User data persisted:', userData.value); // Debug log
    };

    const loadUserData = () => {
        let tempUserData = localStorage.getItem('userData');
        tempUserData = JSON.parse(tempUserData);
        if (tempUserData === null || tempUserData === undefined) {
            console.log('No user data found in localStorage'); // Debug log
            return;
        }
        userData.value = tempUserData;
        console.log('User data loaded:', tempUserData); // Debug log
    };

    const clearUserData = () => {
        localStorage.setItem('userData', JSON.stringify(null));
        userData.value = null;
        console.log('User data cleared'); // Debug log
    };

    const isAuthenticated = computed(() => {
        const isAuth = checkJWT(userData.value?.accessToken);
        console.log('Authentication status:', isAuth); // Debug log
        return isAuth;
    });

    // Add a getter for the token
    const token = computed(() => userData.value?.accessToken);

    return {
        userData,
        setUserData,
        persistUserData,
        loadUserData,
        clearUserData,
        isAuthenticated,
        token
    };
});