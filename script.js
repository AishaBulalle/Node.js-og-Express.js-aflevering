"use strict";

const endpoint = "http://localhost:3000/artists";
// const endpoint = "";
let artists;

window.addEventListener("load", initApp);

function initApp() {
  updateArtistsGrid(); // update the grid of posts: get and show all posts

  // event listener
  document
    .querySelector("#btn-create-artist")
    .addEventListener("click", showCreateArtistDialog);
  document
    .querySelector("#form-create-artist")
    .addEventListener("submit", createArtistClicked);
  document
    .querySelector("#form-update-artist")
    .addEventListener("submit", updateArtistClicked);
  document
    .querySelector("#form-delete-artist")
    .addEventListener("submit", deleteArtistClicked);
  document
    .querySelector("#form-delete-artist .btn-cancel")
    .addEventListener("click", deleteCancelClicked);
  document
    .querySelector("#select-sort-by")
    .addEventListener("change", sortByChanged);
}

// ============== events ============== //

function showCreateArtistDialog() {
  document.querySelector("#dialog-create-artist").showModal(); // show create dialog
}

function createArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs from the form
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  createArtist(
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription
  ); // use values to create a new post
  form.reset(); // reset the form (clears inputs)
}

function updateArtistClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs in the form
  const name = form.name.value;
  const birthdate = form.birthdate.value;
  const activeSince = form.activeSince.value;
  const genres = form.genres.value;
  const labels = form.labels.value;
  const website = form.website.value;
  const image = form.image.value;
  const shortDescription = form.shortDescription.value;
  // get id of the post to update - saved in data-id
  const id = form.getAttribute("data-id");
  updateArtist(
    id,
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription
  ); // call updatePost with arguments
}

async function deleteArtistClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  deleteArtist(id); // call deletePost with id
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-artist").close(); // close dialog
}

function sortByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "genres") {
    artists.sort(compareGenres);
  } else if (selectedValue === "labels") {
    artists.sort(compareLabels);
  }

  showArtists(artists);
}

// ============== posts ============== //

async function updateArtistsGrid() {
  artists = await getArtists();
  console.log("Artists data from server:", artists); // Add this line to check the data
  showArtists(artists);
}

// Get all posts - HTTP Method: GET
async function getArtists() {
  const response = await fetch("data.json"); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const artists = prepareData(data); // convert object of object to array of objects
  return artists; // return posts
}

function showArtists(listOfArtists) {
  const artistsContainer = document.querySelector("#artists");
  artistsContainer.innerHTML = ""; // Clear the existing content

  for (const artist of listOfArtists) {
    showArtist(artist);
  }
}

function showArtist(artistObject) {
  const html = /*html*/ `
        <article class="grid-item">
            <img src="${artistObject.image}" />
            <h3>${artistObject.name}</h3>
            <p>${artistObject.birthdate}</p>
            <p>${artistObject.activeSince}</p>
            <p>${artistObject.genres}</p>
            <p>${artistObject.labels}</p>
            <p>${artistObject.website}</p>
            
            <p>${artistObject.shortDescription}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
  document.querySelector("#artists").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts

  // add event listeners to .btn-delete and .btn-update
  document
    .querySelector("#artists article:last-child .btn-delete")
    .addEventListener("click", deleteClicked);
  document
    .querySelector("#artists article:last-child .btn-update")
    .addEventListener("click", updateClicked);

  // called when delete button is clicked
  function deleteClicked() {
    // show title of post you want to delete
    document.querySelector("#dialog-delete-artist-title").textContent =
      artistObject.name;
    // set data-id attribute of post you want to delete (... to use when delete)
    document
      .querySelector("#form-delete-artist")
      .setAttribute("data-id", artistObject.id);
    // show delete dialog
    document.querySelector("#dialog-delete-artist").showModal();
  }

  // called when update button is clicked
  function updateClicked() {
    const updateForm = document.querySelector("#form-update-artist"); // reference to update form in dialog
    updateForm.name.value = artistObject.name; // set title input in update form from post title
    updateForm.birthdate.value = artistObject.birthdate; // set body input in update form post body
    updateForm.activeSince.value = artistObject.activeSince; // set image input in update form post image
    updateForm.genres.value = artistObject.genres; // set image input in update form post image
    updateForm.labels.value = artistObject.labels; // set image input in update form post image
    updateForm.website.value = artistObject.website; // set image input in update form post image
    updateForm.image.value = artistObject.image; // set image input in update form post image
    updateForm.shortDescription.value = artistObject.shortDescription; // set image input in update form post image
    updateForm.setAttribute("data-id", artistObject.id); // set data-id attribute of post you want to update (... to use when update)
    document.querySelector("#dialog-update-artist").showModal(); // show update modal
  }
}

// Create a new post - HTTP Method: POST
async function createArtist(
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  image,
  shortDescription
) {
  const newArtist = {
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription,
  };

  const response = await fetch("http://localhost:3000/artists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newArtist),
  });

  if (response.ok) {
    console.log("New artist successfully added.");
    // Update client-side data with the new artist
    artists.push(newArtist);
    // Refresh the display
    showArtists(artists);
  } else {
    console.error(
      "Error creating artist:",
      response.status,
      response.statusText
    );
  }
}

// Update an existing post - HTTP Method: DELETE
async function deleteArtist(id) {
  const response = await fetch(`http://localhost:3000/artists/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("Artist successfully deleted.");
    // Update client-side data by removing the deleted artist
    artists = artists.filter((artist) => artist.id !== id);
    // Refresh the display
    showArtists(artists);
  } else {
    console.error(
      "Error deleting artist:",
      response.status,
      response.statusText
    );
  }
}

// Delete an existing post - HTTP Method: PUT
async function updateArtist(
  id,
  name,
  birthdate,
  activeSince,
  genres,
  labels,
  website,
  image,
  shortDescription
) {
  const artistToUpdate = {
    id,
    name,
    birthdate,
    activeSince,
    genres,
    labels,
    website,
    image,
    shortDescription,
  }; // post update to update
  const json = JSON.stringify(artistToUpdate); // convert the JS object to JSON string
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch("data.json", {
    method: "PUT",
    body: json,
  });
  // check if response is ok - if the response is successful

  if (response.ok) {
    console.log("Post succesfully updated in Firebase 🔥");
    updateArtistsGrid(); // update the post grid to display all posts and the new post
  }
}

// ============== helper function ============== //
function prepareData(dataObject) {
  const array = Object.values(dataObject); // Convert the object values to an array
  return array; // return the array of artists
}

function compareGenres(artist1, artist2) {
  return artist1.genres.localeCompare(artist2.genres);
}

function compareLabels(artist1, artist2) {
  return artist1.labels.localeCompare(artist2.labels);
}
