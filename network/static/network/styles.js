
    document.addEventListener('DOMContentLoaded', function() {
        // Get all nav links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        // Add click event listener to each link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links
                navLinks.forEach(nav => nav.parentElement.classList.remove('active'));
                
                // Add active class to the clicked link's parent
                this.parentElement.classList.add('active');
            });
        });
    });
