import { projectStorage } from "@/firebase/config";
import { ref } from "vue";
import getUser from "./getUser";

const { user } = getUser();

const useStorage = () => {
    const error = ref(null);
    const url = ref(null);
    const filePath = ref(null);

    const uploadImage = async (file) => {
        filePath.value = `covers/${user.value.uid}/${file.name}`; //to which path to be uploaded
        const storageRef = projectStorage.ref(filePath.value); //need as a 2nd step

        try {
            const res = await storageRef.put(file) // this uploads
            url.value = await res.ref.getDownloadURL();
        } catch(err) {
            console.log(err.message);
            error.value = err.message;
        }
    }

    const deleteImage = async (path) => {
        const storageRef = projectStorage.ref(path);
        try {
            await storageRef.delete();
        } catch(err) {
            console.log(err.message)
            error.value = err.message;
        }
    }

    return { error, url, filePath, uploadImage, deleteImage }
}

export default useStorage;