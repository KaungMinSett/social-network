
    document.addEventListener('DOMContentLoaded', function() {
          // Use buttons to toggle between views
        document.querySelector('#allPosts').addEventListener('click', () => load_post('posts'));
        document.querySelector('#following').addEventListener('click', () => load_post('posts'));
        document.querySelector('#profile').addEventListener('click', () => load_profile());
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
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#post-view').style.display = 'block';

        document.querySelector('#post-view').innerHTML = `<h3>${postType.charAt(0).toUpperCase() + postType.slice(1)}</h3>`;

        //fetch posts
        fetch(`/posts/${postType}`)
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${post.user}</h5>
                            <p class="card-text">${post.content}</p>
                            <p class="card-text"><small class="text-muted">${post.timestamp}</small></p>
                            
                        </div>
                    </div>
                `;
                document.querySelector('#post-view').appendChild(postElement);
            }
            );
        }
        );
    }





    function compose_post() {
        // Hide all posts
        document.querySelector('#post-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';

        document.querySelector('#new-post-view').style.display = 'block';

    }

    function load_profile() {
        document.querySelector('#new-post-view').style.display = 'none';
        document.querySelector('#post-view').style.display = 'block';
        document.querySelector('#profile-view').style.display = 'block';
        // Clear previous profile posts
        document.querySelector('#post-view').innerHTML = '';

        
        //fetch posts
        fetch('/posts/profile')
        .then(response => response.json())
        .then(posts => {
            console.log(posts);
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h5 class="card-title">${post.user}</h5>
                            <p class="card-text">${post.content}</p>
                            <p class="card-text"><small class="text-muted">${post.timestamp}</small></p>
                            
                        </div>
                    </div>
                `;
                document.querySelector('#post-view').appendChild(postElement);
            }
            );
        }
        );
    }