
document.addEventListener('DOMContentLoaded', function () {



    // Use buttons to toggle between views

    current_user = document.querySelector('#profile').dataset.userid;
    // console.log(current_user);
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

    // By default, load all posts
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
                               
                                ${data.is_current_user ? `<button id="edit-button" data-postid=${post.id} onclick="edit_post()"> Edit</button>`: ''}
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
                
                const showEditButton = Number(post.user_id) === Number(current_user);



                
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
                            <p id="content" class="card-text">${post.content}</p>
                            <p class="card-text"><small class="text-muted">${post.timestamp}</small></p>
                           
                        
                            ${showEditButton? `<button id="edit-button" data-postid=${post.id} onclick="edit_post(${post.id})"> Edit</button>`: ''}
                            
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

function edit_post(postId) { 

    
    const postElement = document.querySelector(`[data-postid="${postId}"]`).closest('.card-body');
    const showEditButton = Number(postElement.dataset.userid) === Number(current_user);
    const content = postElement.querySelector('#content');
    const originalContent = content.textContent;
       // Check if the edit button is shown
       if (showEditButton) {
        // Replace the content with a textarea for editing
        content.innerHTML = `
            <textarea class="form-control textarea-custom" name="content" id="edit-content-${postId}"
                      placeholder=" " rows="3" required
                      style="border-radius: 10px; resize: none;"></textarea>`;

        // Set the original content in the textarea
        postElement.querySelector(`#edit-content-${postId}`).value = originalContent;
        postElement.querySelector(`#edit-content-${postId}`).focus();

        // Change edit button to save
        const editButton = postElement.querySelector(`#edit-button-${postId}`);
        editButton.textContent = 'Save';
        editButton.onclick = function() {
            save_post(postId);
        };
    } else {
        // Show an alert if the edit button should not be shown
        alert('You do not have permission to edit this post.');
    }

}

function save_post(postId) {
    const content = document.querySelector(`#edit-content-${postId}`).value;

    fetch(`/edit_post/${postId}`, {
        method: 'POST',
        body: JSON.stringify({
            content: content
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.updated_content);
        const postElement = document.querySelector(`[data-postid="${postId}"]`).closest('.card-body');
        postElement.querySelector('#content').textContent = data.updated_content;
        postElement.querySelector('#edit-button').textContent = 'Edit';
        postElement.querySelector('#edit-button').onclick = function() {
            edit_post(postId);
        };

      
    })
    .catch(error => {
        console.error('Error:', error);

    });
}

