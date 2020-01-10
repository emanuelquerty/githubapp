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
