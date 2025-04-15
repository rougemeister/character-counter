const sun = document.querySelector('.sun')
const moon = document.querySelector('.moon') 
const themeToggler = document.querySelector('.theme-toggler')   

// console.log(themeToggler)

// function toggleTheme (){
//     document.body.classList.add('darkmode')
//     
// }

themeToggler.addEventListener('click', toggleDarkMode)

// themeToggler.addEventListener('click', toggleTheme)

/**
 * Dark Mode Toggle
 * 
 * This script:
 * 1. Checks user's system preference for dark/light mode
 * 2. Provides a toggle function to switch between modes
 * 3. Saves the preference to localStorage
 */

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
  
    
    // Update button state if it exists
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
  
  // Initialize dark mode when the page loads
  document.addEventListener('DOMContentLoaded', initializeDarkMode);
