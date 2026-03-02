// PWA Service Worker 註冊
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker 註冊成功'))
            .catch(err => console.log('Service Worker 註冊失敗', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const startTimeInput = document.getElementById('startTime');
    const hasBreakCheckbox = document.getElementById('hasBreak');
    const resultTime = document.getElementById('resultTime');
    const resultDetail = document.getElementById('resultDetail');
    const buttons = document.querySelectorAll('.calc-btn');

    let currentBase = null;

    // 設定初始時間為當前時間
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    startTimeInput.value = `${hours}:${minutes}`;

    function calculate() {
        if (currentBase === null) return;

        const [h, m] = startTimeInput.value.split(':').map(Number);
        const hasBreak = hasBreakCheckbox.checked;
        
        // 計算總分鐘數
        // 基礎時間 (含休息): 3400:95, 6600:125, 11000:155, 21500:185
        // 如果沒有休息，則減去 5 分鐘
        let totalMinutesToAdd = currentBase;
        if (!hasBreak) {
            totalMinutesToAdd -= 5;
        }

        const date = new Date();
        date.setHours(h);
        date.setMinutes(m + totalMinutesToAdd);

        const resH = String(date.getHours()).padStart(2, '0');
        const resM = String(date.getMinutes()).padStart(2, '0');

        // 更新 UI
        resultTime.textContent = `${resH}:${resM}`;
        
        const gameType = getGameType(currentBase);
        resultDetail.textContent = `${gameType} 比賽 (${totalMinutesToAdd} 分鐘後)`;
        
        // 震動回饋 (如果手機支援)
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }

    function getGameType(base) {
        switch(parseInt(base)) {
            case 95: return '3400';
            case 125: return '6600';
            case 155: return '11000';
            case 185: return '21500';
            default: return '';
        }
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他按鈕的 active 狀態
            buttons.forEach(b => b.classList.remove('active'));
            // 設定當前按鈕為 active
            btn.classList.add('active');
            
            currentBase = parseInt(btn.dataset.base);
            calculate();
        });
    });

    // 當時間或開關變動時自動重算
    startTimeInput.addEventListener('change', calculate);
    hasBreakCheckbox.addEventListener('change', calculate);
});
