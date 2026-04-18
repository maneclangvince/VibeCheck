const submitBtn = document.querySelector('.submit');
const answerInput = document.querySelector('#ans');

const updateSubmitButtonState = () => {
    if (answerInput.value.trim() === "") {
        submitBtn.classList.add('disabled');
    } else {
        submitBtn.classList.remove('disabled');
    }
};
answerInput.addEventListener('input', updateSubmitButtonState);
updateSubmitButtonState(); 

submitBtn.addEventListener('click', (e) => {
    if (answerInput.value.trim() === "") {
        e.preventDefault();
        return; 
    }
});

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentSong) return;

    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentSong.name.toLowerCase().trim();
    const gameMode = "easy";
    
    let totalScore = parseInt(localStorage.getItem(`${gameMode}_totalScore`)) || 0;
    let currentStreak = parseInt(localStorage.getItem(`${gameMode}_currentStreak`)) || 0;

    let pointsGained = 0; 

    localStorage.removeItem('activeSessionSong');
    localStorage.removeItem('activeTimer');
    localStorage.removeItem('activeRevealedIndices');

    if (userAnswer === correctAnswer) {
        const newStreak = currentStreak + 1;

        pointsGained = 100 + (timeLeft > 15 ? 50 : 0) + (newStreak * 20);

        localStorage.setItem(`${gameMode}_totalScore`, totalScore + pointsGained);
        localStorage.setItem(`${gameMode}_currentStreak`, newStreak);

        let sessionPeak = parseInt(localStorage.getItem(`${gameMode}_peakStreak`)) || 0;
        if (newStreak > sessionPeak) {
            localStorage.setItem(`${gameMode}_peakStreak`, newStreak);
        }

        localStorage.setItem('isLastCorrect', "true");
    } else {
        pointsGained = 0; 
        currentStreak = 0;
        localStorage.setItem(`${gameMode}_currentStreak`, 0);
        localStorage.setItem('isLastCorrect', "false");
        localStorage.setItem('pointsGained', 0); 
    }

    localStorage.setItem('pointsGained', pointsGained); 
    localStorage.setItem('correctAnswer', currentSong.name);
    localStorage.setItem('lastAlbum', currentSong.label.replace('../', ''));
    
    window.location.href = "easy-answer.html";
});

history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);