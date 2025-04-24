// DOMElements.test.js
import { DOMElements } from '../src/util-functions';

describe('DOMElements', () => {
  beforeEach(() => {
    // Mock document.querySelector and document.getElementById
    document.querySelector = jest.fn().mockImplementation((selector) => {
      return { className: selector };
    });
    
    document.getElementById = jest.fn().mockImplementation((id) => {
      return { id };
    });
  });

  test('getElements returns all required DOM elements', () => {
    const elements = DOMElements.getElements();
    
    // Check that all expected properties exist
    expect(elements).toHaveProperty('sun');
    expect(elements).toHaveProperty('moon');
    expect(elements).toHaveProperty('themeToggler');
    expect(elements).toHaveProperty('textInput');
    expect(elements).toHaveProperty('charCount');
    expect(elements).toHaveProperty('wordCount');
    expect(elements).toHaveProperty('sentenceCount');
    expect(elements).toHaveProperty('readingTime');
    expect(elements).toHaveProperty('letterDensity');
    expect(elements).toHaveProperty('excludeSpaces');
    expect(elements).toHaveProperty('setLimit');
    expect(elements).toHaveProperty('charLimit');
    expect(elements).toHaveProperty('limitWarning');
    expect(elements).toHaveProperty('limitNumber');
    expect(elements).toHaveProperty('toggleOverflow');
    expect(elements).toHaveProperty('seeMore');
    expect(elements).toHaveProperty('seeLess');
    
    // Verify a few specific selectors were called correctly
    expect(document.querySelector).toHaveBeenCalledWith('.sun');
    expect(document.querySelector).toHaveBeenCalledWith('.moon');
    expect(document.getElementById).toHaveBeenCalledWith('text-input');
  });
});

// ThemeService.test.js



// TextAnalyzer.test.js
const { TextAnalyzer } = require('../src/util-functions');

describe('TextAnalyzer', () => {
  describe('countCharacters', () => {
    test('counts all characters when excludeSpaces is false', () => {
      const text = 'Hello World';
      const result = TextAnalyzer.countCharacters(text, false);
      expect(result).toBe(11);
    });

    test('counts non-space characters when excludeSpaces is true', () => {
      const text = 'Hello World';
      const result = TextAnalyzer.countCharacters(text, true);
      expect(result).toBe(10);
    });

    test('handles empty string', () => {
      expect(TextAnalyzer.countCharacters('', false)).toBe(0);
      expect(TextAnalyzer.countCharacters('', true)).toBe(0);
    });
  });

  describe('countWords', () => {
    test('counts words correctly', () => {
      expect(TextAnalyzer.countWords('Hello world')).toBe(2);
      expect(TextAnalyzer.countWords('One two three four')).toBe(4);
    });

    test('handles multiple spaces between words', () => {
      expect(TextAnalyzer.countWords('Hello    world')).toBe(2);
    });

    test('handles empty string', () => {
      expect(TextAnalyzer.countWords('')).toBe(0);
    });

    test('handles only spaces', () => {
      expect(TextAnalyzer.countWords('   ')).toBe(0);
    });
  });

  describe('countSentences', () => {
    test('counts sentences correctly', () => {
      expect(TextAnalyzer.countSentences('Hello world. This is a test.')).toBe(2);
      expect(TextAnalyzer.countSentences('Hello world! This is a test? Yes it is.')).toBe(3);
    });

    test('handles empty string', () => {
      expect(TextAnalyzer.countSentences('')).toBe(0);
    });

    test('handles sentences with no text', () => {
      expect(TextAnalyzer.countSentences('....')).toBe(0);
    });
  });

  describe('calculateReadingTime', () => {
    test('returns time in seconds for short texts', () => {
      expect(TextAnalyzer.calculateReadingTime(40)).toBe('48 sec');
    });

    test('returns time in minutes for longer texts', () => {
      expect(TextAnalyzer.calculateReadingTime(100)).toBe('2.0 min');
    });

    test('handles custom WPM', () => {
      expect(TextAnalyzer.calculateReadingTime(100, 100)).toBe('1.0 min');
    });
  });

  describe('getLetterDensity', () => {
    test('calculates letter density correctly', () => {
      const result = TextAnalyzer.getLetterDensity('hello');
      
      expect(result.totalLetters).toBe(5);
      expect(result.letterCounts).toEqual({
        h: 1, e: 1, l: 2, o: 1
      });
      expect(result.sortedLetters).toEqual(['l', 'h', 'e', 'o']);
    });

    test('handles uppercase letters', () => {
      const result = TextAnalyzer.getLetterDensity('HeLLo');
      
      expect(result.totalLetters).toBe(5);
      expect(result.letterCounts).toEqual({
        h: 1, e: 1, l: 2, o: 1
      });
    });

    test('ignores non-letter characters', () => {
      const result = TextAnalyzer.getLetterDensity('hello 123 !@#');
      
      expect(result.totalLetters).toBe(5);
      expect(result.letterCounts).toEqual({
        h: 1, e: 1, l: 2, o: 1
      });
    });

    test('handles empty string', () => {
      const result = TextAnalyzer.getLetterDensity('');
      
      expect(result.totalLetters).toBe(0);
      expect(result.letterCounts).toEqual({});
      expect(result.sortedLetters).toEqual([]);
    });
  });

  describe('enforceCharLimit', () => {
    test('returns original text when under limit', () => {
      const text = 'Hello world';
      expect(TextAnalyzer.enforceCharLimit(text, 20, false)).toBe(text);
    });

    test('trims text to limit when excludeSpaces is false', () => {
      const text = 'Hello world';
      expect(TextAnalyzer.enforceCharLimit(text, 5, false)).toBe('Hello');
    });


    test('returns original text when no limit is set', () => {
      const text = 'Hello world';
      expect(TextAnalyzer.enforceCharLimit(text, null, false)).toBe(text);
    });
  });

  describe('processPastedText', () => {
    test('returns unchanged text when no limit is set', () => {
      const currentText = 'Hello';
      const pastedText = ' world';
      const result = TextAnalyzer.processPastedText(currentText, pastedText, null, false, 5, 5);
      
      expect(result.newText).toBe(currentText);
      expect(result.newCursorPos).toBe(5);
    });

    test('returns unchanged text when over the limit', () => {
      const currentText = 'Hello world';
      const pastedText = ' more text';
      const result = TextAnalyzer.processPastedText(currentText, pastedText, 10, false, 11, 11);
      
      expect(result.newText).toBe(currentText);
      expect(result.newCursorPos).toBe(11);
    });

    test('limits pasted text when it would exceed limit', () => {
      const currentText = 'Hello';
      const pastedText = ' world!';
      const result = TextAnalyzer.processPastedText(currentText, pastedText, 10, false, 5, 5);
      
      expect(result.newText).toBe('Hello worl');
      expect(result.newCursorPos).toBe(10);
    });

    test('returns null for newText when no special handling needed', () => {
      const currentText = 'Hello';
      const pastedText = ' world';
      // We have 5 chars, limit is 20, pasting 6 more chars is fine
      const result = TextAnalyzer.processPastedText(currentText, pastedText, 20, false, 5, 5);
      
      expect(result.newText).toBe(null);
      expect(result.newCursorPos).toBe(5);
    });
  });
});

// UIController.test.js
const { UIController } = require('../src/util-functions');

describe('UIController', () => {
  describe('updateButtonState', () => {
    test('updates theme toggler correctly for dark mode', () => {
      const elements = {
        themeToggler: { setAttribute: jest.fn() },
        moon: { style: { display: 'block' } },
        sun: { style: { display: 'none' } }
      };
      
      UIController.updateButtonState(elements, true);
      
      expect(elements.themeToggler.setAttribute).toHaveBeenCalledWith('aria-pressed', true);
      expect(elements.moon.style.display).toBe('none');
      expect(elements.sun.style.display).toBe('block');
    });

    test('updates theme toggler correctly for light mode', () => {
      const elements = {
        themeToggler: { setAttribute: jest.fn() },
        moon: { style: { display: 'none' } },
        sun: { style: { display: 'block' } }
      };
      
      UIController.updateButtonState(elements, false);
      
      expect(elements.themeToggler.setAttribute).toHaveBeenCalledWith('aria-pressed', false);
      expect(elements.moon.style.display).toBe('block');
      expect(elements.sun.style.display).toBe('none');
    });

    test('handles missing themeToggler element', () => {
      const elements = {
        moon: { style: { display: 'block' } },
        sun: { style: { display: 'none' } }
      };
      
      // Should not throw an error
      expect(() => UIController.updateButtonState(elements, true)).not.toThrow();
    });
  });

  describe('updateCharLimitUI', () => {
    test('shows warning when over limit', () => {
      const elements = {
        limitNumber: { textContent: '' },
        limitWarning: { style: { display: 'none' } },
        textInput: { classList: { add: jest.fn(), remove: jest.fn() } }
      };
      
      UIController.updateCharLimitUI(elements, 110, 100, true);
      
      expect(elements.limitNumber.textContent).toBe(100);
      expect(elements.limitWarning.style.display).toBe('flex');
      expect(elements.textInput.classList.add).toHaveBeenCalledWith('warning');
    });

    test('hides warning when under limit', () => {
      const elements = {
        limitNumber: { textContent: '' },
        limitWarning: { style: { display: 'flex' } },
        textInput: { classList: { add: jest.fn(), remove: jest.fn() } }
      };
      
      UIController.updateCharLimitUI(elements, 90, 100, false);
      
      expect(elements.limitNumber.textContent).toBe(100);
      expect(elements.limitWarning.style.display).toBe('none');
      expect(elements.textInput.classList.remove).toHaveBeenCalledWith('warning');
    });
  });

  describe('updateCounters', () => {
    test('formats single-digit counts with leading zero', () => {
      const elements = {
        charCount: { textContent: '' },
        wordCount: { textContent: '' },
        sentenceCount: { textContent: '' },
        readingTime: { textContent: '' }
      };
      
      UIController.updateCounters(elements, 5, 3, 1, '30 sec');
      
      expect(elements.charCount.textContent).toBe('05');
      expect(elements.wordCount.textContent).toBe('03');
      expect(elements.sentenceCount.textContent).toBe('01');
      expect(elements.readingTime.textContent).toBe('30 sec');
    });

    test('formats double-digit counts without leading zero', () => {
      const elements = {
        charCount: { textContent: '' },
        wordCount: { textContent: '' },
        sentenceCount: { textContent: '' },
        readingTime: { textContent: '' }
      };
      
      UIController.updateCounters(elements, 15, 13, 11, '1.5 min');
      
      expect(elements.charCount.textContent).toBe(15);
      expect(elements.wordCount.textContent).toBe(13);
      expect(elements.sentenceCount.textContent).toBe(11);
      expect(elements.readingTime.textContent).toBe('1.5 min');
    });
  });

  describe('updateLetterDensityUI', () => {
    let createElementMock;
    let elements;
    
    beforeEach(() => {
      // Mock createElement
      createElementMock = jest.fn();
      document.createElement = createElementMock;
      
      // Setup mock elements
      elements = {
        letterDensity: {
          innerHTML: '',
          appendChild: jest.fn(),
          children: { length: 0 }
        },
        toggleOverflow: {
          style: { visibility: 'hidden' }
        }
      };
      
      // Setup createElement to return different objects for each call
      createElementMock.mockImplementation((tag) => {
        const element = {
          className: '',
          textContent: '',
          style: {},
          appendChild: jest.fn()
        };
        return element;
      });
    });

    test('handles empty letter density data', () => {
      const letterDensityData = {
        letterCounts: {},
        totalLetters: 0,
        sortedLetters: []
      };
      
      UIController.updateLetterDensityUI(elements, letterDensityData);
      
      expect(elements.letterDensity.innerHTML).toBe('');
      expect(document.createElement).toHaveBeenCalledWith('p');
      expect(elements.letterDensity.appendChild).toHaveBeenCalled();
    });

    test('creates progress bars for each letter', () => {
      const letterDensityData = {
        letterCounts: { a: 3, b: 2, c: 1 },
        totalLetters: 6,
        sortedLetters: ['a', 'b', 'c']
      };
      
      UIController.updateLetterDensityUI(elements, letterDensityData);
      
      // Should create various elements for each letter
      expect(document.createElement).toHaveBeenCalledTimes(15); // 5 elements for each letter
      expect(elements.letterDensity.appendChild).toHaveBeenCalledTimes(3); // One appendChild for each letter
    });

    test('shows toggle when more than 4 letters', () => {
      const letterDensityData = {
        letterCounts: { a: 5, b: 4, c: 3, d: 2, e: 1 },
        totalLetters: 15,
        sortedLetters: ['a', 'b', 'c', 'd', 'e']
      };
      
      // Mock children.length to be 5
      elements.letterDensity.children = { length: 5 };
      
      UIController.updateLetterDensityUI(elements, letterDensityData);
      
      expect(elements.toggleOverflow.style.visibility).toBe('visible');
    });

    test('hides toggle when less than 5 letters', () => {
      const letterDensityData = {
        letterCounts: { a: 3, b: 2, c: 1, d: 1 },
        totalLetters: 7,
        sortedLetters: ['a', 'b', 'c', 'd']
      };
      
      // Mock children.length to be 4
      elements.letterDensity.children = { length: 4 };
      
      UIController.updateLetterDensityUI(elements, letterDensityData);
      
      expect(elements.toggleOverflow.style.visibility).toBe('hidden');
    });
  });
});



