function showRepositories(repos_url) {
  let pagination = new Pagination(`${repos_url}?per_page=8`);
  let data = pagination.getNextData();

  data.then(res => {
    console.log(res);
    displayRepositories(res, pagination.pageNumber);
    $(".main-nav__followers").removeClass("main-nav__link--active");
    $(".main-nav__repos").addClass("main-nav__link--active");

    // Show next data when user presses next button
    $(".repos-page .prev-next-container__next-btn").click(() => {
      // Do not fetch more results if current results are the last ones
      if (pagination.lastPage) return;

      data = pagination.getNextData();
      data.then(repos => {
        displayRepositories(repos, pagination.pageNumber);
      });
    });

    // Show previous data when user presses next button
    $(".repos-page .prev-next-container__prev-btn").click(() => {
      // Sef last page flag to false
      pagination.lastPage = false;

      if (pagination.setNextUrl()) {
        data = pagination.getNextData();
        data.then(repos => {
          displayRepositories(repos, pagination.pageNumber);
        });
      }
    });
  });
}
//----------------------------------------------------
// Creating the repositories nodes and adding it to the DOM
//----------------------------------------------------

// Display all repositories
function displayRepositories(repositories, pageNumber) {
  let table = createTableHeaderRowFromTemplate();

  let docFrag = document.createDocumentFragment();
  for (let i = 0; i < repositories.length; i++) {
    const { name, created_at } = repositories[i];

    // Parse the date
    let date = new Date(created_at);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let dateStr = `${month}/${day}/${year}`;

    let row = createTableDataRowFromTemplate();
    row.querySelector(".name").innerHTML = name;
    row.querySelector(".created_at").innerHTML = dateStr;

    docFrag.appendChild(row);
  }
  table.appendChild(docFrag);

  // Insert Table in the DOM
  $(".page2").html("");
  $(".page2").append(table);
  $(".current-page").html(pageNumber);
}

// Create a table header row node
function createTableHeaderRowFromTemplate() {
  // Get the template
  let template = document.querySelectorAll("template")[2];

  // Create table element from template
  let tableElement = template.content.querySelector("table");

  // Create Node from tableElement
  let tableNode = document.importNode(tableElement, true);

  return tableNode;
}
// Creates a table data row node
function createTableDataRowFromTemplate() {
  // Get the template
  let template = document.querySelectorAll("template")[3];

  // Create table element from template
  let tableElement = template.content.querySelector("tr");

  // Create Node from tableElement
  let tableNode = document.importNode(tableElement, true);

  return tableNode;
}
