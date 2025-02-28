



function includeHTML(file, elementId) {
  fetch(file)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error(`Error loading ${file}:`, error));
}


document.addEventListener("DOMContentLoaded", () => {
    includeHTML("header.html", "header-placeholder");
    includeHTML("sidebar.html", "sidebar-placeholder");
  
    let currentPath = window.location.pathname.split("/").pop();
    const observer = new MutationObserver(() => {
      const navItems = document.querySelectorAll(".nav-item");
  
      if (navItems.length > 0) {
        navItems.forEach((link) => {
          if (link.getAttribute("href") === "./" + currentPath) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  

    observer.observe(document.body, { childList: true, subtree: true });
  });
  