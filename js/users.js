// --------------------
// Fetching users
// --------------------

let pagination = new Pagination(
  "https://api.github.com/users?per_page=8&since=0"
);
let data = pagination.getNextData();
data.then((res) => {
  // Display list of users
  displayUsers(res, pagination.pageNumber);

  // Show next 8 users when you click the next button
  $(".prev-next-container__next-btn").click(() => {
    // Do not fetch more results if current results are the last ones
    if (pagination.lastPage) return;

    data = pagination.getNextData();
    data.then((res) => {
      // Display list of users
      displayUsers(res, pagination.pageNumber);
    });
  });

  // Show previous 8 users when you click the previous button
  $(".prev-next-container__prev-btn").click(() => {
    // Sef last page flag to false
    pagination.lastPage = false;

    if (pagination.setNextUrl()) {
      data = pagination.getNextData();
      data.then((res) => {
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
  $(".user-container__more-info").click((event) => {
    username = event.target.id;
    window.location.href = `./user-info.html?username=${username}`;
  });
}
