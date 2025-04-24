import { DOMElements, ThemeService, TextAnalyzer, UIController } from './util-functions.js';

// App - main controller that ties everything together
const TextAnalyzerApp = {
  elements: null,
  
  init() {
    this.elements = DOMElements.getElements();
    this.initializeEventListeners();
    
    // Initialize dark mode
    const isDarkMode = ThemeService.initializeDarkMode();
    UIController.updateButtonState(this.elements, isDarkMode);
    
    // Initialize counts
    this.updateCounts();
    
    // Initialize media query listener
    this.initializeMediaQueryListener();
  },
  
  initializeEventListeners() {
    // Theme toggler
    this.elements.themeToggler.addEventListener('click', () => {
      const isDarkMode = ThemeService.toggleDarkMode();
      UIController.updateButtonState(this.elements, isDarkMode);
    });
    
    // Text input
    this.elements.textInput.addEventListener('input', () => this.updateCounts());
    
    // Exclude spaces
    this.elements.excludeSpaces.addEventListener('change', () => {
      this.updateCounts();
    });
    
    // Set limit
    this.elements.setLimit.addEventListener('change', () => {
      this.updateCounts();
    });
    
    // Char limit input
    this.elements.charLimit.addEventListener('input', () => {
      if (this.elements.setLimit.checked) {
        this.updateCounts();
      }
    });
    
    // Paste handler
    this.elements.textInput.addEventListener('paste', (e) => this.handlePaste(e));
    
    // See more/less
    this.elements.seeMore.addEventListener('click', () => {
      this.elements.letterDensity.style.height = 'auto';
      this.elements.seeMore.style.display = 'none';
      this.elements.seeLess.style.display = 'flex';
    });
    
    this.elements.seeLess.addEventListener('click', () => {
      this.elements.letterDensity.style.height = '160px';
      this.elements.seeMore.style.display = 'flex';
      this.elements.seeLess.style.display = 'none';
    });
  },
  
  initializeMediaQueryListener() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (ThemeService.getSavedPreference() === null) {
        ThemeService.setDarkMode(event.matches);
        UIController.updateButtonState(this.elements, event.matches);
      }
    });
  },
  
  updateCounts() {
    const text = this.elements.textInput.value;
    const excludeSpaces = this.elements.excludeSpaces.checked;
    const setLimit = this.elements.setLimit.checked;
    const limit = setLimit ? parseInt(this.elements.charLimit.value, 10) : 0;
    
    // Update character limit if needed
    if (setLimit) {
      const trimmedText = TextAnalyzer.enforceCharLimit(text, limit, excludeSpaces);
      if (trimmedText !== text) {
        this.elements.textInput.value = trimmedText;
      }
      
      const currentCount = TextAnalyzer.countCharacters(trimmedText, excludeSpaces);
      const isOverLimit = currentCount >= limit;
      
      UIController.updateCharLimitUI(this.elements, currentCount, limit, isOverLimit);
    }
    
    // Calculate text metrics
    const currentText = this.elements.textInput.value;
    const charCount = TextAnalyzer.countCharacters(currentText, excludeSpaces);
    const wordCount = TextAnalyzer.countWords(currentText);
    const sentenceCount = TextAnalyzer.countSentences(currentText);
    const readingTimeText = TextAnalyzer.calculateReadingTime(wordCount);
    
    // Update UI with metrics
    UIController.updateCounters(this.elements, charCount, wordCount, sentenceCount, readingTimeText);
    
    // Update letter density
    const letterDensityData = TextAnalyzer.getLetterDensity(currentText);
    UIController.updateLetterDensityUI(this.elements, letterDensityData);
  },
  
  handlePaste(e) {
    if (!this.elements.setLimit.checked) return;
    
    const limit = parseInt(this.elements.charLimit.value, 10);
    const currentText = this.elements.textInput.value;
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('Text');
    const excludeSpaces = this.elements.excludeSpaces.checked;
    const start = this.elements.textInput.selectionStart;
    const end = this.elements.textInput.selectionEnd;
    
    const { newText, newCursorPos } = TextAnalyzer.processPastedText(
      currentText, pastedText, limit, excludeSpaces, start, end
    );
    
    if (newText !== null) {
      e.preventDefault();
      this.elements.textInput.value = newText;
      this.elements.textInput.selectionStart = this.elements.textInput.selectionEnd = newCursorPos;
      this.updateCounts();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  TextAnalyzerApp.init();
});