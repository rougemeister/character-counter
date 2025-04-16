const sun = document.querySelector('.sun')
const moon = document.querySelector('.moon') 
const themeToggler = document.querySelector('.theme-toggler')  
const textInput = document.getElementById('text-input'); 
const charCount = document.querySelector('.char-counter');
const wordCount = document.querySelector('.word-counter');
const sentenceCount = document.querySelector('.sentence-counter');
const readingTime = document.querySelector('.reading-time');
const letterDensity = document.getElementById('.letter-density');
const excludeSpaces = document.getElementById('exclude-spaces');
const setLimit = document.getElementById('char-limit');
const charLimit = document.querySelector('.char-limit');
const limitWarning = document.querySelector('.limit-warning');
const charCounter = document.getElementById('char-counter');
const charLimitInfo = document.querySelector('.char-limit-info');

console.log(charCount)
console.log(textInput)

themeToggler.addEventListener('click', toggleDarkMode)

// themeToggler.addEventListener('click', toggleTheme)



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
  
  // Function to toggle dark mode
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
  
  // Listen for changes in system preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    // Only apply system changes if there's no saved preference
    if (localStorage.getItem('darkmode') === null) {
      document.documentElement.classList.toggle('dark', event.matches);
      updateButtonState();
    }
  });
  


  function updateLimitUI() {
    if (setLimit.checked) {
        charLimitInfo.style.display = 'flex';
        charLimit.disabled = false;
        enforceCharLimit();
    } else {
        charLimitInfo.style.display = 'none';
        charLimit.disabled = true;
        limitWarning.style.display = 'none';
        textInput.style.borderColor = '#ddd';
    }
}

// Enforce character limit
function enforceCharLimit() {
    const limit = parseInt(charLimit.value, 10);
    const text = textInput.value;
    const currentCount = excludeSpaces.checked ? text.replace(/\s/g, '').length : text.length;
    
    charCounter.textContent = `${currentCount}/${limit} characters`;
    
    if (currentCount >= limit) {
        limitWarning.style.display = 'block';
        textInput.style.borderColor = '#d9534f';
        
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
        textInput.style.borderColor = '#ddd';
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
    const wpm = 225; // words per minute
    const minutes = words.length / wpm;
    
    if (minutes < 1) {
        const seconds = Math.ceil(minutes * 60);
        readingTime.textContent = `${seconds} sec`;
    } else {
        readingTime.textContent = `${minutes.toFixed(1)} min`;
    }
    
    // Calculate letter density
    updateLetterDensity(text);
}

// Update letter density visualization
function updateLetterDensity(text) {
    // Clear previous density display
    letterDensity.innerHTML = '';
    
    // Create an object to store letter counts
    const letterCounts = {};
    let totalLetters = 0;
    
    // Count each letter (case-insensitive)
    for (let i = 0; i < text.length; i++) {
        const char = text[i].toLowerCase();
        // Only count letters a-z
        if (/[a-z]/.test(char)) {
            letterCounts[char] = (letterCounts[char] || 0) + 1;
            totalLetters++;
        }
    }
    
    // Sort letters by frequency (descending)
    const sortedLetters = Object.keys(letterCounts).sort((a, b) => 
        letterCounts[b] - letterCounts[a]
    );
    
    // Create visualization for each letter
    sortedLetters.forEach(letter => {
        const count = letterCounts[letter];
        const percentage = totalLetters > 0 ? (count / totalLetters * 100) : 0;
        
        const letterRow = document.createElement('div');
        letterRow.className = 'letter-row';
        
        const letterElem = document.createElement('div');
        letterElem.className = 'letter';
        letterElem.textContent = letter;
        
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = `${percentage}%`;
        
        const percentageElem = document.createElement('div');
        percentageElem.className = 'percentage';
        percentageElem.textContent = `${percentage.toFixed(1)}%`;
        
        barContainer.appendChild(bar);
        letterRow.appendChild(letterElem);
        letterRow.appendChild(barContainer);
        letterRow.appendChild(percentageElem);
        
        letterDensity.appendChild(letterRow);
    });
    
    // If no letters found
    if (sortedLetters.length === 0) {
        const noData = document.createElement('p');
        noData.textContent = 'No letters to display.';
        letterDensity.appendChild(noData);
    }
}

// Event listeners
textInput.addEventListener('input', updateCounts);

excludeSpaces.addEventListener('change', function() {
    updateCounts();
    if (setLimit.checked) {
        enforceCharLimit();
    }
});

setLimit.addEventListener('change', function() {
    updateLimitUI();
    updateCounts();
});

charLimit.addEventListener('input', function() {
    if (setLimit.checked) {
        enforceCharLimit();
        updateCounts();
    }
});

// Handle paste events to enforce character limit
textInput.addEventListener('paste', function(e) {
    if (setLimit.checked) {
        const limit = parseInt(charLimit.value, 10);
        const currentText = textInput.value;
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('Text');
        
        // Calculate how many characters we can still accept
        const currentCount = excludeSpaces.checked ? 
            currentText.replace(/\s/g, '').length : 
            currentText.length;
        
        const remainingChars = limit - currentCount;
        
        if (remainingChars <= 0) {
            // No space left, prevent the paste
            e.preventDefault();
            return;
        }
        
        if (excludeSpaces.checked) {
            // Count non-space characters in pasted text
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
            // Simple case: check if pasted text exceeds the limit
            if (pastedText.length > remainingChars) {
                e.preventDefault();
                
                // Insert only up to the limit
                const allowedText = pastedText.substring(0, remainingChars);
                
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
        }
    }
});

// Initialize
charLimitInfo.style.display = 'none';
charLimit.disabled = !setLimit.checked;
updateCounts();

  document.addEventListener('DOMContentLoaded', initializeDarkMode);
