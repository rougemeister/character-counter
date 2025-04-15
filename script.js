const sun = document.querySelector('.sun')
const moon = document.querySelector('.moon')
const themeToggler = document.querySelector('.theme-toggler')

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
  if (themeToggler) {
    const isDarkMode = document.documentElement.classList.contains('darkmode');
    themeToggler.setAttribute('aria-pressed', isDarkMode);
    
    moon.style.display = isDarkMode ? 'none' : 'block';
    sun.style.display = isDarkMode ? 'block' : 'none';
  }
}

// Listen for changes in system preference
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  // Always apply system changes unless user has explicitly set a preference
  if (localStorage.getItem('darkmode') === null) {
    document.documentElement.classList.toggle('darkmode', event.matches);
    localStorage.setItem('darkmode', event.matches);
    updateButtonState();
  }
});

// Clear user preference when user wants to follow system
function resetToSystemPreference() {
  localStorage.removeItem('darkmode');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('darkmode', prefersDarkMode);
  updateButtonState();
}

document.addEventListener('DOMContentLoaded', initializeDarkMode);
themeToggler.addEventListener('click', toggleDarkMode);


console.log(localStorage.getItem('darkmode'));