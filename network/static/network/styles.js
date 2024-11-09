
    document.addEventListener('DOMContentLoaded', function() {
          // Use buttons to toggle between views
        document.querySelector('#allPosts').addEventListener('click', () => load_post('posts'));
        document.querySelector('#following').addEventListener('click', () => load_post('following'));
        document.querySelector('#profile').addEventListener('click', () => load_post('profile'));
        document.querySelector('#newPost').addEventListener('click', compose_post);

        load_post('posts');

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

    function load_post(postType) { 
        document.querySelector('#new-post-view').style.display = 'none';
        document.querySelector('#post-view').style.display = 'block';

        document.querySelector('#post-view').innerHTML = `<h3>${postType.charAt(0).toUpperCase() + postType.slice(1)}</h3>`;



    }

    function compose_post() {
        // Hide all posts
        document.querySelector('#post-view').style.display = 'none';

        document.querySelector('#new-post-view').style.display = 'block';

    }