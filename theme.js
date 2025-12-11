// Theme Toggle Script - with prefers-color-scheme support
(function() {
  // Get system preference
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // Get current effective theme
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    // If user has manually set a theme, use it; otherwise follow system
    if (savedTheme) {
      return savedTheme;
    }
    return getSystemTheme();
  }

  // Apply theme - only set data-theme if user has manually overridden
  function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // User has manually set a preference, apply it
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // No manual override, remove data-theme to let CSS media query handle it
      document.documentElement.removeAttribute('data-theme');
    }
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

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
    // Only respond to system changes if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
      // CSS will handle the change automatically since there's no data-theme attribute
      // But we might need to trigger a re-render for any JS-dependent UI
    }
  });
})();
