let items = []; 
const itemsPerPage = 5; 
let currentPage = 0;

document.getElementById("loadMoreBtn").addEventListener("click", loadItems);

function loadItems() {
  const itemContainer = document.getElementById("itemContainer");

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the items array to get the items for the current page
  const itemsToDisplay = items.slice(startIndex, endIndex);

  // Generate HTML for the items and append to the container
  let itemsHTML = "";
  for (const item of itemsToDisplay) {
    itemsHTML += `<a href="${item?.spotifyUrl}">
    <div class="item-wrapper">
      <img src="${item?.artwork}" alt="${item?.title}" />
      <div class="meta">
        <p class="title">${item?.title}</p>
        <p class="year">(${item?.year})</p>
      </div>
    </div></a>`;
  }
  itemContainer.innerHTML += itemsHTML;

  currentPage++;

  // Check if there are more items to load
  if (currentPage * itemsPerPage >= items.length) {
    document.getElementById("loadMoreBtn").style.display = "none";
  }
}

// Initial data load on page load
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    console.log(`%c ${data.status}`, 'color: white; background-color: green; padding: 10px;')
    items = data.music.releases.reverse(); // Update the global items array with new data
    loadItems(); // Initial load of items
  });