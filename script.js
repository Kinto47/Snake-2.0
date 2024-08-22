document.addEventListener('DOMContentLoaded', () => {
    const tapProgress = document.getElementById('tap-progress');
    const tapCount = document.getElementById('tap-count');
    const toshiCounter = document.getElementById('toshi-counter');
    const coin = document.getElementById('coin');
    const joinGroupBtn = document.getElementById('join-group');
    const joinChannelBtn = document.getElementById('join-channel');
    
    let taps = 100; // Inizia con la barra piena
    let toshi = 100;

    coin.addEventListener('click', () => {
        if (taps > 0) {
            taps--;
            toshi++;
            tapProgress.value = taps;
            tapCount.textContent = `${100 - taps}/100 TOSHI`;
            updateToshiCounter();
        } else {
            alert('You have reached your daily limit of 100 TOSHI. Come back tomorrow!');
        }
    });

    function updateToshiCounter() {
        toshiCounter.textContent = `${toshi} TOSHI`;
    }

    window.completeTask = (task) => {
        if (task === 'group' && !joinGroupBtn.disabled) {
            toshi += 300;
            joinGroupBtn.disabled = true;
            joinGroupBtn.textContent = 'Group Joined (300 TOSHI)';
        } else if (task === 'channel' && !joinChannelBtn.disabled) {
            toshi += 500;
            joinChannelBtn.disabled = true;
            joinChannelBtn.textContent = 'Channel Joined (500 TOSHI)';
        }
        updateToshiCounter();
    }

    window.showSection = (section) => {
        const playSection = document.getElementById('play-section');
        const taskSection = document.getElementById('task-section');
        if (section === 'play') {
            playSection.classList.add('active');
            taskSection.classList.remove('active');
        } else if (section === 'task') {
            taskSection.classList.add('active');
            playSection.classList.remove('active');
        }
    }

    // Reset tap count every 24 hours (pseudo code)
    // setInterval(() => {
    //     taps = 100;
    //     tapProgress.value = taps;
    //     tapCount.textContent = `${100 - taps}/100 TOSHI`;
    // }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
});
