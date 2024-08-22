document.addEventListener('DOMContentLoaded', () => {
    const tapProgress = document.getElementById('tap-progress');
    const tapCount = document.getElementById('tap-count');
    const toshiCounter = document.getElementById('toshi-counter');
    const coin = document.getElementById('coin');
    const joinGroupBtn = document.getElementById('join-group');
    const joinChannelBtn = document.getElementById('join-channel');
    
    let taps = 0;
    let toshi = 0;

    coin.addEventListener('click', () => {
        if (taps < 100) {
            taps++;
            toshi++;
            tapProgress.value = taps;
            tapCount.textContent = `${taps}/100 TOSHI`;
            updateToshiCounter();
        } else {
            alert('You have reached your daily limit of 100 TOSHI. Come back tomorrow!');
        }
    });

    function updateToshiCounter() {
        toshiCounter.textContent = `${toshi} TOSHI`;
    }

    window.completeTask = (task) => {
        if (task === 'group') {
            toshi += 300;
            joinGroupBtn.disabled = true;
            joinGroupBtn.textContent = 'Group Joined (300 TOSHI)';
        } else if (task === 'channel') {
            toshi += 500;
            joinChannelBtn.disabled = true;
            joinChannelBtn.textContent = 'Channel Joined (500 TOSHI)';
        }
        updateToshiCounter();
    }

    // Reset tap count every 24 hours (pseudo code)
    // setInterval(() => {
    //     taps = 0;
    //     tapProgress.value = taps;
    //     tapCount.textContent = `${taps}/100 TOSHI`;
    // }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
});
