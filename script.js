const sun = document.querySelector('.sun')
const moon = document.querySelector('.moon') 
const themeToggler = document.querySelector('.theme-toggler')  
const textInput = document.getElementById('text-input'); 
const charCount = document.querySelector('.char-counter');
const wordCount = document.querySelector('.word-counter');
const sentenceCount = document.querySelector('.sentence-counter');
const readingTime = document.querySelector('.reading-time');
const letterDensity = document.querySelector('.letter-density');
const excludeSpaces = document.getElementById('exclude-spaces');
const setLimit = document.getElementById('char-limit');
const charLimit = document.querySelector('#char-limit-input');
const limitWarning = document.querySelector('.limit-warning');
const charCounter = document.getElementById('char-limit-input');
const seeMore = document.querySelector('.toggle-overflow')




themeToggler.addEventListener('click', toggleDarkMode)




// Function to initialize dark mode based on system preference or saved preference
function initializeDarkMode() {
    const savedPreference = localStorage.getItem('darkmode');
    
    if (savedPreference !== null) {
      // Apply saved preference
      document.documentElement.classList.toggle('darkmode', savedPreference === 'true');
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('darkmode', prefersDarkMode);
      localStorage.setItem('darkmode', prefersDarkMode);
    }
    updateButtonState();
  }
  
  function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('darkmode');
    localStorage.setItem('darkmode', isDarkMode);
    updateButtonState();
    return isDarkMode;
  }
  
  // Function to update toggle button state
  function updateButtonState() {
    const toggleButton = document.querySelector('.theme-toggler');
    console.log(toggleButton)
    if (toggleButton) {
      const isDarkMode = document.documentElement.classList.contains('darkmode');
      toggleButton.setAttribute('aria-pressed', isDarkMode);    
      moon.style.display = isDarkMode ? 'none' : 'block';
      sun.style.display = isDarkMode ? 'block' : 'none';
    }
  }
  

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (localStorage.getItem('darkmode') === null) {
      document.documentElement.classList.toggle('dark', event.matches);
      updateButtonState();
    }
  });
  


  function updateLimitUI() {
    if (setLimit.checked) {
        charLimit.disabled = false;
        enforceCharLimit();
    } else {
        charLimitInfo.style.display = 'none';
        charLimit.disabled = true;
        textInput.classList.add('warning')
    }
}


// Enforce character limit
function enforceCharLimit() {

    const limit = parseInt(charLimit.value, 10);
    const text = textInput.value;
    
    const currentCount = excludeSpaces.checked ? text.replace(/\s/g, '').length : text.length;
    charCounter.textContent = `${currentCount}/${limit} characters`;
    
    if (currentCount >= limit) {
        limitWarning.style.display = 'flex';
        textInput.classList.add('warning');
        
        // If we're over the limit, trim the text
        if (currentCount > limit) {
            if (excludeSpaces.checked) {
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
                
                textInput.value = text.substring(0, cutoffIndex);
            } else {
                // Simple case - just cut off at the limit
                textInput.value = text.substring(0, limit);
            }
        }
    } else {
        limitWarning.style.display = 'none';
        textInput.classList.remove('warning')
    }
}

// Update counts and letter density
function updateCounts() {
    const text = textInput.value;
    
    // Enforce character limit if enabled
    if (setLimit.checked) {
        enforceCharLimit();
    }
    
    // Character count (with or without spaces)
    const charCountValue = excludeSpaces.checked ? text.replace(/\s/g, '').length : text.length;
    charCount.textContent = charCountValue;
    
    // Word count
    const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
    wordCount.textContent = words.length;
    
    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim() !== '');
    sentenceCount.textContent = sentences.length;
    
    // Reading time calculation (average adult reads 200-250 words per minute)
    const wpm = 50; // words per minute
    const minutes = words.length / wpm;
    
    if (minutes < 1) {
        const seconds = Math.ceil(minutes * 60);
        readingTime.textContent = `${seconds} sec`;
    } else {
        readingTime.textContent = `${minutes.toFixed(1)} min`;
    }
    
 
    updateLetterDensity(text);
}


function updateLetterDensity(text) {
    
    letterDensity.innerHTML = '';
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
  
      letterDensity.appendChild(progressBar);
  });
  
    
    
    if (sortedLetters.length === 0) {
        const noData = document.createElement('p');
        noData.textContent = 'No characters found. Start typing to see letter density.';
        letterDensity.appendChild(noData);
    }
}


textInput.addEventListener('input', updateCounts);

excludeSpaces.addEventListener('change', function() {
    updateCounts();
    if (setLimit.checked) {
        enforceCharLimit();
    }
});

setLimit.addEventListener('change', function() {
    updateCounts();
});

console.log(charLimit)
charLimit.addEventListener('input', function() {
    if (setLimit.checked) {
        enforceCharLimit();
        updateCounts();
    }
});


textInput.addEventListener('paste', function(e) {
    if (setLimit.checked) {
        const limit = parseInt(charLimit.value, 10);
        const currentText = textInput.value;
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('Text');
        
        
        const currentCount = excludeSpaces.checked ? 
            currentText.replace(/\s/g, '').length : 
            currentText.length;
        
        const remainingChars = limit - currentCount;
        
        if (remainingChars <= 0) {
            e.preventDefault();
            return;
        }
        
        if (excludeSpaces.checked) {
            const nonSpacePastedCount = pastedText.replace(/\s/g, '').length;
            
            if (nonSpacePastedCount > remainingChars) {
                // Too many characters, prevent default paste and handle manually
                e.preventDefault();
                
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
                
                // Insert at cursor position
                const start = textInput.selectionStart;
                const end = textInput.selectionEnd;
                textInput.value = currentText.substring(0, start) + 
                    allowedText + 
                    currentText.substring(end);
                
                // Set cursor position after the pasted text
                textInput.selectionStart = textInput.selectionEnd = start + allowedText.length;
                
                // Update counts
                updateCounts();
            }
        } else {
            if (pastedText.length > remainingChars) {
                e.preventDefault();
                
                
                const allowedText = pastedText.substring(0, remainingChars);
                
              
                const start = textInput.selectionStart;
                const end = textInput.selectionEnd;
                textInput.value = currentText.substring(0, start) + 
                    allowedText + 
                    currentText.substring(end);
                
                textInput.selectionStart = textInput.selectionEnd = start + allowedText.length;
                
                
                updateCounts();
            }
        }
    }
});

// 
updateCounts();

document.addEventListener('DOMContentLoaded', initializeDarkMode);
