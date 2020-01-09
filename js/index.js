$(".top-nav__search-item").click(() => {
  //   alert("clicked");
  $(".side-navbar").addClass("slide-from-left");
  $(".side-navbar__big-shadow--onVisible").show();
});

// Close the sidebar and hide shadow when user clicks anywhere outside of it
$(".side-navbar__big-shadow--onVisible").click(() => {
  $(".side-navbar__big-shadow--onVisible").hide();
  $(".side-navbar").toggleClass("slide-from-left");
});

// Close the sidebar and hide shadow when user clicks the close icon
$(".side-navbar__close-icon").click(() => {
  $(".side-navbar__big-shadow--onVisible").hide();
  $(".side-navbar").toggleClass("slide-from-left");
});
