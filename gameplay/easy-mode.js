const gameMode = "easy";

let combinedPool = [];
if (typeof easyGlobalSongs !== 'undefined') combinedPool = [...combinedPool, ...easyGlobalSongs];
if (typeof easyLocalSongs !== 'undefined') combinedPool = [...combinedPool, ...easyLocalSongs];

let currentSong;
const activeSongName = localStorage.getItem('activeSessionSong');

if (activeSongName) {
    currentSong = combinedPool.find(s => s.name === activeSongName);
}

if (!currentSong) {
    let playedSongs = JSON.parse(localStorage.getItem('playedSongs')) || [];
    let availableSongs = combinedPool.filter(song => !playedSongs.includes(song.name));

    if (availableSongs.length === 0) {
        playedSongs = [];
        availableSongs = [...combinedPool];
    }

    const randomIndex = Math.floor(Math.random() * availableSongs.length);
    currentSong = availableSongs[randomIndex];

    playedSongs.push(currentSong.name);
    localStorage.setItem('playedSongs', JSON.stringify(playedSongs));
    localStorage.setItem('activeSessionSong', currentSong.name);
}

const timerDisplay = document.querySelector('.timer span');
let timeLeft;

const startTimer = () => {

    timeLeft = 20; 
    localStorage.setItem('activeTimer', timeLeft);
    
    if (timerDisplay) {
        timerDisplay.innerText = timeLeft;
    }

    const timerInterval = setInterval(() => {
        timeLeft--;

        localStorage.setItem('activeTimer', timeLeft);
        
        if (timerDisplay) timerDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);

            if (currentSong) {
                localStorage.setItem('correctAnswer', currentSong.name);
                localStorage.setItem('lastAlbum', currentSong.label.replace('../', '')); 
            }

            localStorage.setItem('isLastCorrect', "false");
            localStorage.setItem('pointsGained', 0); 
            localStorage.setItem(`${gameMode}_currentStreak`, 0);

            localStorage.removeItem('activeTimer');
            localStorage.removeItem('activeSessionSong');
            localStorage.removeItem('activeRevealedIndices'); 

            window.location.href = "easy-times-up.html";
        }
    }, 1000);
};

const music = document.querySelector('#audio');
const labelImg = document.querySelector('.label');
const playBtn = document.querySelector('.play-btn');
const diskImages = document.querySelectorAll('.disk, .bg-disk');
const slider = document.querySelector('.slider');

const setMusic = () => {
    if (!currentSong) return;

    music.src = currentSong.path;
    labelImg.src = currentSong.label;
    
    console.log("Loading Audio:", music.src);
    music.load();
};

music.addEventListener('timeupdate', () => {
    if (music.duration) {
        const progress = (music.currentTime / music.duration) * 100;
        slider.value = progress;
    }
});

music.addEventListener('ended', () => {
    slider.value = 0;
    playBtn.classList.add('pause');
    diskImages.forEach(d => d.classList.remove('play'));
});

playBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play().then(() => {
            playBtn.classList.remove('pause');
            diskImages.forEach(d => d.classList.add('play'));
        });
    } else {
        music.pause();
        playBtn.classList.add('pause');
        diskImages.forEach(d => d.classList.remove('play'));
    }
});

setMusic();
startTimer();