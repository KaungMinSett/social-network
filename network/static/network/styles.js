document.addEventListener('DOMContentLoaded', function() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Get current path
    const currentPath = window.location.pathname;

    // Function to handle active state
    function setActiveLink(clickedLink) {
        // Remove active class from all links
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Add active class to the clicked link's parent
        clickedLink.parentElement.classList.add('active');
    }

    // Set initial active state based on current URL
    navLinks.forEach(link => {
        // For links that navigate to new pages
        if (link.href.includes(currentPath) && currentPath !== '/') {
            setActiveLink(link);
        }
        // For the home page
        else if (currentPath === '/' && link.dataset.page === 'index') {
            setActiveLink(link);
        }

        // Add click event listener
        link.addEventListener('click', function(e) {
            // For links that don't navigate to new pages (hashtag links)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                setActiveLink(this);
            }
            // For links that do navigate to new pages, let them handle naturally
            // The active state will be set on page load
        });
    });
});