// -----------------------------------------------------------
// Class that takes care of fetching users and
// updating the next url for the users to be fetched
// with the url parsed from the Link header for pagination
// -----------------------------------------------------------

class Pagination {
  constructor(url) {
    this.nextUrl = url; // Every time we make a call to the api, we use nextUrl
    this.urls = [];
    this.pageNumber = 0;
  }

  getNextData() {
    let data = async () => {
      let res = await fetch(this.nextUrl);

      // Get the Link from headers
      let link = res.headers.get("Link");

      // Save the current in the urls array
      // this makes possible pagination to the previous page
      this.urls.push(this.nextUrl);

      // Update the nextUrl to hold the url of the next 8 data objects
      // this makes possible pagination to the next page
      this.nextUrl = this.parseLink(link);

      // Update the page number
      this.pageNumber++;

      // Return the data
      return await res.json();
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
    let element = linkArray.filter(el => el.includes('rel="next"'))[0];

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
    // Get the url to fetch the previous 8 data objects
    // If this is the first page, we do nothing
    if (this.urls.length == 1) {
      return false;
    }

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
