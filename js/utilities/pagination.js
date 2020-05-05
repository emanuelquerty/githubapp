// -----------------------------------------------------------
// Class that takes care of fetching users and
// updating the next url for the users to be fetched
// with the url parsed from the Link header for pagination
// -----------------------------------------------------------

class Pagination {
  constructor(url) {
    this.currUrl = url;
    this.nextUrl = ""; // Every time we make a call to the api, we use nextUrl
    this.urls = [];
    this.pageNumber = 0;
    this.lastPage = false;
    this.data = [];
  }

  getNextData() {
    let data = async () => {
      // Do not update curr url in first call ( this.nextUrl = "")
      let res = null;
      if (this.nextUrl === "") res = await fetch(this.currUrl);
      else {
        this.currUrl = this.nextUrl;
        res = await fetch(this.currUrl);
      }

      let response = await res.json();
      this.data = this.data.concat(response);

      // console.log(response);
      // If no followers of repos, return a promise with empty array
      if (response.length == 0) {
        let promise = new Promise(function (resolve, reject) {
          resolve([]);
        });
        return promise;
      }

      // Get the Link from headers
      let link = res.headers.get("Link");

      // Sometimes response returns no Link header
      // Here we just return and update the page number accordingly
      if (!link) {
        if (!this.lastPage) {
          this.pageNumber++;
        }
        this.lastPage = true;
        return this.data;
      }

      // Save the current in the urls array
      // this makes possible pagination to the previous page
      this.urls.push(this.currUrl);

      // Update page number
      this.pageNumber++;

      // Sets the last page flag to true if current results are the last results in the server
      if (this.parseLink(link) == this.nextUrl) this.lastPage = true;

      // Update the nextUrl to hold the url of the next 8 data objects
      // this makes possible pagination to the next page
      this.nextUrl = this.parseLink(link);

      // Return the data
      return response;
    };

    return data();
  }

  // Given a github Link from Link header, parses and
  // gets the url of the next 8 data objects to be fetched
  parseLink(link) {
    // Each link is a comma separed list of url and a
    // rel attribute, so we first split by comma
    let linkArray = link.split(",");

    // Now we get the element that has the rel=next
    let element = linkArray.filter((el) => el.includes('rel="next"'))[0];

    // If we're in the last page, nextUrl is not changed
    if (!element) return this.nextUrl;

    // Up to this point, element should be `<next_url>; rel="next"`;
    // Remove < and > in element
    element = element.replace(/<|>/g, "");

    // Up to this point, element should be `next_url; rel="next"`;
    // Now we get the next url
    let nextUrl = element.split(";")[0];
    return nextUrl;
  }

  // Sets the next url to be the previous url when we click the prev button
  // This makes possible to navigate back to the previous 8 data objects
  setNextUrl() {
    // If this is the first page, there is no previous page.
    if (this.urls.length == 1) return false;

    // We have at least one previous page, so we get the previous page
    let prevUrl = this.urls[this.urls.length - 2];

    // Update the page number. We decrement it by 2 because every time we fetch
    // We increment the page number by one and that's the page number we display
    this.pageNumber -= 2;

    // Remove the url of current and previous page
    // This is because everytime a call is made, we add the current url to the array
    this.urls.pop();
    this.urls.pop();

    // finally update the next url to be the previous url
    this.nextUrl = prevUrl;
    return true;
  }
}
