$(".top-nav__search-item").click(() => {
  //   alert("clicked");
  $(".side-navbar").addClass("slide-from-left");
  $(".side-navbar__big-shadow--onVisible").show();
});

// Close the sidebar and hide shadow when user clicks anywhere outside of it
$(".side-navbar__big-shadow--onVisible").click(() => {
  $(".side-navbar__big-shadow--onVisible").hide();
  $(".side-navbar").toggleClass("slide-from-left");

  // Clear search results
  $(".side-navbar__results").html("");
  $("#side-navbar__search-input").val("");
});

// Close the sidebar and hide shadow when user clicks the close icon
$(".side-navbar__close-icon").click(() => {
  $(".side-navbar__big-shadow--onVisible").hide();
  $(".side-navbar").toggleClass("slide-from-left");

  // Clear search results
  $(".side-navbar__results").html("");
  $("#side-navbar__search-input").val("");
});

// Search for a user from github directory
$(".search-user-btn").click(function(event) {
  event.preventDefault(); // prevent refreshing the page on clicking the <a/> btn
  let selectedOption = $("#side-navbar__select").val();
  let searchQuery = $("#side-navbar__search-input").val();

  // console.log(selectedOption);

  // Here we search from all users in github db
  if (selectedOption == "all-users") {
    let data = getData(`https://api.github.com/users/${searchQuery}`);
    data.then(res => {
      // If no results, show no results
      if (res.message == "Not Found") {
        displayUserNotFound();
      } else {
        displayUserFound(res.avatar_url, res.login);
      }
    });
  } else {
    // Here we search from the pages we've fetched so far
    let targetData = null;
    let length = pagination.data.length;
    for (let i = 0; i < length; i++) {
      const { avatar_url, login } = pagination.data[i];
      if (searchQuery === login) {
        displayUserFound(avatar_url, login);
        return;
      }
    }

    // User was not found in the pages we've fetched from server so far
    displayUserNotFound();
  }
});

function displayUserFound(avatar_url, login) {
  let userContainer = populateUserContainerNode(avatar_url, login);
  // Clearn search results and append the results
  $(".side-navbar__results").html("");
  $(".side-navbar__results").append(userContainer);

  // Show a new page with users followers and repos
  let username = "";
  $(".user-container__more-info").click(event => {
    username = event.target.id;
    window.location.href = `./user-info.html?username=${username}`;
  });
}

function displayUserNotFound() {
  // Clearn search results
  $(".side-navbar__results").html("");
  $(".side-navbar__results").html(
    `<p class="not-found-result"> No user with given username found</p>`
  );
}

async function getData(url) {
  let res = await fetch(url);
  return await res.json();
}
