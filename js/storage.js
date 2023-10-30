const STORAGE_TOKEN = 'YDITW3FZPTKXOANID4RLEPARCUN9OMMKIJBM9WO8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let users = [];

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}

//Activ user
/**
 * Saves the current active user to local storage.
 */
function saveActivUser() {
    localStorage.setItem('activUserAsText', JSON.stringify(activUser));
}

/**
 * Loads the current active user from local storage.
 */
function loadActivUser() {
    let activUserLoad = localStorage.getItem('activUserAsText');
    if (activUserLoad) {
        activUser = JSON.parse(activUserLoad);
    }
}

