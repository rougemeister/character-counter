export const DOMElements = {
    getElements() {
      return {
        sun: document.querySelector('.sun'),
        moon: document.querySelector('.moon'),
        themeToggler: document.querySelector('.theme-toggler'),
        textInput: document.getElementById('text-input'),
        charCount: document.querySelector('.char-counter'),
        wordCount: document.querySelector('.word-counter'),
        sentenceCount: document.querySelector('.sentence-counter'),
        readingTime: document.querySelector('.reading-time'),
        letterDensity: document.querySelector('.letter-density'),
        excludeSpaces: document.getElementById('exclude-spaces'),
        setLimit: document.getElementById('char-limit'),
        charLimit: document.querySelector('#char-limit-input'),
        limitWarning: document.querySelector('.limit-warning'),
        limitNumber: document.querySelector('.limit-number'),
        toggleOverflow: document.querySelector('.toggle-overflow'),
        seeMore: document.querySelector('.see-more'),
        seeLess: document.querySelector('.see-less')
      };
    }
  };
  
  // Theme service - handles dark mode functionality
  export const ThemeService = {
    // Check if the darkmode class exists on the document
    isDarkMode() {
      return document.documentElement.classList.contains('darkmode');
    },
  
    // Set dark mode based on the boolean value passed and save it to localStorage
    setDarkMode(isDark) {
      // Ensure that we toggle the darkmode class correctly
      document.documentElement.classList.toggle('darkmode', isDark);
      localStorage.setItem('darkmode', JSON.stringify(isDark)); // Ensure we save it as a stringified boolean
      return isDark;
    },
  
    // Toggle the current dark mode state
    toggleDarkMode() {
      const currentState = this.isDarkMode();
      const newState = !currentState;  // Invert current state
      return this.setDarkMode(newState); // Apply the new state
    },
  
    // Retrieve the saved dark mode preference from localStorage
    getSavedPreference() {
      const savedPreference = localStorage.getItem('darkmode');
      // Parse the saved value and return as boolean (true/false)
      return savedPreference ? JSON.parse(savedPreference) : null; // Return null if no saved preference
    },
  
    // Get the system dark mode preference
    getSystemPreference() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
  
    // Initialize dark mode based on saved preference or system preference
    initializeDarkMode() {
      const savedPreference = this.getSavedPreference();
      if (savedPreference !== null) {
        this.setDarkMode(savedPreference); // Use saved preference if available
      } else {
        const prefersDarkMode = this.getSystemPreference(); // Use system preference if no saved value
        this.setDarkMode(prefersDarkMode);
      }
      
      return this.isDarkMode();
    }
  };
  
  
  // Text analyzer - core business logic for text analysis
  export const TextAnalyzer = {
    countCharacters(text, excludeSpaces) {
      return excludeSpaces ? text.replace(/\s/g, '').length : text.length;
    },
    
    countWords(text) {
      return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    },
    
    countSentences(text) {
      return text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '').length;
    },
    
    calculateReadingTime(wordCount, wpm = 50) {
      const minutes = wordCount / wpm;
      if (minutes < 1) {
        const seconds = Math.ceil(minutes * 60);
        return `${seconds} sec`;
      } 
      return `${minutes.toFixed(1)} min`;
    },
    
    getLetterDensity(text) {
      const letterCounts = {};
      let totalLetters = 0;
      
      // Count each letter (case-insensitive)
      for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        
        if (/[a-z]/.test(char)) {
          letterCounts[char] = (letterCounts[char] || 0) + 1;
          totalLetters++;
        }
      }
      
      const sortedLetters = Object.keys(letterCounts).sort((a, b) => 
        letterCounts[b] - letterCounts[a]
      );
      
      return {
        letterCounts,
        totalLetters,
        sortedLetters
      };
    },
    
    enforceCharLimit(text, limit, excludeSpaces) {
      if (!limit) return text;
      
      const currentCount = this.countCharacters(text, excludeSpaces);
      
      if (currentCount <= limit) return text;
      
      // We're over the limit, trim the text
      if (excludeSpaces) {
        // This is more complex as we need to count non-space characters
        let nonSpaceCount = 0;
        let cutoffIndex = text.length;
        
        for (let i = 0; i < text.length; i++) {
          if (text[i].match(/\S/)) {
            nonSpaceCount++;
            if (nonSpaceCount > limit) {
              cutoffIndex = i;
              break;
            }
          }
        }
        
        return text.substring(0, cutoffIndex);
      } else {
        // Simple case - just cut off at the limit
        return text.substring(0, limit);
      }
    },
    
    processPastedText(currentText, pastedText, limit, excludeSpaces, selectionStart, selectionEnd) {
      if (!limit) return { newText: currentText, newCursorPos: selectionStart };
      
      const currentCount = this.countCharacters(currentText, excludeSpaces);
      const remainingChars = limit - currentCount;
      
      if (remainingChars <= 0) {
        return { newText: currentText, newCursorPos: selectionStart };
      }
      
      if (excludeSpaces) {
        const nonSpacePastedCount = pastedText.replace(/\s/g, '').length;
        
        if (nonSpacePastedCount > remainingChars) {
          // Determine how much of the pasted text we can add
          let allowedText = '';
          let nonSpaceCount = 0;
          
          for (let i = 0; i < pastedText.length; i++) {
            if (pastedText[i].match(/\S/)) {
              nonSpaceCount++;
              if (nonSpaceCount > remainingChars) {
                break;
              }
            }
            allowedText += pastedText[i];
          }
          
          // Create new text with allowable portion
          const newText = currentText.substring(0, selectionStart) + 
              allowedText + 
              currentText.substring(selectionEnd);
              
          return {
            newText,
            newCursorPos: selectionStart + allowedText.length
          };
        }
      } else {
        if (pastedText.length > remainingChars) {
          const allowedText = pastedText.substring(0, remainingChars);
          
          const newText = currentText.substring(0, selectionStart) + 
              allowedText + 
              currentText.substring(selectionEnd);
              
          return {
            newText,
            newCursorPos: selectionStart + allowedText.length
          };
        }
      }
      
      // Default return if no special handling needed
      return { 
        newText: null, // null indicates no change needed, use default paste behavior
        newCursorPos: selectionStart
      };
    }
  };
  
  // UI Controller - handles updating the UI with analysis results
  export const UIController = {
    updateButtonState(elements, isDarkMode) {
      if (elements.themeToggler) {
        elements.themeToggler.setAttribute('aria-pressed', isDarkMode);
        elements.moon.style.display = isDarkMode ? 'none' : 'block';
        elements.sun.style.display = isDarkMode ? 'block' : 'none';
      }
    },
    
    updateCharLimitUI(elements, currentCount, limit, isOverLimit) {
      elements.limitNumber.textContent = limit;
      
      if (isOverLimit) {
        elements.limitWarning.style.display = 'flex';
        elements.textInput.classList.add('warning');
      } else {
        elements.limitWarning.style.display = 'none';
        elements.textInput.classList.remove('warning');
      }
    },
    
    updateCounters(elements, charCount, wordCount, sentenceCount, readingTimeText) {
      elements.charCount.textContent = charCount < 10 ? `0${charCount}` : charCount;
      elements.wordCount.textContent = wordCount < 10 ? `0${wordCount}` : wordCount;
      elements.sentenceCount.textContent = sentenceCount < 10 ? `0${sentenceCount}` : sentenceCount;
      elements.readingTime.textContent = readingTimeText;
    },
    
    updateLetterDensityUI(elements, letterDensityData) {
      const { letterCounts, totalLetters, sortedLetters } = letterDensityData;
      elements.letterDensity.innerHTML = '';
      
      if (sortedLetters.length === 0) {
        const noData = document.createElement('p');
        noData.textContent = 'No characters found. Start typing to see letter density.';
        elements.letterDensity.appendChild(noData);
        return;
      }
      
      sortedLetters.forEach(letter => {
        const count = letterCounts[letter];
        const percentage = totalLetters > 0 ? (count / totalLetters * 100) : 0;
    
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
    
        const letterElem = document.createElement('div');
        letterElem.className = 'letter';
        letterElem.textContent = letter.toUpperCase();
    
        const progress = document.createElement('div');
        progress.className = 'progress';
    
        const barVisible = document.createElement('div');
        barVisible.className = `bar-visible letter-${letter}`;
        barVisible.style.width = `${percentage}%`;
    
        const percentageElem = document.createElement('p');
        percentageElem.className = 'percentage';
        percentageElem.textContent = `${count} (${percentage.toFixed(2)}%)`;
    
        progress.appendChild(barVisible);
        progressBar.appendChild(letterElem);
        progressBar.appendChild(progress);
        progressBar.appendChild(percentageElem);
    
        elements.letterDensity.appendChild(progressBar);
      });
      
      // Update toggle visibility based on items count
      if (elements.letterDensity.children.length < 5) {
        elements.toggleOverflow.style.visibility = 'hidden';
      } else {
        elements.toggleOverflow.style.visibility = 'visible';
      }
    }
  };