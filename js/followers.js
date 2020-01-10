// ----------------------------------------------------
// Fetching and Showing a user's followers list
//-----------------------------------------------------

function showFollowers(followers_url) {
  // Instatiate pagination for followers
  let pagination1 = new Pagination(`${followers_url}?per_page=8&page=1`);
  let data = pagination1.getNextData();
  data.then(followers => {
    displayFollowers(followers, pagination1.pageNumber);
    $(".main-nav__followers").addClass("main-nav__link--active");

    // Show next data when user presses next button
    $(".followers-page .prev-next-container__next-btn").click(() => {
      // Do not fetch more results if current results are the last ones
      if (pagination1.lastPage) return;

      data = pagination1.getNextData();
      data.then(followers => {
        displayFollowers(followers, pagination1.pageNumber);
        $(".main-nav__followers").addClass("main-nav__link--active");
      });
    });

    // Show previous data when user presses next button
    $(".followers-page .prev-next-container__prev-btn").click(() => {
      // Sef last page flag to false
      pagination1.lastPage = false;

      if (pagination1.setNextUrl()) {
        data = pagination1.getNextData();
        data.then(followers => {
          displayFollowers(followers, pagination1.pageNumber);
          $(".main-nav__followers").addClass("main-nav__link--active");
        });
      }
    });
  });
}

//----------------------------------------------------
// Creating the followers nodes and adding it to the DOM
//----------------------------------------------------

// Display all followers
function displayFollowers(followers, pageNumber) {
  let docFrag = document.createDocumentFragment();
  for (let i = 0; i < followers.length; i++) {
    const { avatar_url, login } = followers[i];
    let followerNode = populateFolloweNode(avatar_url, login);
    docFrag.appendChild(followerNode);
  }

  // Only update page server returned data
  if (followers.length !== 0) {
    $(".followers-page .page1").html("");
    $(".followers-page .page1").prepend(docFrag);
    $(".current-page").html(pageNumber);
  } else {
    $(".followers-page .prev-next-container").hide();
    $(".followers-page").prepend(
      `<p class="no-followers"> User has no followers</p>`
    );
  }
}

// insert text in the node
function populateFolloweNode(avatar_url, username) {
  let followersDiv = getFollowerNodeFromTemplate();

  followersDiv.querySelector(".follower-avatar-image").src = avatar_url;
  followersDiv.querySelector(".follower-name").innerHTML = username;

  return followersDiv;
}

// Creates a follower node from template
function getFollowerNodeFromTemplate() {
  // Get the template element
  let template = document.querySelectorAll("template")[1];

  // Get the div element from the template
  let followersElement = template.content.querySelector("div");

  // Create a new node based on the template
  let followersNode = document.importNode(followersElement, true);

  return followersNode;
}
