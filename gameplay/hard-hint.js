let hintTrials = localStorage.getItem('hintTrials') === null ? 1 : parseInt(localStorage.getItem('hintTrials'));
let revealedIndices = JSON.parse(localStorage.getItem('activeRevealedIndices')) || []; 

const hintDisplay = document.querySelector('.guess p');
const hintBtn = document.querySelector('.hint'); 
const hintSpan = document.querySelector('.hint span'); 

const updateHintDisplay = () => {
    if (!currentSong) return;
    const songName = currentSong.name;
    
    const displayArray = songName.split('').map((char, index) => {
        if (char === ' ') return '&nbsp;';
        if (/[^a-zA-Z0-9]/.test(char)) return char; 
        return revealedIndices.includes(index) ? char : "_";
    });

    if (hintDisplay) hintDisplay.innerHTML = `Hint: ${displayArray.join(' ')}`;
    if (hintSpan) hintSpan.innerText = hintTrials;

    localStorage.setItem('activeRevealedIndices', JSON.stringify(revealedIndices));
};

if (revealedIndices.length === 0 && currentSong) {
    let songName = currentSong.name;
    let count = songName.length > 10 ? 4 : (songName.length > 6 ? 2 : 1);
    let valid = [];
    for(let i=0; i<songName.length; i++) if(/[a-zA-Z0-9]/.test(songName[i])) valid.push(i);
    
    while(revealedIndices.length < count && valid.length > 0) {
        let rand = Math.floor(Math.random() * valid.length);
        revealedIndices.push(valid.splice(rand, 1)[0]);
    }
}
updateHintDisplay();

if (hintBtn) {
    hintBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (hintTrials > 0 && currentSong) {
            let songName = currentSong.name;
            let hidden = [];
            for(let i=0; i<songName.length; i++) {
                if(/[a-zA-Z0-9]/.test(songName[i]) && !revealedIndices.includes(i)) hidden.push(i);
            }
            if (hidden.length > 0) {
                revealedIndices.push(hidden[Math.floor(Math.random() * hidden.length)]);
                hintTrials--;
                localStorage.setItem('hintTrials', hintTrials);
                updateHintDisplay();
            }
        }
    });
}