readAllButton.addEventListener('click', () => {
      if (!currentSurah) {
          alert("Avval sura raqamini kiriting!");
          return;
      }
  
      if (isReadingAll) {
          // Stop reading
          isReadingAll = false;
          audio.pause();
          readAllButton.textContent = "Qur'on to'liq eshitish";
          return;
      }
  
      // Start reading
      isReadingAll = true;
      readAllButton.textContent = "To'xtatish";
      currentVerseIndex = 0;
      const lis = list.getElementsByTagName('li');
  
      function playNextVerse() {
          if (!isReadingAll || currentVerseIndex >= lis.length) {
              isReadingAll = false;
              readAllButton.textContent = "Qur'on to'liq eshitish";
              return;
          }
          
          const li = lis[currentVerseIndex];
          const verseNumber = currentVerseIndex + 1;
          const globalVerse = getGlobalVerseNumber(currentSurah, verseNumber);
          
          document.querySelectorAll('li').forEach(li => li.classList.remove('activate'));
          li.classList.add('activate');
          
          audio.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalVerse}.mp3`;
          audio.play();
  
          audio.onended = () => {
              if (isReadingAll) { // Ensure it continues if still active
                  currentVerseIndex++;
                  playNextVerse();
              }
          };
      }
  
      playNextVerse(); // Start the playback
  });
  