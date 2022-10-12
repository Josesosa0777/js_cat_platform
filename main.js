let querystring = [
    '?',
    'limit=3',
    // '&order=Desc',
    '&api_key=c08d415f-dea7-4a38-bb28-7b2188202e46'
].join('');

const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/'
})
api.defaults.headers.common['X-API-KEY'] = 'c08d415f-dea7-4a38-bb28-7b2188202e46'

const API_URL_RANDOM = `https://api.thecatapi.com/v1/images/search${querystring}`;
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error')

async function loadRandomMichis() {
    const res = await fetch(API_URL_RANDOM);
    const data = await res.json()
    console.log("Random")
    console.log(data)

    if (res.status !== 200) {
        spanError.innerHTML = "There is an Error " + res.status;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');

        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
        btn1.onclick = () => saveFavoriteCat(data[0].id); // al dar click se ejecuta la funcion saveFavoriteCat
        btn2.onclick = () => saveFavoriteCat(data[1].id);
        btn3.onclick = () => saveFavoriteCat(data[2].id);
    }
}

async function loadFavoriteMichis() {
    const res = await fetch(API_URL_FAVORITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46'
        }
    });
    if (res.status !== 200) {
        spanError.innerHTML = "There is an Error: " + res.status;
    } else {
        const data = await res.json()
        console.log('Favorites')
        console.log(data)
        // Si se recarga la funcion, al guardar o eliminar un elemento, quiero que se limpie y se muestre lo actualizado, para ello hay que limpiar la sección:
        const section = document.getElementById('favoriteCats');
        section.innerHTML = ""
        // Luego de limpiar la seccion, hay que ponerle lo que se quiere que tenga como el titulo h2:
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorite Cats');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        data.forEach(cat => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Get out cat from Favorites');

            img.src = cat.image.url; // a la img agregar la url de la imagen
            img.width = 250; 
            btn.appendChild(btnText); // al botón, agregar el btnText
            btn.onclick = () => deleteFavoriteCat(cat.id);
            // meter el btn y el img dentro del article:
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
        });
    }
}

async function saveFavoriteCat(id) {
    const { data, status} = await api.post('/favourites', {
        image_id: id
    });
    if (status !== 200) {
        spanError.innerHTML = "There is an Error: " + status;
    } else {
        console.log("Cat saved in favorites")
        loadFavoriteMichis();
    }
}

async function deleteFavoriteCat(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46'
        }
    });
    if (res.status !== 200) {
        spanError.innerHTML = "There is an Error: " + res.status;
    } else {
        console.log("Cat deleted from favorites")
        loadFavoriteMichis();
    }
    const data = await res.json()
    console.log("save", res)
}

async function uploadCatPhoto() {
    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form);
    console.log(formData.get('file'))
    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'X-API-KEY': 'c08d415f-dea7-4a38-bb28-7b2188202e46',
            // 'Content-Type': 'multipart/form-data'
        },
        body: formData,
    })
    if (res.status !== 201) {
        spanError.innerHTML = `An error happened when trying to upload the photo. Error: ${res.status}`;
    } else {
        const data = await res.json()
        console.log("Photo uploaded")
        console.log({ data })
        saveFavoriteCat(data.id) 
    }
}

loadRandomMichis();
loadFavoriteMichis();
// saveFavoriteCat();
