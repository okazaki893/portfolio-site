// Theme Toggle Script - default to light mode
(function() {
  // Get current effective theme
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    // If user has manually set a theme, use it; otherwise default to light
    if (savedTheme) {
      return savedTheme;
    }
    return 'light'; // Default to light mode for new visitors
  }

  // Apply theme
  function applyTheme() {
    const theme = getCurrentTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Apply theme immediately (before DOM loads to prevent flash)
  applyTheme();

  // Initialize theme toggle when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
  });

  function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    const mobileToggleBtn = document.getElementById('mobileThemeToggle');

    function toggleTheme() {
      const currentTheme = getCurrentTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Save to localStorage and apply
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    if (mobileToggleBtn) {
      mobileToggleBtn.addEventListener('click', toggleTheme);
    }
  }

})();
