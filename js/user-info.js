let username = window.location.href.split("=")[1];
let url = `https://api.github.com/users/${username}`;

// This method fetchs all users from the github api
async function getData(url) {
  let res = await fetch(url);
  return await res.json();
}

// Show Followers Page when user-info loads
showFollowersPage();

// Show Followers page when user clicks followers
$(".main-nav__followers").click(() => {
  window.location.href = `./user-info.html?username=${username}`;
});

function showFollowersPage() {
  getData(url).then(res => {
    const { name, followers, public_repos, followers_url, repos_url } = res;
    console.log(res);
    $(".main__user-fullname").html(name);
    $(".followers-count").html(`(${followers})`);
    $(".repos-count").html(`(${public_repos})`);

    // Instatiate pagination for followers
    let pagination1 = new Pagination(`${followers_url}?per_page=8&page=1`);
    let data = pagination1.getNextData();
    data.then(followers => {
      console.log("FOLLOWERS", followers);

      displayFollowers(followers, pagination1.pageNumber);
      $(".main-nav__followers").addClass("main-nav__link--active");

      // Show next data when user presses next button
      $(".prev-next-container__next-btn").click(() => {
        data = pagination1.getNextData();
        data.then(followers => {
          displayFollowers(followers, pagination1.pageNumber);
          $(".main-nav__followers").addClass("main-nav__link--active");
        });
      });

      // Show previous data when user presses next button
      $(".prev-next-container__prev-btn").click(() => {
        if (pagination1.setNextUrl()) {
          data = pagination1.getNextData();
          data.then(followers => {
            displayFollowers(followers, pagination1.pageNumber);
            $(".main-nav__followers").addClass("main-nav__link--active");
          });
        }
      });
    });
  });
}

//----------------------------------------------------
// Creating the followers node and adding it to the DOM
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
  let template = document.querySelectorAll("template")[0];

  // Get the div element from the template
  let followersElement = template.content.querySelector("div");

  // Create a new node based on the template
  let followersNode = document.importNode(followersElement, true);

  return followersNode;
}
