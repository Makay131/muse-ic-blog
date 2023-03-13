<template>
    <form @submit.prevent="handleSubmit">
        <h4>Create New Playlist</h4>
        <input type="text" required placeholder="Playlist Title" v-model="title">
        <textarea type="text" required placeholder="Playlist Description..." v-model="description"></textarea>
        <label>Upload Playlist Cover Image</label>
        <input type="file" @change="handleChange">
        <div class="error">{{ fileError }}</div>
        <div class="error"></div>
        <button v-if="!isPending">Create</button>
        <button v-else disabled>Saving...</button>
    </form>
</template>

<script>
import { ref } from 'vue'
import useStorage from '@/helpers/useStorage'
import useCollection from '@/helpers/useCollection'
import getUser from '@/helpers/getUser'
import { timestamp } from '@/firebase/config'
import { useRouter } from 'vue-router'
export default {
    setup() {

        const { filePath, url, uploadImage } = useStorage();
        const { error, addDoc } = useCollection('playlists');
        const { user } = getUser()

        const title = ref('');
        const description = ref('');
        const file = ref(null);
        const fileError = ref(null);
        const isPending = ref(false)

        const router = useRouter();

        const handleSubmit = async () => {
            if (file.value) {
                isPending.value = true;
                await uploadImage(file.value)
                const res = await addDoc({
                    title: title.value,
                    description: description.value,
                    userId: user.value.uid,
                    userName: user.value.displayName,
                    coverUrl: url.value,
                    filePath: filePath.value,
                    songs: [],
                    createdAt: timestamp(),
                })
                isPending.value = false;
                if (!error.value) {
                    router.push({ name: 'PlaylistDetails', params: { id: res.id } })
                }
            }
        }
        //allowed file types
        const types = ['image/png', 'image/jpeg', 'image/jpg'];

        const handleChange = (e) => {
            const selected = e.target.files[0];

            if (selected && types.includes(selected.type)) {
                file.value = selected;
                fileError.value = null;
            }
            else {
                file.value = null;
                fileError.value = 'Please select an image file (png, jpg or jpeg)'
            }
        }

        return { title, description, handleSubmit, handleChange, fileError, isPending }
    }
}
</script>

<style>
input[type="file"] {
    border: 0;
    padding: 0;
}

label {
    font-size: 12px;
    display: block;
    margin-top: 30px;
}

button {
    margin-top: 20px;
}
</style>