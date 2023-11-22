console.log('Bismi Allah');

const baseUrl = 'https://tarmeezacademy.com/api/v1';
const apiUrl = `${baseUrl}/posts`;



let lastPage = 1


// Dispaly data
function loadingPosts() {
    let posts = [];
    fetch(`${apiUrl}?limit=2&page=1`)
        .then((response) => {
            console.log(response)
        //lastPage = response.data.meta.last_page
            if (!response.ok) {
                throw new Error('Network response error');
            }
            return response.json();
        })
        .then((jsonData) => {
            posts = jsonData.data;
            console.log(jsonData);
            let lastPage = jsonData.meta.last_page
            console.log(lastPage);
            document.getElementById('posts').innerHTML = '';

            for (let post of posts) {
                let author = post.author;
                let postTitle = 'Title';
                if (post.title != null) {
                    postTitle = post.title;
                }
                let tags = post.tags;

                let htmlTags = `<button class="btn btn-sm rounded-5" style="background-color:gray; color:white;">general</button> `;
                for (let tag of tags) {
                    htmlTags += `<button class="btn btn-sm rounded-5" style="background-color:gray; color:white;">${tag}</button>`
                }

                let content = `<div class="card shadow rounded">
                            <div class="card-header">
                                <img
                                    src="${author.profile_image}"
                                    alt="profile picture" />
                                <span>@${author.username}</span>
                            </div>
                            <div class="card-body">
                                <img
                                    class="w-100"
                                    src=${post.image}
                                    alt="" />
                                <h6 class="card-title mt-2">${post.created_at}</h6>
                                <h5>${postTitle}</h5>
                                <p class="card-text">
                                    ${post.body}
                                </p>
                                <hr />
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        class="bi bi-pen"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0          1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                    </svg>
                                    <span>${post.comments_count} comments</span> <span>${htmlTags}</span> 
                                    
                                </div>

                                <a
                                    href="#"
                                    class="btn btn-primary"
                                    >Go somewhere</a
                                >
                            </div>
                        </div>`;

                document.getElementById('posts').innerHTML += content;
            }
            uiViewUpdate();
        });

}


// Create a variable to store the current page number

loadingPosts()



// Register
function registerBtn() {
    const url = `${baseUrl}/register`;

    const name = document.getElementById('register-name').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const profileImage = document.getElementById('profileImage').files[0]



    // const postData = { name: name, username: username, password: password };
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", profileImage);

    const headers = { "Content-Type": "multipart/form-data" }

    axios
        .post(url, formData, { headers: headers })
        .then((response) => {

            //console.log(response)
            // document.getElementById('headerProfileImage').src = response.data.user.profile_image
            // document.getElementById('headerProfileName').innerHTML = response.data.user.username

            let token = response.data.token;
            let user = response.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            const modal = document.getElementById('registerModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            showAlert('Logged in successfuly', 'success')
            uiViewUpdate();

        })
        .catch((error) => {
            let errorMsg = error.response.data.message
            showAlert(errorMsg, 'danger')
            console.log(error);
            console.log(error.response.data.message);
        });

}

// Login
function loginBtn() {
    const url = `${baseUrl}/login`;

    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const postData = { username: username, password: password };

    axios
        .post(url, postData)
        .then((response) => {
            //console.log(response.data, response.data.token);
            let token = response.data.token;
            let user = response.data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            const modal = document.getElementById('loginModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            showAlert('Logged in successfuly', 'success')
            uiViewUpdate();

        })
        .catch((error) => {
            alert(error.response.data.message);
        });

}



// Create Post
function createPost() {
    console.log('Salam Alikoum')

    const postTitle = document.getElementById('postTitle').value;
    const postBody = document.getElementById('postBody').value;
    const image = document.getElementById('imageInput').files[0]


    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("body", postBody);
    formData.append("image", image);

    // const params = { "body": postBody, "title": postTitle, };

    const token = localStorage.getItem("token")

    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }
    const url = `${baseUrl}/posts`;
    axios
        .post(url, formData, {
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((response) => {
            const modal = document.getElementById('createPostModal');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            showAlert('New Post Has Been Created', 'success')
            loadingPosts();
            console.log(response)
        })
        .catch((error) => {
            let errorMsg = error.response.data.message
            showAlert(errorMsg, 'danger')
            console.log(error);
            console.log(error.response.data.message);
        });
}



// LogOut function
function logOut() {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        showAlert('Logged out successfuly', 'success')
        uiViewUpdate();
    }


}

// Update UI View
function uiViewUpdate() {
    const token = localStorage.getItem('token')
    const loginDiv = document.getElementById('loginDiv')
    const logoutDiv = document.getElementById('logoutDiv')
    const addPostBtn = document.getElementById('addBtn')
    // document.getElementById('headerProfileImage').src = response.data.user.profile_image
    // document.getElementById('headerProfileName').innerHTML = response.data.user.username
    if (token == null) {

        loginDiv.setAttribute('style', 'display: flex !important;');
        logoutDiv.setAttribute('style', 'display: none !important;');
        addPostBtn.setAttribute('style', 'display: none !important;');

    } else {

        // document.getElementById('headerProfileImage').src = response.data.user.profile_image
        // document.getElementById('headerProfileName').innerHTML = response.data.user.username
        loginDiv.setAttribute('style', 'display: none !important;');
        logoutDiv.setAttribute('style', 'display: flex !important;');
        addPostBtn.setAttribute('style', 'display: block !important;');

        const user = getCurrentUser();
        //console.dir(user.username)
        document.getElementById('headerProfileName').innerHTML = user.username
        document.getElementById('headerProfileImage').src = user.profile_image

    }
}

// Bootstrap Alert

function showAlert(alertMessage, type = 'success') {

    const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    alertPlaceholder.style.position = "fixed"
    const alert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }
    alert(alertMessage, type)

    //todo: hide the bootstap alert
    // setTimeout(() => {
    //     alertPlaceholder.style.display = 'none'
    // },2000)
}


function getCurrentUser() {
    let user = null;
    const storageUser = localStorage.getItem('user');
    if (storageUser != null) {
        user = JSON.parse(storageUser);
    }
    console.log(user)
    return user
}





