// Canciones (ajusta los nombres de archivos y portadas según tus archivos)
const songs = [
    {
        title: "Lo mismo de siempre",
        artist: "Mora",
        src: "Lo mismo de siempre.mp3",
        cover: "Mora.png"
    },
    {
        title: "Una vez",
        artist: "Bad Bunny (ft. Mora)",
        src: "Una vez.mp3",
        cover: "Una vez.png"
    },
    {
        title: "Detras de tu alma",
        artist: "Mora",
        src: "Detras de tu alma.mp3",
        cover: "Mora.png"
    },
    {
        title: "Donde se aprende a querer?",
        artist: "Mora",
        src: "Donde se aprende a querer.mp3",
        cover: "Estrella.png"
    }
];

const backgrounds = [
    // 1. Beige oscuro degradado desde abajo
    "linear-gradient(to top, #181818 0 30%, #be820aff 100%)",
    // 2. Azul oscuro degradado desde abajo
    "linear-gradient(to top, #181818 0 35%, #0c007cff 100%)",
    // 3. Rojo oscuro/beige oscuro degradado desde abajo
    "linear-gradient(to top, #181818 0 35%, #9e6965ff 60%, #860000ff 100%)",
    // 4. Azul muy oscuro con toques gris claro
    "linear-gradient(to top, #181818 0 35%, #3d0a77ff 100%)"
];

let current = 0;
const audio = document.getElementById('audio');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current');
const duration = document.getElementById('duration');

function loadSong(i) {
    const song = songs[i];
    title.textContent = song.title;
    artist.textContent = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    setTimeout(() => {
        duration.textContent = formatTime(audio.duration);
    }, 300);

    // Cambia el fondo según la canción
    document.body.style.background = backgrounds[i];

    // Actualiza portadas laterales DENTRO del reproductor (si tienes)
    const prevCover = document.getElementById('prev-cover');
    const nextCover = document.getElementById('next-cover');
    if (prevCover && nextCover) {
        prevCover.src = songs[(i - 1 + songs.length) % songs.length].cover;
        nextCover.src = songs[(i + 1) % songs.length].cover;
    }

    // Actualiza portadas laterales FUERA del reproductor
    document.getElementById('prev-cover-bg').src = songs[(i - 1 + songs.length) % songs.length].cover;
    document.getElementById('next-cover-bg').src = songs[(i + 1) % songs.length].cover;
}
function playSong() {
    audio.play();
    playBtn.innerHTML = "&#10073;&#10073;"; // Pause icon
}
function pauseSong() {
    audio.pause();
    playBtn.innerHTML = "&#9654;"; // Play icon
}
playBtn.onclick = () => {
    if (audio.paused) playSong();
    else pauseSong();
};
prevBtn.onclick = () => {
    current = (current - 1 + songs.length) % songs.length;
    loadSong(current);
    playSong();
};
nextBtn.onclick = () => {
    current = (current + 1) % songs.length;
    loadSong(current);
    playSong();
};
audio.ontimeupdate = () => {
    progress.value = audio.currentTime / audio.duration * 100 || 0;
    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
};
progress.oninput = () => {
    audio.currentTime = progress.value / 100 * audio.duration;
};
audio.onended = () => {
    nextBtn.onclick();
};
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}
function getDominantColor(img, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    img.crossOrigin = "Anonymous";
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        callback([r, g, b]);
    };
    if (img.complete) img.onload();
}

// En tu función loadSong, llama a getDominantColor como te mostré antes
loadSong(current);