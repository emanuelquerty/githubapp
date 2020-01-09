// --------------------
// Fetching users
// --------------------

let pagination = new Pagination(
  "https://api.github.com/users?per_page=8&since=0"
);
let data = pagination.getNextData();
data.then(res => {
  // Display list of users
  displayUsers(res, pagination.pageNumber);

  // Show next 8 users when you click the next button
  $(".prev-next-container__next-btn").click(() => {
    data = pagination.getNextData();
    data.then(res => {
      // Display list of users
      displayUsers(res, pagination.pageNumber);
    });
  });

  // Show previous 8 users when you click the previous button
  $(".prev-next-container__prev-btn").click(() => {
    // Set the url to be used to be the previous url

    if (pagination.setNextUrl()) {
      data = pagination.getNextData();
      data.then(res => {
        // Display list of users
        displayUsers(res, pagination.pageNumber);
      });
    }
  });
});

// --------------------------------------------------------------
// Creating nodes from template and inserting them in the DOM
// --------------------------------------------------------------

//Display all users
function displayUsers(users, pageNumber) {
  let docFrag = document.createDocumentFragment();
  for (let i = 0; i < users.length; i++) {
    const { login, avatar_url } = users[i];
    let userContainerNode = populateUserContainerNode(avatar_url, login);
    docFrag.appendChild(userContainerNode);
  }

  document.querySelector(".page").innerHTML = "";
  document.querySelector(".page").prepend(docFrag);

  // Display the current page
  $(".current-page").html(pageNumber);

  // Show a new page with users followers and repos
  let username = "";
  $(".user-container__more-info").click(event => {
    username = event.target.id;
    window.location.href = `./user-info.html?username=${username}`;
  });
}

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
  let moreInfoBtn = userContainerNode.querySelector(
    ".user-container__more-info"
  );

  img.src = avatar_url;
  username.innerHTML = login;
  moreInfoBtn.id = login;

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
