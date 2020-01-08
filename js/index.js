$(".top-nav__search-item").click(() => {
  //   alert("clicked");
  $(".side-navbar").addClass("slide-from-left");
  $(".side-navbar__big-shadow_onVisible").show();
});

// Close the sidebar and hide shadow when user clicks anywhere outside of it
$(".side-navbar__big-shadow_onVisible").click(() => {
  $(".side-navbar__big-shadow_onVisible").hide();
  $(".side-navbar").toggleClass("slide-from-left");
});

// Close the sidebar and hide shadow when user clicks the close icon
$(".side-navbar__close-icon").click(() => {
  $(".side-navbar__big-shadow_onVisible").hide();
  $(".side-navbar").toggleClass("slide-from-left");
});

let data = null;
let page = 1;

async function getData(page) {
  let url = `https://api.github.com/users?page=${page}`;
  let res = await fetch(url);
  return await res.json();
}

getData().then(users => {
  console.log(users);

  let docFrag = document.createDocumentFragment();
  for (let i = 0; i < users.length; i++) {
    const { login, avatar_url } = users[i];
    let userContainerNode = populateUserContainerNode(avatar_url, login);
    docFrag.appendChild(userContainerNode);
  }
  document.querySelector(".main").appendChild(docFrag);
});

// Returns a userContainer with data passed as arguments
function populateUserContainerNode(avatar_url, login) {
  // Get userContainerNode from template
  let userContainerNode = getUserNodeFromTemplate();

  // Populate userContainerNode
  let img = userContainerNode.querySelector(
    ".avatar-and-name-container__avatar"
  );
  let username = userContainerNode.querySelector(
    ".avatar-and-name-container__name"
  );
  img.src = avatar_url;
  username.innerHTML = login;

  return userContainerNode;
}

// Returns the content (div) inside the <template />
function getUserNodeFromTemplate() {
  // Get the template element
  let template = document.querySelector("template");

  // Get the div element from the template
  let userContainerElement = template.content.querySelector("div");

  // Create a new node based on the template
  let userContainerNode = document.importNode(userContainerElement, true);

  return userContainerNode;
}
