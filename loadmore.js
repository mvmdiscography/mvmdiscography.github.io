let items = [];
let currentPage = 0;
// const itemsPerPage = 5;

// Function to update itemsPerPage based on viewport size
function updateItemsPerPage() {
  if (window.innerWidth < 768) {
    itemsPerPage = 4;
  }
  else if (window.innerWidth > 700 &&  window.innerWidth < 1024) {
    itemsPerPage = 3;
  } 
  else if (window.innerWidth > 1024 &&  window.innerWidth < 1651) {
    itemsPerPage = 4;
  } 
  else {
    itemsPerPage = 5;
  }
}

// Initial update based on the current viewport size
updateItemsPerPage();

// Add a resize event listener to update itemsPerPage when the viewport size changes
window.addEventListener('resize', updateItemsPerPage);

const buttonContainer = document.querySelector(".buttonContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const loadingMessage = document.getElementById("loadingMessage");
loadMoreBtn.addEventListener("click", loadItems);

function showLoadingMessage() {
    loadingMessage.style.display = "block";
}

function hideLoadingMessage() {
    loadingMessage.style.display = "none";
}

// Function to load items after preloading images
function loadItems() {

    showLoadingMessage();

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
    hideLoadingMessage();

    // Scroll to the position of the "Load More" button after loading items if the viewport is larger than 767px
    if (currentPage !== 0) {
      setTimeout(() => {
        if (window.innerWidth > 480) {
          buttonContainer.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }

    // Increment the current page
    currentPage++;

    // Check if there are more items to load
    if (currentPage * itemsPerPage >= items.length) {
        document.getElementById("loadMoreBtn").style.display = "none";
    }

}

// Initial data load on page load
fetch("https://mvmapi.olk1.com/albums")
    .then(response => response.json())
    .then(data => {
        console.log(`%c ${data.status}`, 'color: white; background-color: green; padding: 10px;');
        items = data.reverse(); // Update the global items array with new data
        loadItems(); // Initial load of items
    });
