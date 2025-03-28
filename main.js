const inputElement = document.getElementById('inputElement');
const list = document.getElementById('list');
const audioWrapper = document.getElementById('audioWrapper');
const surahName = document.getElementById('surahName');

const audio = new Audio();
audioWrapper.appendChild(audio);

inputElement.onkeyup = async event => {
    if(event.keyCode === 13){
        const surahNumber = parseInt(inputElement.value);
        if(surahNumber > 114 || surahNumber < 1){
            return alert("Noto'g'ri sura raqami! Faqat 1-114 oralig'idagi raqamlarni kiriting.");
        }

        list.innerHTML = '';
        
        let dataUz = await fetch(`https://quranenc.com/api/v1/translation/sura/uzbek_rwwad/${surahNumber}`);
        dataUz = await dataUz.json();

        if(dataUz.result && dataUz.result.length > 0) {
            surahName.textContent = dataUz.result[0].sura_name;
            
            for (let el of dataUz.result){
                let li = document.createElement('li');
                let h2 = document.createElement('h2');
                let h3 = document.createElement('h3');

                h2.textContent = el.arabic_text;
                h3.textContent = el.translation;
                li.append(h2, h3);
                list.append(li);

                li.onclick = () => {
                    audio.src = `https://cdn.islamic.network/quran/audio/64/ar.alafasy/${el.id}.mp3`;
                    audio.play();

                    document.querySelectorAll('.active').forEach(item => {
                        item.classList.remove('active');
                    });

                    li.classList.add('active');
                }
            }
        }
    }
};

document.getElementById('readAll').addEventListener('click', () => {
    alert("Bu funksiya ishlab chiqilmoqda. Tez orada ishga tushadi!");
});
