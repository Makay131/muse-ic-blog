import { ref, watchEffect } from 'vue'
import { projectFirestore } from '../firebase/config'

const getDocuments = (collection, id) => {

  const document = ref(null)
  const error = ref(null)

  // register the document ref in the collection
  let documentRef = projectFirestore.collection(collection).doc(id);

  const unsub = documentRef.onSnapshot(doc => {
    if(doc.data()) {
        document.value = {...doc.data(), id: doc.id }
        error.value = null
    } else error.value = 'The document does not exist!'
    
  }, err => {
    console.log(err.message)
    error.value = 'could not fetch the document'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document }
}

export default getDocuments