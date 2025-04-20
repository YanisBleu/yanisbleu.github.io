// Hey there 👋 if you find any bugs or have suggestions, feel free to reach out!
// You can find me on Discord yanisbleu

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

  function connectToLanyard(userId) {
    const socket = new WebSocket("wss://api.lanyard.rest/socket");

    socket.onopen = () => {
        socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
            updateDiscordStatus(data.d);
        }
    };
}


// Connect to WebSocket
connectToLanyard("798310011335606315");

function updateDiscordStatus(data) {
  const discordStatus = document.getElementById("discord-status");
  let statusHTML = `Currently: <span class="${data.discord_status}">${data.discord_status.toUpperCase()}</span>`;
  const activityCard = document.getElementById("discord-activity-card");
  activityCard.innerHTML = ""; // Reset the card content

  
  // Check for activities (Spotify, Twitch, etc.)
  const activities = data.activities;
  if (activities.length > 0) {
      activities.forEach(activity => {
          let activityTime = '';
          const startTime = activity.start_timestamp;

          if (activity.type === 2 && activity.name === "Spotify") {
            const trackName = activity.details;
            const artist = activity.state;
            const album = activity.assets?.large_text;
            const imageHash = activity.assets.large_image.replace("spotify:", "");
            const imageUrl = `https://i.scdn.co/image/${imageHash}`;
            const spotifyCard = `
              <div class="activity-card spotify-card">
                <img src="${imageUrl}" alt="Album cover" />
                <p>🎵 Listening to <strong>${trackName}</strong></p>
                <p>👤 ${artist}</p>
                ${album ? `<p style="font-size: 0.8rem;">💿 ${album}</p>` : ""}
              </div>
            `;
            activityCard.innerHTML += spotifyCard;
          } else if (activity.name === "Twitch") { // Streaming on Twitch
              statusHTML += `<br>📺 Streaming on <a href="https://twitch.tv/${activity.state}" target="_blank">Twitch</a>${activityTime}`;
          } else { // Any other game or activity
              statusHTML += `<br>🎮 Playing: ${activity.name}${activityTime}`;
          }
      });
  }

  discordStatus.innerHTML = statusHTML;
}


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

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links li");
  const lastLink = navLinks[navLinks.length - 1];

  const handleNavLinks = () => {
    if (window.innerWidth <= 600) {
      lastLink.style.display = "none";
    } else {
      lastLink.style.display = "inline-block"; // Restore it on larger screens
    }
  };

  handleNavLinks(); // Run on page load
  window.addEventListener("resize", handleNavLinks); // Run on window resize
});

function adjustBackground() {
  const navLinks = document.querySelector('.nav-links');
  const stickyNav = document.querySelector('.sticky-nav');

  // Get the screen width
  const screenWidth = window.innerWidth;

  // Update the background size dynamically
  navLinks.style.backgroundSize = `${screenWidth}px auto`;
  stickyNav.style.backgroundSize = `${screenWidth}px auto`;
}

// Adjust on load and on resize
window.addEventListener('load', adjustBackground);
window.addEventListener('resize', adjustBackground);


document.getElementById('download-toggle').addEventListener('click', () => {
  const resumeElement = document.getElementById('resume-section');
  const opt = {
      margin:       1,
      filename:     'Yanis.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(resumeElement).set(opt).save();
});

