<template>
    <div class="error" v-if="error">{{ error }}</div>
    <div class="playlist-details" v-if="playlist">
        <div class="playlist-info">
            <div class="cover">
                <img :src="playlist.coverUrl" alt="cover image of playlist">
            </div>
            <h2>{{ playlist.title }}</h2>
            <p class="username">Created by {{ playlist.userName }}</p>
            <p class="description">{{ playlist.description }}</p>
            <button v-if="ownership" @click="handleDelete">Delete Playlist</button>
        </div>
        <div class="song-list">
            <div v-if="!playlist.songs.length > 0">No songs have been added to the playlist yet</div>
            <div class="single-song" v-for="song in playlist.songs" :key="song.id">
                <div class="details">
                    <h3>{{ song.title }}</h3>
                    <p>{{ song.artist }}</p>
                </div>
                <button v-if="ownership" @click="handleClick(song.id)">Delete</button>
            </div>
            <add-song v-if="ownership" :playlist="playlist" />
        </div>
    </div>
</template>

<script>
import getDocument from '@/helpers/getDocument';
import useDocument from '@/helpers/useDocument';
import useStorage from '@/helpers/useStorage';
import getUser from '@/helpers/getUser';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AddSong from '@/components/AddSong.vue';
export default {
    props: ['id'],
    components: { AddSong },
    setup(props) {
        const { error, document: playlist } = getDocument('playlists', props.id)
        const { user } = getUser();
        const { deleteDoc, updateDoc } = useDocument('playlists', props.id)
        const { deleteImage } = useStorage();

        const router = useRouter()

        const ownership = computed(() => {
            return playlist.value && user.value && user.value.uid == playlist.value.userId;
        })

        const handleDelete = async () => {
            await deleteImage(playlist.value.filePath)
            await deleteDoc();
            router.push({ name: 'Home' })
        }

        const handleClick = async (id) => {
            const songsAfterDeleted = playlist.value.songs.filter(s => s.id != id)
            await updateDoc({ songs: songsAfterDeleted })
        }

        return { error, playlist, ownership, handleDelete, handleClick }
    }
}
</script>

<style>
.playlist-details {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px;
}

.cover {
    overflow: hidden;
    border-radius: 20px;
    position: relative;
    padding: 160px;
}

.cover img {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    min-width: 100%;
    min-height: 100%;
    max-width: 200%;
    max-height: 200%;
}

.playlist-info {
    text-align: center;
}

.playlist-info h2 {
    text-transform: capitalize;
    font-size: 28px;
    margin-top: 20px;
}

.playlist-info p {
    margin-bottom: 20px;
}

.username {
    color: #999;
}

.description {
    text-align: left;
}

.single-song {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed var(--secondary);
    margin-bottom: 20px;
}
</style>