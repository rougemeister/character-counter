
# Character Counter

A lightweight, user-friendly web application to count the characters, words, sentences, and paragraphs in your text.

**Live Demo**: [https://rougemeister.github.io/character-counter/](https://rougemeister.github.io/character-counter/)  
**Repository**: [https://github.com/rougemeister/character-counter](https://github.com/rougemeister/character-counter)

## Features

- Real-time character counting
- Word counting
- Sentence counting
- Character counting with and without spaces
- Clean, responsive interface
- No external dependencies
- Works offline
- No data collection or tracking

## Usage

1. Visit the [Character Counter](https://rougemeister.github.io/character-counter/) website
2. Type or paste your text into the text area
3. View the live statistics update as you type

## Why Use This Tool?

- **Writers**: Keep track of word count for articles, essays, or social media posts
- **Students**: Ensure your assignments meet character or word count requirements
- **Developers**: Test string manipulation or check content length
- **SEO Specialists**: Optimize content length for search engines
- **Social Media Managers**: Stay within platform character limits

## Technical Details

The Character Counter is built with vanilla JavaScript, HTML5, and CSS3, ensuring fast performance and compatibility across all modern browsers. The application runs entirely in your browser, with no server-side processing or data storage.

## Local Installation

If you'd like to run the Character Counter locally:

1. Clone the repository:
   ```
   git clone https://github.com/rougemeister/character-counter.git
   ```
2. Navigate to the project directory:
   ```
   cd character-counter
   ```
3. Open `index.html` in your preferred browser

## Testing with Jest

To run unit tests using Jest, follow these steps:

### 1. Install Jest
First, make sure you have Jest installed in your project:
```
npm install --save-dev jest
```

### 2. Configure Jest
Add a `jest.config.js` file in the root directory of your project:
```js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\.js$': 'babel-jest',
  },
};
```

### 3. Mocking DOM Elements in Jest

You can mock DOM elements and events using Jest's built-in methods and Jest DOM utilities.

#### Example: Testing Character Counting

Consider a function `countCharacters` that updates the character count in a DOM element when the user types into a textarea. Here's an example of how you might write a Jest test for this:

```js
import { countCharacters } from './characterCounter';

describe('countCharacters', () => {
  let inputElement;
  let outputElement;

  beforeEach(() => {
    // Set up the DOM elements
    document.body.innerHTML = `
      <textarea id="inputText"></textarea>
      <div id="output">0 characters</div>
    `;
    inputElement = document.getElementById('inputText');
    outputElement = document.getElementById('output');
  });

  it('should update character count when text is entered', () => {
    // Set an initial value in the textarea
    inputElement.value = 'Hello, World!';
    
    // Call the function that updates the character count
    countCharacters();
    
    // Trigger the 'input' event on the textarea
    inputElement.dispatchEvent(new Event('input'));

    // Check if the output element's text has updated correctly
    expect(outputElement.textContent).toBe('13 characters');
  });
});
```

#### Explanation:

- **`document.body.innerHTML`**: Sets up the HTML structure that is needed for the test.
- **`inputElement.value`**: Simulates entering text into the textarea.
- **`dispatchEvent`**: Simulates the `input` event that is triggered when the user types in the textarea.
- **`expect`**: Asserts that the output is correct based on the expected character count.

### 4. Running Tests

Once the tests are set up, you can run them using:
```
npm test
```
Jest will automatically find and run any tests defined in files with a `.test.js` extension.

## Contributing

Contributions are welcome! If you'd like to improve the Character Counter, please:

1. Fork the repository
2. Create a new branch for your feature
3. Add your changes
4. Submit a pull request

## License

None

## Contact

For questions, suggestions, or issues, please open an issue on the [GitHub repository](https://github.com/rougemeister/character-counter/issues).

---

Made with ❤️ by [Rougemeister](https://github.com/rougemeister)