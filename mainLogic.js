console.log('Bismi Allah');

const baseUrl = 'https://tarmeezacademy.com/api/v1';
const apiUrl = `${baseUrl}/posts`;


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

  if (token == null) {

    if (addPostBtn != null) {
      addPostBtn.setAttribute('style', 'display: none !important;');
    }

    loginDiv.setAttribute('style', 'display: flex !important;');
    logoutDiv.setAttribute('style', 'display: none !important;');
    

  } else {

    if (addPostBtn != null) {
      addPostBtn.setAttribute('style', 'display: none !important;');
    }
    loginDiv.setAttribute('style', 'display: none !important;');
    logoutDiv.setAttribute('style', 'display: flex !important;');
    

    const user = getCurrentUser();
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

// Get current user if available
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem('user');
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user
}







