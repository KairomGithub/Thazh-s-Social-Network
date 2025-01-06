const users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
const posts = JSON.parse(localStorage.getItem("posts")) || [];
const notifications = [];

function login(username, password) {
  if (users[username] && users[username] === password) {
    currentUser = username;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showMain();
  } else {
    alert("Tên đăng nhập hoặc mật khẩu không đúng!");
  }
}

function register(username, password) {
  if (users[username]) {
    alert("Tên đăng nhập đã tồn tại!");
  } else {
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đăng ký thành công!");
    showLoginForm();
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  showAuth();
}

function addPost(content, video = null) {
  if (!content && !video) {
    alert("Nội dung không được để trống!");
    return;
  }
  const newPost = { username: currentUser, content, video, time: new Date().toLocaleString(), likes: 0, comments: [] };
  posts.push(newPost);
  notifications.push(`${currentUser} vừa đăng bài mới!`);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
  renderNotifications();
}

function likePost(index) {
  posts[index].likes++;
  renderPosts();
}

function commentPost(index, comment) {
  if (!comment) {
    alert("Bình luận không được để trống!");
    return;
  }
  posts[index].comments.push({ user: currentUser, comment });
  renderPosts();
}

function renderPosts() {
  const postContainer = document.getElementById("posts");
  postContainer.innerHTML = posts
    .map((post, index) => `
      <div class="post">
        <p><strong>${post.username}</strong> - <span class="post-time">${post.time}</span></p>
        <p>${post.content}</p>
        ${post.video ? `<video controls width="100%"><source src="${post.video}" type="video/mp4"></video>` : ""}
        <div class="actions">
          <button onclick="likePost(${index})">👍 Thích (${post.likes})</button>
          <button onclick="promptComment(${index})">💬 Bình luận</button>
        </div>
        <div class="comments">
          ${post.comments
            .map(comment => `<p><strong>${comment.user}</strong>: ${comment.comment}</p>`)
            .join("")}
        </div>
      </div>
    `)
    .join("");
}

function renderNotifications() {
  const notificationList = document.getElementById("notification-list");
  notificationList.innerHTML = notifications.map(note => `<li>${note}</li>`).join("");
  document.getElementById("notifications").style.display = notifications.length > 0 ? "block" : "none";
}

function promptComment(index) {
  const comment = prompt("Nhập bình luận của bạn:");
  commentPost(index, comment);
}

function showAuth() {
  document.getElementById("auth").style.display = "block";
  document.getElementById("main").style.display = "none";
  document.getElementById("logout-btn").style.display = "none";
}

function showMain() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("main").style.display = "block";
  document.getElementById("logout-btn").style.display = "block";
  renderPosts();
}

function showLoginForm() {
  document.getElementById("login-form").style.display = "block";
  document.getElementById("register-form").style.display = "none";
}

function showRegisterForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

document.getElementById("login-btn").addEventListener("click", ()