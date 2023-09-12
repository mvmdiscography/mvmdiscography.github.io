let items = [];
const itemsPerPage = 5;
let currentPage = 0;

const buttonContainer = document.querySelector(".buttonContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const loadingMessage = document.getElementById("loadingMessage");
loadMoreBtn.addEventListener("click", loadItems);

function preloadImages(urls, callback) {
    var loadedImages = 0;
    var totalImages = urls.length;

    urls.forEach(function(url) {
        var img = new Image();
        img.onload = function() {
            loadedImages++;
            if (loadedImages === totalImages) {
                callback();
            }
        };
        img.src = url;
    });
}

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

    // Add image URLs to preload
    const imageUrlsToPreload = itemsToDisplay.map(item => item.artwork);

    // Preload images and then update the container
    preloadImages(imageUrlsToPreload, function() {
        itemContainer.innerHTML += itemsHTML;
        hideLoadingMessage();

        // Scroll to the position of the "Load More" button after loading items
        setTimeout(() => {
            buttonContainer.scrollIntoView({ behavior: "smooth" });
        }, 100);


        // Increment the current page
        currentPage++;

        // Check if there are more items to load
        if (currentPage * itemsPerPage >= items.length) {
            document.getElementById("loadMoreBtn").style.display = "none";
        }
    });
}

// Initial data load on page load
fetch("https://mvmdiscography.github.io/data.json")
    .then(response => response.json())
    .then(data => {
        console.log(`%c ${data.status}`, 'color: white; background-color: green; padding: 10px;');
        items = data.music.releases.reverse(); // Update the global items array with new data
        loadItems(); // Initial load of items
    });
