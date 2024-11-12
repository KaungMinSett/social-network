document.addEventListener('DOMContentLoaded', function() {
    // Get all nav links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Set the active class based on the current URL
    navLinks.forEach(link => {
        // Check if the link's href matches the current URL
        if (link.href === window.location.href) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }

        // Add click event listener to each link
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
            
            // Add active class to the clicked link's parent
            this.parentElement.classList.add('active');
        });
    });
});