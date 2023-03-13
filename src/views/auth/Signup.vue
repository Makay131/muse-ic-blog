<template>
    <form @submit.prevent="handleSubmit">
        <h3>Signup</h3>
        <input type="text" placeholder="Display Name" v-model="displayName">
        <input type="email" placeholder="Email" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
        <div v-if="error" class="error">{{ error }}</div>
        <button v-if="!isPending">Signup</button>
        <button v-else disabled>Loading</button>
    </form>
</template>

<script>
import useSignup from '@/helpers/useSignup'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    setup() {

        const { error, isPending, signup } = useSignup()

        const router = useRouter();

        const email = ref('');
        const password = ref('');
        const displayName = ref('');

        const handleSubmit = async () => {
            const res = await signup(email.value, password.value, displayName.value)
            if (!error.value) router.push({ name: 'Home' })
        }

        return { email, password, displayName, isPending, error, handleSubmit }
    }
}
</script>

<style></style>