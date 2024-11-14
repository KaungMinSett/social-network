
document.addEventListener('DOMContentLoaded', function () {



    // Use buttons to toggle between views


    const allPostsButton = document.querySelector('#allPosts');
    const followingButton = document.querySelector('#following');
    const profileButton = document.querySelector('#profile');
    const newPostButton = document.querySelector('#newPost');

    // Check if the buttons exist before adding event listeners
    if (allPostsButton) {
        allPostsButton.addEventListener('click', () => load_post('posts'));
    }

    if (followingButton) {
        followingButton.addEventListener('click', () => load_post(''));
    }

    if (profileButton) {
        profileButton.addEventListener('click', function () {
            const username = this.dataset.username;
            load_profile(username);

        });
    }

    if (newPostButton) {
        newPostButton.addEventListener('click', compose_post);
    }


    load_post('posts');

  

   



});

function load_profile(username) {
    document.querySelector('#new-post-view').style.display = 'none';
    document.querySelector('#post-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'block';
    // Clear previous  posts
    document.querySelector('#post-view').innerHTML = '';


    //fetch posts
    fetch(`/users/${username}`)
        .then(response => response.json())
        .then(data => {
            const profileView = document.querySelector('#profile-view');
            profileView.innerHTML = `
                            <div class="profile-info">
                                <h2>${data.username}'s Profile</h2>
                                <div class="user-info">
                                    <span class="username">${data.username}</span>
                                </div>
                                <div class="user-action">
                                    <button id="follow-button" onclick="toggleFollow()">Follow</button>
                                </div>
                                 <div class="stats">
                                     <div class="stat">
                                        <strong>Followers:</strong> <span id="follower-count">${data.followers}</span>
                                    </div>
                                     <div class="stat">
                                         <strong>Following:</strong> <span id="following-count">${data.following}</span>
                                    </div>
                                    <div class="stat">
                                        <strong>Posts:</strong> <span id="post-count">${data.posts_num}</span>
                                    </div>
                                 </div>
                             </div>
                `;
                 // Display posts
                 data.posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.innerHTML = `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="#" class="">${post.user}</a>
                                </h5>
                                <p class="card-text">${post.content}</p>
                                <p class="card-text"><small class="text-muted">${post.timestamp}</small></p>
                            </div>
                        </div>
                    `;
                    document.querySelector('#post-view').appendChild(postElement);
                });

        }
        );
}

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
                // Escape the username properly
                const safeUsername = encodeURIComponent(post.user);
                postElement.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                        <a href="#"> 
                            <div class="username-link" 
                                 role="button" 
                                
                                 data-username="${safeUsername}"
                                 onclick="load_profile(decodeURIComponent(this.dataset.username))">
                                <h5 class="card-title">${post.user}</h5>
                            </div>
                           </a> 
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
        document.querySelectorAll('.profile-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent the default anchor behavior
                const username = this.dataset.username; // Get the username from the data attribute
                load_profile(username); // Load the profile
            });
        });
    
}





function compose_post() {
    // Hide all posts
    document.querySelector('#post-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    document.querySelector('#new-post-view').style.display = 'block';

}

