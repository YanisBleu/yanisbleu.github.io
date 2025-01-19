document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight;

    // Function to handle the fade-in animation on scroll
    const fadeInOnScroll = () => {
        sections.forEach((section, index) => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // If section is near the viewport, trigger fade-in effect
            if (sectionTop < windowHeight - 20 && !section.classList.contains("fade-in")) {
                section.classList.add("fade-in");
                const delay = index * 15 + Math.random() * 10;
                section.style.transitionDelay = `${delay}ms`;
            }
        });
    };

    // Scroll event listener with debouncing
    let debounceTimer;
    window.addEventListener("scroll", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(fadeInOnScroll, 100);

        // Sticky navbar effect
        if (window.scrollY > 100) {
            navbar.classList.add('sticky-nav');
        } else {
            navbar.classList.remove('sticky-nav');
        }

        if (window.scrollY > 220) {
        navbar.classList.add("shrink");
         } else {
        navbar.classList.remove("shrink");
    }
});

    // Smooth scrolling behavior with adjusted offset for navbar visibility
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1); // Get the section ID
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Get the position of the section and adjust for navbar height
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - navbarHeight - 100, // Adjust by navbar height + some space
                    behavior: 'smooth', // Smooth scrolling
                });
            }
        });
    });

    // Trigger the fade-in for sections already in view on load
    fadeInOnScroll();

    // IntersectionObserver for fade-in animation (more efficient visibility detection)
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Trigger fade-in when 10% of the section is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains("fade-in")) {
                entry.target.classList.add("fade-in");
                const index = [...sections].indexOf(entry.target);
                const delay = index * 15 + Math.random() * 10;
                entry.target.style.transitionDelay = `${delay}ms`;
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));

    // Hide the loading spinner on page load
    window.onload = function() {
        document.getElementById('loading').style.display = 'none';
    };
});
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("darkModeButton");
    const body = document.body;
    const toast = document.getElementById("toast");
  
    // Font Awesome icons for light and dark modes
    const moonIcon = "fa-moon";
    const sunIcon = "fa-sun";
  
    // Check saved dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
      body.classList.add("dark-mode");
      toggleButton.querySelector("i").classList.remove(moonIcon);
      toggleButton.querySelector("i").classList.add(sunIcon);
    }
  
    // Handle button click
    toggleButton.addEventListener("click", () => {
      const isDarkMode = body.classList.toggle("dark-mode");
  
      // Update button icon
      const icon = toggleButton.querySelector("i");
      if (isDarkMode) {
        icon.classList.remove(moonIcon);
        icon.classList.add(sunIcon);
        localStorage.setItem("darkMode", "enabled"); // Save preference
  
        // Show toast notification with entry animation
        toast.textContent = "Dark Mode Enabled";
        toast.classList.remove("toast-exit");
        toast.classList.add("toast-enter", "show");
        setTimeout(() => {
          toast.classList.remove("toast-enter");
          toast.classList.add("toast-exit");
        }, 2000); // Wait 2 seconds before starting exit animation
      } else {
        icon.classList.remove(sunIcon);
        icon.classList.add(moonIcon);
        localStorage.setItem("darkMode", "disabled"); // Save preference
  
        // Show toast notification with entry animation
        toast.textContent = "Light Mode Enabled";
        toast.classList.remove("toast-exit");
        toast.classList.add("toast-enter", "show");
        setTimeout(() => {
          toast.classList.remove("toast-enter");
          toast.classList.add("toast-exit");
        }, 2000); // Wait 2 seconds before starting exit animation
      }
      // Hide toast completely after exit animation
      setTimeout(() => {
        toast.classList.remove("show");
      }, 2500); // Match duration with exit animation
    });
  });

// Select the toggle checkbox
const darkModeToggle = document.getElementById('dark-mode-checkbox');

// Check for saved theme in localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode'); // Adds dark mode to body
        localStorage.setItem('theme', 'dark');    // Save user preference
    } else {
        document.body.classList.remove('dark-mode'); // Removes dark mode
        localStorage.setItem('theme', 'light');      // Save user preference
    }
});
