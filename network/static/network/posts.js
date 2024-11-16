
document.addEventListener('DOMContentLoaded', function () {



    // Use buttons to toggle between views


    const allPostsButton = document.querySelector('#allPosts');
    const followingButton = document.querySelector('#following');
    const profileButton = document.querySelector('#profile');
    const newPostButton = document.querySelector('#newPost');

    // Chceck if the buttons exist in case the user is not logged in
    if (allPostsButton) {
        allPostsButton.addEventListener('click', () => load_post('posts'));
    }

    if (followingButton) {
        followingButton.addEventListener('click', () => load_post('following'));
    }

    if (profileButton) {
        profileButton.addEventListener('click', function () {
            const userID = this.dataset.userid;
            load_profile(userID);

        });
    }

    if (newPostButton) {
        newPostButton.addEventListener('click', compose_post);
    }


    load_post('posts');








});

function load_profile(userID) {
    document.querySelector('#new-post-view').style.display = 'none';
    document.querySelector('#post-view').style.display = 'block';
    document.querySelector('#profile-view').style.display = 'block';
    // Clear previous  posts
    document.querySelector('#post-view').innerHTML = '';


    //fetch posts
    fetch(`/users/${userID}`)
        .then(response => response.json())
        .then(data => {
            const profileView = document.querySelector('#profile-view');
            profileView.innerHTML = `
                            <div class="profile-info">
                               
                                <div class="user-info">
                                    <span class="username">${data.username}</span>
                                </div>
                                
                                <div class="user-action">
                                
                                    ${data.is_current_user ? '' : `
                                    <button id="follow-button" data-userid= ${data.user_id} onclick="toggleFollow()">
                                    ${data.is_following ? 'Unfollow' : 'Follow'}
                                    </button>
                                 `}
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
            var currentUsername = "{{ request.user.username }}";
            if (currentUsername === data.username) {
                document.querySelector('#follow-button').style.display = 'none';
            }
            if (data.is_following) {
                document.querySelector('#follow-button').style.backgroundColor = 'red';
            }
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

function load_post(postType, page = 1) {
    document.querySelector('#new-post-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';
    document.querySelector('#post-view').style.display = 'block';

    document.querySelector('#post-view').innerHTML = `<h3>${postType.charAt(0).toUpperCase() + postType.slice(1)}</h3>`;

    //fetch posts
    fetch(`/posts/${postType}?page=${page}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const posts = data.posts;
            const totalPages = data.total_pages;
            const currentPage = data.current_page;
            const pagination = setUpPagination(currentPage, totalPages, postType);




            // Display posts
            posts.forEach(post => {
                const postElement = document.createElement('div');

                // Escape the username properly
                
                postElement.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                        <a href="#"> 
                            <div class="username-link" 
                                 role="button" 
                                
                                 data-userid="${post.user_id}"
                                 onclick="load_profile(${post.user_id})">
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
             document.querySelector('#post-view').appendChild(pagination);
        }
        );

}

function setUpPagination(currentPage, totalPages, postType) {
    const pagination = document.createElement('div');
    pagination.className = 'pagination';

     
    
    // Generate page buttons based on total pages
    let pagesHTML = '';
    for(let i = 1; i <= totalPages; i++) {
        pagesHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="load_post('${postType}', ${i})">${i}</a>
            </li>`;
    }

    pagination.innerHTML = `      
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" 
                       onclick="load_post('${postType}', ${currentPage - 1})" 
                       aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                ${pagesHTML}
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" 
                       onclick="load_post('${postType}', ${currentPage + 1})" 
                       aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>`;


    return pagination;
                       
 

}





function compose_post() {
    // Hide all posts
    document.querySelector('#post-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'none';

    document.querySelector('#new-post-view').style.display = 'block';

}

function toggleFollow () {
    const followButton = document.querySelector('#follow-button');
    const followerCount = document.querySelector('#follower-count');

    const userID = followButton.dataset.userid;

    fetch(`/follow/${ userID }`)
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            if(data.is_following) {
                followButton.textContent = 'Unfollow';
                followButton.style.backgroundColor = 'red';
                followerCount.textContent = parseInt(followerCount.textContent) + 1;
            } else {
                followButton.textContent = 'Follow';
                followButton.style.backgroundColor = '';
                followerCount.textContent = parseInt(followerCount.textContent) - 1;
            }


        }
    })
}