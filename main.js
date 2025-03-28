let currentAudio = null;
let currentSurahData = null;

// Sura yuklash
async function loadSura() {
    const suraNumber = document.getElementById('inputElement').value;
    if (!suraNumber || suraNumber < 1 || suraNumber > 114) {
        alert("Noto'g'ri sura raqami! (1-114)");
        return;
    }

    try {
        const response = await fetch(`https://api.alquran.cloud/v1/surah/${suraNumber}/editions/uz.sodik,ar.alafasy`);
        const data = await response.json();
        
        currentSurahData = {
            name: data.data[1].name,
            ayahs: data.data[1].ayahs,
            translations: data.data[0].ayahs
        };

        document.getElementById('surahName').textContent = currentSurahData.name;
        renderVerses();
        
    } catch (error) {
        alert("Sura yuklanmadi!");
    }
}

// Oyatlarni chiqarish
function renderVerses() {
    const listElement = document.getElementById('list');
    listElement.innerHTML = '';

    currentSurahData.ayahs.forEach((arabicAyah, index) => {
        const listItem = document.createElement('li');
        listItem.id = `ayah-${arabicAyah.numberInSurah}`;
        listItem.className = 'verse-item';
        listItem.innerHTML = `
            <div class="verse-content">
                <span class="verse-number">${arabicAyah.numberInSurah}.</span>
                <div class="arabic-text" dir="rtl">${arabicAyah.text}</div>
                <div class="translation">${currentSurahData.translations[index].text}</div>
            </div>
        `;

        listItem.onclick = () => playAyah(arabicAyah, listItem);
        listElement.appendChild(listItem);
    });
}

// Yakka oyatni ijro etish
function playAyah(ayah, element) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    clearHighlights();
    element.classList.add('playing');
    
    currentAudio = new Audio(ayah.audio);
    currentAudio.play();
    currentAudio.onended = () => element.classList.remove('playing');
}

// To'liq sura ijro etish
async function playFullSurah() {
    if (!currentSurahData) {
        alert("Avval sura raqamini kiriting!");
        return;
    }

    clearHighlights();
    
    for (const ayah of currentSurahData.ayahs) {
        const listItem = document.getElementById(`ayah-${ayah.numberInSurah}`);
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        listItem.classList.add('playing');
        currentAudio = new Audio(ayah.audio);
        await new Promise(resolve => {
            currentAudio.play();
            currentAudio.onended = resolve;
        });
        listItem.classList.remove('playing');
    }
}

// Highlightlarni tozalash
function clearHighlights() {
    document.querySelectorAll('.verse-item').forEach(item => {
        item.classList.remove('playing');
    });
}

// Event listenerlar
document.getElementById('inputElement').addEventListener('change', loadSura);
document.getElementById('readAll').addEventListener('click', playFullSurah);