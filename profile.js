let imgProfile = document.getElementById("imgProfile")
let gmailPro = document.getElementById("gmailPro")
let namePro = document.getElementById("namePro")
let userNamePro = document.getElementById("userNamePro")
let howManyPosts = document.getElementById("howManyPosts")
let howManyComments = document.getElementById("howManyComments")
let cardBody = document.getElementById("cardBody")
setUpProfile()
createPostsProfile()

function showMyPro(){
    userProfile = JSON.parse(localStorage.getItem("user"))
    localStorage.setItem("userProfile", JSON.stringify(userProfile))
    setUpProfile()
    createPostsProfile()
}


function setUpProfile(){
    if(localStorage.getItem("userProfile")){
        let postProfile = JSON.parse(localStorage.getItem("userProfile"))
        if(cardBody){
            cardBody.innerHTML = ""
            cardBody.innerHTML = `
        <div class="d-flex">
                    <div class="img col-4">
                        <img id="imgProfile" src="${postProfile.profile_image}" class="rounded-circle" style="width: 150px; height: 150px; background-color: aqua; margin: 50px 0;" alt="">

                    </div>
                    <div style="font-weight: 800;" class="account-info col-4 d-flex flex-column justify-content-center">
                        <p id="gmailPro">${postProfile.email}</p>
                        <b class="namePro" id="namePro">${postProfile.name}</b>
                        <p id="userNamePro">@${postProfile.username}</p>
                    </div>

                    <div class="account-details col-4 d-flex flex-column justify-content-center">
                        <p class=" text-secondary"><span id="howManyPosts" style="font-size: 34px;">${postProfile.posts_count} </span>Posts</p>
                        <p class=" text-secondary"><span id="howManyComments" style="font-size: 34px;">${postProfile.comments_count} </span>Comments</p>
                    </div>
        </div>
        `
        }
    }


}




function createPostsProfile() {
    let id = JSON.parse(localStorage.getItem("userProfile")).id
    axios
      .get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
      .then(function (response) {
        // handle success
        document.querySelector(".cardsProfile").innerHTML = "";
        let posts = response.data.data;
        console.log(posts)
        for (let post of posts) {
          let tags = post.tags;
          function ifLogin(){
            if (localStorage.getItem("user")){
              let user = JSON.parse(localStorage.getItem("user"))
              if(user.id == post.author.id){
                let editBtn = `<span data-bs-toggle="modal"
                data-bs-target="#editPostModal" id="${post.author.id}"
                 class="editBtn btn btn-secondary"
                  onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')"
                   style="float: right;">Edit</span>`
                let deleteBtn = `<span data-bs-toggle="modal"
                data-bs-target="#delePostModal" id="${post.author.id}"
                 class="deleBtn btn btn-danger"
                  onclick="delePost('${encodeURIComponent(JSON.stringify(post))}')"
                   style="float: right; margin-right: 10px">dele</span>`
                return editBtn + deleteBtn
  
              }
            }
          }
          document.querySelector(".cardsProfile").innerHTML += `
          <div class="card mt-5">
          <div id="${post.author.id}" onclick="getProfile(this.id)" class="card-header">
            <img
              src="${post.author.profile_image}"
              class="rounded-circle shadow"
              style="width: 30px; height: 30px"
              alt=""
            /><b>@${post.author.username}</b>
            ${ifLogin()} 
          </div>
          <div id="${post.id}" class="card-body" onclick="openApost(this.id)">
            <img
              src="${post.image}"
              class="w-100 rounded-top"
              alt=""
            />
            <h6 style="color: gray; margin-top: 10px">${post.created_at}</h6>
            <b>${post.title}</b>
            <p class="card-text">${post.body}</p>
            <hr />
            <div class="comments d-flex align-items-center">
              <i class="bi bi-pen-fill"></i> <span>(${
                post.comments_count
              }) Comments </span>
              <div class="tags"> 
              ${createTags(tags)} 
              </div>
            </div>
          </div>
        </div>
      `;
  
        }
        // TODO create tags
        function createTags(tags) {
          let pees = "";
          for (let i in tags) {
            pees += `<p>${tags[i].name} </p> `;
          }
          return pees;
        }
  
        
      })
      .catch(function (error) {
        // handle error
        showAlert(error.response.data.message, "danger");
      });
  }



// !get profile and send me to the profile page
function getProfile(id){
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then(function (response) { 
    let userProfile = response.data.data
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      window.location = "profile.html"
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });

}




// !shoooooooow aleeeeeeeert

function showAlert(message, type) {
    const alertAccount = document.getElementById("alertOfAccount");
    const appendAlert = (message, type) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = [
        `<div id="myAlert" class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
      ].join("");
  
      alertAccount.append(wrapper);
    };
    appendAlert(message, type);
    const alert = bootstrap.Alert.getOrCreateInstance("#myAlert");
    setTimeout(() => {
      alert.close();
    }, 3000);
  }