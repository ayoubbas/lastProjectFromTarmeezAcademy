// const { default: axios } = require("axios");

let cards = document.querySelector(".cards");
let card = document.querySelector(".commentCard")
let plus = document.querySelector(".plusIcon");
let myform = document.querySelector("#myForm")
let nameOfUserOfPost = document.querySelector(".nameOfUserOfPost")
let token = "";
if (localStorage.getItem("token")) {
  token = localStorage.getItem("token");
}
setUp();
function setUp() {
  if (localStorage.getItem("user")) {
    let userData = JSON.parse(localStorage.getItem("user"));
    document.querySelector("#username").textContent = userData.username;
    document.querySelector("#imgProfileHeader").src = userData.profile_image;
    document.querySelector(".loginAndRegister").classList.add("d-none");
    document.querySelector(".logged").classList.remove("d-none");

    if(myform != null){
      myform.classList.remove("d-none");
    }
    if(plus !=  null){
      plus.classList.remove("d-none");
    }

  
    if (cards != null) {
      createPosts();
    }
  } else if(!localStorage.getItem("user")) {
    
    document.querySelector(".loginAndRegister").classList.remove("d-none");
    document.querySelector(".logged").classList.add("d-none");
    if(plus!= null){
      document.querySelector(".plusIcon").classList.add("d-none");
      
    }
    if(myform != null){
      myform.classList.add("d-none");

    }
    // document.querySelector("#myForm").classList.add("d-none")
    if (cards != null) {
      createPosts();
    }
  }
}

// ! logout event
document.querySelector("#logout").addEventListener("click", function () {
  // event listenr
  localStorage.clear();
  setUp();
  showAlert("you are succesfully logout", "danger");
  const alert = bootstrap.Alert.getOrCreateInstance("#myAlert");
  setTimeout(() => {
    alert.close();
  }, 3000);
});

// ! creaaaaaaaaate posts
if (cards != null) {
  createPosts();
}
function createPosts() {
  axios
    .get("https://tarmeezacademy.com/api/v1/posts?limit=100")
    .then(function (response) {
      // handle success
      document.querySelector(".cards").innerHTML = "";
      
      let posts = response.data.data;
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
        cards.innerHTML += `
        <div class="card mt-5">
        <div id="${post.author.id}" onclick="getProfile(${post.author.id})" class="card-header">
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
      console.log(error);
      showAlert(error.response.data.message, "danger");
    });
}

// ! logiiiiiiiin a useer
document.querySelector("#loginBtnForm").addEventListener("click", getuser); // event listenr
function getuser() {
  axios
    .post("https://tarmeezacademy.com/api/v1/login", {
      username: document.querySelector("#emailLogin").value,
      password: document.querySelector("#passLogin").value,
    })
    .then(function (response) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUp();
      let modal = document.querySelector("#loginModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("you are succesfully", "success");
    })
    .catch(function (error) {
      console.log(error.response.data.message);
      showAlert(error.response.data.message, "danger");
    });
}

// ! create a user
document.querySelector("#registerBtnForm").addEventListener("click", creatUser); // event listenr
function creatUser() {
  let userNameRegister = document.getElementById("emailregister").value;
  let nameRegister = document.getElementById("namePerson").value;
  let passRegister = document.getElementById("passRegister").value;
  let img = document.querySelector("#imgProfile").files[0];

  let formData = new FormData();
  formData.append("username", userNameRegister);
  formData.append("name", nameRegister);
  formData.append("password", passRegister);
  formData.append("image", img);

  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
      console.log(response.data.user.profile_image);
      document.querySelector(".loginAndRegister").classList.add("d-none");
      document.querySelector(".logged").classList.remove("d-none");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUp();
      let modal = document.querySelector("#registerModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("you are succesfully register", "success");
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
}

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

// ! plus bottun
if(document.getElementById("addPostBtnForm")){
  document.getElementById("addPostBtnForm").addEventListener("click", addApost); // event listenr

}
function addApost() {

  let title = document.getElementById("title").value;
  let body = document.getElementById("body").value;
  let img = document.querySelector("#imgPost").files[0];

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", img);

  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then(function (response) {
      let modal = document.querySelector("#addPostModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setUp();
      showAlert("add your Post is successfully", "success");
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
}

// ! go to comments page

function openApost(id) {
  console.log(id);

  localStorage.setItem("idPost", id);

  window.location = "commtens.html";

}
setUpOfCommentsPage()
// console.log("ddddddddddd")
function setUpOfCommentsPage() {
  console.log("dsdcsc")
  if (localStorage.getItem("idPost")) {
    let idPost = JSON.parse(localStorage.getItem("idPost"));
    axios
      .get(`https://tarmeezacademy.com/api/v1/posts/${idPost}`)
      .then((response) => {
        let post = response.data.data
        let comments = response.data.data.comments
        if(nameOfUserOfPost != null){
          nameOfUserOfPost.textContent = post.author.username
        }
        if(card != null){
          card.innerHTML = `
        <div class="card  mt-5" >
          <div class="card-header">
            <img
              src="${post.author.profile_image}"
              class="rounded-circle shadow"
              style="width: 30px; height: 30px"
              alt=""
            /><b>@${post.author.username}</b>
          </div>
          <div id="${post.id}" class="card-body">
            <img
              src="${post.image}"
              class="w-100 rounded-top"
              alt=""
            />
            <h6 style="color: gray; margin-top: 10px">${post.created_at}</h6>
            <b>${post.title}</b>
            <p class="card-text">
            ${post.body}
            </p>
            <hr />
            <div class="comments">
              <i class="bi bi-pen-fill"></i> <span>(${post.comments_count}) Comments </span>
            </div>
            <div class="commentsSection mt-3">
              <!-- comment -->
              ${createComments()} 
              
              <!-- // comment -->
              <!-- comment -->
              
            </div>
            
          </div>
        </div>
    `;
        }
        
      
      // TODO create tags

      function createComments() {
        let comment = "";
        for (let i in comments) {
          comment += `
          <div ${comments[i].author.id} class="card-Comment">
                <img
                  src="${comments[i].author.profile_image}" class=" rounded-circle" style="width: 25px; height: 25px"
                  alt="" id="imgOfCommentuser" />
                <b class="nameOfCommentuser" style="font-size: 14px;">${comments[i].author.username}</b>
                <p  style="font-size: 14px; margin-top: 5px; border: none;">${comments[i].body}</p>
              </div>
          `;
        }
        return comment
      }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}



// ! post a comment 

function postAcomment(){

  let id = JSON.parse(localStorage.getItem("idPost"))
  let commentValue = document.getElementById("commentInput").value;
  let formAddComment = document.getElementById("myForm");
  

  let formData = new FormData();
  formData.append("body", commentValue);

  axios
  .post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, formData, {
    headers: { authorization: `Bearer ${token}` },
  })
  .then(function (response) {
    // setUp();
    setUpOfCommentsPage()

    formAddComment.reset()

    showAlert("add your comment is successfully", "success");
  })
  .catch(function (error) {
    showAlert(error.response.data.message, "danger");
  });
}





// ! edit post

function editPost( post){
  // alert("id of post user is"+ idsPost+ "id of user = " +idsUser)
  let myPost = JSON.parse(decodeURIComponent(post))
  localStorage.setItem("post",JSON.stringify(myPost))
  document.getElementById("titleUpdate").value = myPost.title;
  document.getElementById("bodyUpdate").value = myPost.body;
  console.log(myPost.id)
}

if(document.getElementById("editPostBtnForm")){

  document.getElementById("editPostBtnForm").addEventListener("click",editPostBtn )
}

function editPostBtn(){
  let title = document.getElementById("titleUpdate").value;
  let body = document.getElementById("bodyUpdate").value;
  let img = document.querySelector("#imgUpdatePost").files[0];
  let myPost = JSON.parse(localStorage.getItem("post"))
  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", img);
  formData.append("_method", "PUT")
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${myPost.id}`, formData, {
      headers: { authorization: `Bearer ${token}` },
    })
    .then(function (response) {
      let modal = document.querySelector("#editPostModal");
      let modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setUp();
      showAlert("update your Post is successfully", "success");
    })
    .catch(function (error) {
      showAlert(error.response.data.message, "danger");
    });
}

// ! deleeeeete post 
function delePost( post){
  // alert("id of post user is"+ idsPost+ "id of user = " +idsUser)
  let myPostDele = JSON.parse(decodeURIComponent(post))
  localStorage.setItem("postDele",JSON.stringify(myPostDele))
  console.log(myPostDele.id)
}

if(document.getElementById("delePostBtnForm")){
  document.getElementById("delePostBtnForm").addEventListener("click" , deletePostBtn)
}

function deletePostBtn(){
  let myPost = JSON.parse(localStorage.getItem("postDele"))
  console.log(myPost.id)
  axios.delete(`https://tarmeezacademy.com/api/v1/posts/${myPost.id}`,  {
    headers: { authorization: `Bearer ${token}` },
  })
  .then(function (response) {
    let modal = document.querySelector("#delePostModal");
    let modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setUp();
    showAlert("delete your Post is successfully", "success");
  })
  .catch(function (error) {
    showAlert(error.response.data.message, "danger");
  });
}