document.addEventListener('DOMContentLoaded', () => {
    const tapProgress = document.getElementById('tap-progress');
    const tapCount = document.getElementById('tap-count');
    const toshiCounter = document.getElementById('toshi-counter');
    const coin = document.getElementById('coin');
    const joinGroupBtn = document.getElementById('join-group');
    const joinChannelBtn = document.getElementById('join-channel');
    
    let toshi = 0;
    const maxToshi = 5000;

    coin.addEventListener('click', () => {
        if (toshi < maxToshi) {
            toshi++;
            tapProgress.value = toshi;
            tapCount.textContent = `${toshi}/${maxToshi} TOSHI`;
            updateToshiCounter();
        } else {
            alert('You have reached the maximum of 5000 TOSHI.');
        }
    });

    function updateToshiCounter() {
        toshiCounter.textContent = `${toshi} TOSHI`;
    }

    window.completeTask = (task) => {
        if (task === 'group' && !joinGroupBtn.disabled) {
            if (toshi + 300 <= maxToshi) {
                toshi += 300;
                joinGroupBtn.disabled = true;
                joinGroupBtn.textContent = 'Group Joined (300 TOSHI)';
            } else {
                alert('Completing this task would exceed the 5000 TOSHI limit.');
            }
        } else if (task === 'channel' && !joinChannelBtn.disabled) {
            if (toshi + 500 <= maxToshi) {
                toshi += 500;
                joinChannelBtn.disabled = true;
                joinChannelBtn.textContent = 'Channel Joined (500 TOSHI)';
            } else {
                alert('Completing this task would exceed the 5000 TOSHI limit.');
            }
        }
        updateToshiCounter();
        tapProgress.value = toshi;
        tapCount.textContent = `${toshi}/${maxToshi} TOSHI`;
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
});
