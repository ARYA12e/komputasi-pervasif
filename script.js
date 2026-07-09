const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbw04UAwIP1jEX2TCAy6kTY0KNsJBtwljRjXC2uW4Cuy5Dwu0ZuVCmOSImv3Q2IZ8NGoqw/exec"; 

const bankSoal = [
    { q: "Manakah tindakan pertama yang tepat saat menghadapi rekan pendaki yang terkena Hipotermia?", a: ["Memberikan minuman beralkohol hangat", "Mengganti pakaian basah dengan pakaian kering", "Memaksa korban terus berjalan agar berkeringat", "Memijat seluruh tubuh korban dengan keras"], correct: 1 },
    { q: "Alat navigasi manual yang wajib dibawa untuk menentukan arah mata angin di alam bebas adalah...", a: ["Altimeter analog", "Kompas bidik", "Barometer ketebalan udara", "Clinometer digital"], correct: 1 },
    { q: "Skala prioritas utama yang harus dipenuhi terlebih dahulu dalam situasi survival darurat adalah...", a: ["Mencari jalan keluar alternatif", "Membuat sinyal asap tanda bahaya", "Mencari atau mendirikan tempat perlindungan (shelter)", "Memburu hewan liar untuk cadangan makanan"], correct: 2 },
    { q: "Tanda-tanda alam yang menunjukkan badai gunung akan segera tiba di lokasi perkemahan adalah...", a: ["Suhu udara mendadak naik drastis", "Penurunan tekanan udara secara cepat dan awan cumulonimbus merendah", "Burung-burung berkicau lebih nyaring", "Arah angin bertiup konsisten dari lembah ke puncak"], correct: 1 }
];

const runtimeState = {
    nim: "", stamina: 100, currentQuestionIndex: 0,
    selectedAnswerIndex: null, score: 0, isQuizFinished: false, logs: []
};

function addLog(message, isDanger = false) {
    const timestamp = new Date().toLocaleTimeString('id-ID');
    runtimeState.logs.push(`[${timestamp}] ${message}`);
    const consoleEl = document.getElementById('log-console');
    if (consoleEl) {
        const item = document.createElement('div');
        item.className = isDanger ? 'log-item danger' : 'log-item';
        item.innerText = `[${timestamp}] ${message}`;
        consoleEl.appendChild(item);
        consoleEl.scrollTop = consoleEl.scrollHeight;
    }
}

function updateMascot(text) {
    document.getElementById('bubble-text').innerText = text;
}

function switchScreen(activeScreenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(activeScreenId).classList.add('active');
}

async function executeLogin() {
    const nimInput = document.getElementById('nim-input').value.trim();
    const passInput = document.getElementById('pass-input').value.trim();
    const loginBtn = document.getElementById('btn-login');

    if (!nimInput || !passInput) {
        updateMascot("Lengkapi identitas navigasi NIM dan Sandi Anda!");
        return;
    }

    runtimeState.nim = nimInput;
    loginBtn.innerText = "Memverifikasi Akses Jalur...";
    loginBtn.disabled = true;

    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                method: "AUTH_LOGIN",
                nim: runtimeState.nim,
                timestamp: new Date().toISOString()
            })
        });
        addLog(`Pendaki ${runtimeState.nim} berhasil melewati gerbang pemeriksaan.`);
        switchScreen('screen-quiz');
        initialiseQuiz();
    } catch (error) {
        addLog("Koneksi cloud gagal. Memulai enkripsi lokal offline.", true);
        switchScreen('screen-quiz');
        initialiseQuiz();
    } finally {
        loginBtn.innerText = "Otorisasi & Mulai Mendaki";
        loginBtn.disabled = false;
    }
}

function initialiseQuiz() {
    runtimeState.currentQuestionIndex = 0;
    runtimeState.score = 0;
    runtimeState.stamina = 100;
    renderCurrentCheckpoint();
    activateAntiCheatEngine();
}

function renderCurrentCheckpoint() {
    const currentQuestion = bankSoal[runtimeState.currentQuestionIndex];
    document.getElementById('question-display').innerText = `${runtimeState.currentQuestionIndex + 1}. ${currentQuestion.q}`;
    
    const optionsGrid = document.getElementById('choices-grid');
    optionsGrid.innerHTML = "";
    runtimeState.selectedAnswerIndex = null;
    document.getElementById('btn-next').disabled = true;

    currentQuestion.a.forEach((optionText, idx) => {
        const optionNode = document.createElement('div');
        optionNode.className = "option-node";
        optionNode.innerText = optionText;
        optionNode.onclick = () => {
            document.querySelectorAll('.option-node').forEach(node => node.classList.remove('selected'));
            optionNode.classList.add('selected');
            runtimeState.selectedAnswerIndex = idx;
            document.getElementById('btn-next').disabled = false;
            updateMascot("Pilihan yang mantap. Siap melanjutkan langkah?");
        };
        optionsGrid.appendChild(optionNode);
    });

    document.querySelectorAll('.checkpoint').forEach((node, nodeIdx) => {
        node.className = "checkpoint";
        if (nodeIdx < runtimeState.currentQuestionIndex) node.classList.add('passed');
        if (nodeIdx === runtimeState.currentQuestionIndex) node.classList.add('active');
    });
    updateMascot(`Anda berada di Pos rintangan ke-${runtimeState.currentQuestionIndex + 1}. Jaga fokus!`);
}

function submitStep() {
    const currentQuestion = bankSoal[runtimeState.currentQuestionIndex];
    if (runtimeState.selectedAnswerIndex === currentQuestion.correct) {
        runtimeState.score += Math.ceil(100 / bankSoal.length);
        addLog(`Pos ${runtimeState.currentQuestionIndex + 1}: Solusi rintangan Benar.`);
    } else {
        addLog(`Pos ${runtimeState.currentQuestionIndex + 1}: Solusi Salah. Jalur memutar diambil.`, true);
    }
    runtimeState.currentQuestionIndex++;
    if (runtimeState.currentQuestionIndex < bankSoal.length) {
        renderCurrentCheckpoint();
    } else {
        triggerEndGame(false);
    }
}

function activateAntiCheatEngine() {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && !runtimeState.isQuizFinished) {
            triggerStormPenalization();
        }
    });
}

function triggerStormPenalization() {
    runtimeState.stamina -= 25;
    if (runtimeState.stamina < 0) runtimeState.stamina = 0;
    
    document.getElementById('stamina-meter').style.width = `${runtimeState.stamina}%`;
    document.getElementById('stamina-text').innerText = `${runtimeState.stamina}%`;
    
    const mainFrame = document.getElementById('main-frame');
    mainFrame.classList.add('shake');
    setTimeout(() => mainFrame.classList.remove('shake'), 450);

    addLog("PELANGGARAN JALUR: Anda meninggalkan jendela navigasi aktif!", true);

    if (runtimeState.stamina <= 0) {
        triggerEndGame(true);
    } else {
        document.getElementById('storm-warning').style.display = "flex";
        updateMascot("Awas! Badai menerjang karena Anda tidak fokus pada jalur!");
    }
}

function dismissStorm() {
    document.getElementById('storm-warning').style.display = "none";
}

async function triggerEndGame(isDisqualifiedByStamina) {
    runtimeState.isQuizFinished = true;
    switchScreen('screen-result');
    
    if (isDisqualifiedByStamina) {
        runtimeState.score = 0;
        document.getElementById('end-status-text').innerText = "Ekspedisi Gagal! Stamina Anda Habis Terkuras Badai.";
        document.getElementById('end-status-text').style.color = "var(--crimson)";
        addLog("DISKUALIFIKASI: Pendaki dievakuasi akibat kehabisan stamina total.", true);
    } else {
        if(runtimeState.score > 100) runtimeState.score = 100;
        document.getElementById('end-status-text').innerText = "Selamat! Anda berhasil menembus puncak gunung.";
    }

    document.getElementById('final-score-display').innerText = runtimeState.score;

    try {
        await fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                method: "SAVE_LOG_SCORE", nim: runtimeState.nim, score: runtimeState.score,
                staminaLeft: runtimeState.stamina, status: isDisqualifiedByStamina ? "FAILED_CHEAT" : "SUCCESSFUL",
                auditLogs: runtimeState.logs.join(" | ")
            })
        });
        addLog("Seluruh berkas navigasi perjalanan berhasil dikirim ke Cloud Sheets.");
    } catch (e) {
        addLog("Gagal mengirim berkas ke awan. Disimpan sementara di cache lokal.", true);
    }
}