let username = window.location.href.split("=")[1];
let url = `https://api.github.com/users/${username}`;

// This method fetchs all users from the github api
async function getData(url) {
  let res = await fetch(url);
  return await res.json();
}
getData(url).then(res => {
  const { name, followers, public_repos, followers_url, repos_url } = res;
  // console.log(res);

  $(".main__user-fullname").html(name);
  $(".followers-count").html(`(${followers})`);
  $(".repos-count").html(`(${public_repos})`);

  // Show Followers Page when page loads
  showFollowers(followers_url);

  // Show Followers page when user clicks followers
  $(".main-nav__followers").click(() => {
    window.location.href = `./user-info.html?username=${username}`;
  });

  // Show the Repositories page when user clicks repositories
  $(".main-nav__repos").click(event => {
    event.preventDefault(); // Prevent url refreshing

    $(".followers-page").hide();
    $(".repos-page").show();
    showRepositories(repos_url);
  });
});
