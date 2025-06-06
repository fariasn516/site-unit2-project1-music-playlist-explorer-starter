const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];
const playlistCards = document.getElementById("playlist-cards");
const playlistSongs = document.getElementById("playlistSongs");
const likeIcon = document.getElementsByClassName("likeIcon")
const shuffleButton = document.getElementById("shuffleButton");
const searchInput = document.getElementById("searchInput");
let playlists = [];

// Load all playlists from the JSON file and render them to the page
function loadPlaylists() {
  fetch("data/data.json")
    .then(response => response.json())
    .then(data => {
      playlists = data;
      playlists.forEach(playlist => createPlaylistCard(playlist));
    });
};

// Create the HTML structure for a single playlist card
function createPlaylistCard(playlist) {
  const card = document.createElement("article");
  card.className = "playlist-card";
  card.onclick = () => openModal(playlist);
  card.innerHTML = `
  <div class="playlist-cover-container">
    <img src="${playlist.playlist_art}" alt="${playlist.playlist_name} Cover" />
    <button class="delete-playlist-button">&times;</button>
  </div>
  <div class="playlist-card-text">
    <h3>${playlist.playlist_name}</h3>
    <p class="creator">by ${playlist.playlist_author}</p>
    <p class="date-added">added on ${playlist.dateAdded}</p>
  </div>
  `;

  createLikeFeature(playlist, card)
  handleDeletePlaylist(playlist, card);
  playlistCards.appendChild(card);
}

// Adds the like button and logic to a playlist card
function createLikeFeature(playlist, card) {
  const likeContainer = document.createElement("section");
  likeContainer.className = "like-container";

  const likeButton = document.createElement("button");
  likeButton.className = "like-button";
  likeButton.textContent = "♡ ";
  likeButton.dataset.liked = "false";
  const likeCount = document.createElement("span");
  likeCount.className = "like-count";
  likeCount.textContent = playlist.likes;
  likeContainer.appendChild(likeButton);
  likeContainer.appendChild(likeCount);

  card.querySelector(".playlist-card-text").appendChild(likeContainer);

  likeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    handleLikeFeature(likeButton, likeCount, playlist);
  });
}

// Change the like state for a playlist and update the UI accordingly
function handleLikeFeature(button, likeCount, playlist) {
  const isLiked = button.dataset.liked === "true";
  playlist.likes += isLiked ? -1 : 1;
  const newButton = isLiked
    ? createUnlikedButton(likeCount, playlist)
    : createLikedButton(likeCount, playlist);
  button.replaceWith(newButton);
  likeCount.textContent = playlist.likes;
}

// Creates an unliked button
function createUnlikedButton(likeCount, playlist) {
  const button = document.createElement("button");
  button.className = "like-button";
  button.textContent = "♡ ";
  button.dataset.liked = "false";

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    handleLikeFeature(button, likeCount, playlist);
  });

  return button;
}

// Creates a filled heart image button
function createLikedButton(likeCount, playlist) {
  const likedButton = document.createElement("button");
  likedButton.className = "like-button";
  likedButton.dataset.liked = "true";

  const redHeart = document.createElement("img");
  redHeart.src = "assets/img/liked.png";
  redHeart.alt = "Liked Icon";
  redHeart.style.width = "20px";
  redHeart.style.height = "20px";
  likedButton.appendChild(redHeart);

  likedButton.addEventListener("click", (e) => {
    e.stopPropagation();
    handleLikeFeature(likedButton, likeCount, playlist);
  });

  return likedButton;
}

// Handle deleting a playlist from the list and the UI
function handleDeletePlaylist(playlist, card) {
  const deleteButton = card.querySelector(".delete-playlist-button");
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    playlists = playlists.filter(p => p.playlistID !== playlist.playlistID);
    card.remove();
  });
}

// Open the modal and display playlist songs + info
function openModal(playlist) {
  document.getElementById("playlistName").textContent = playlist.playlist_name;
  document.getElementById("playlistCreator").textContent = `Created by ${playlist.playlist_author}`;
  document.getElementById("playlistImage").src = playlist.playlist_art;
  renderSongs(playlist.songs);
  setupShuffleButton(playlist);
  modal.style.display = "block";
}

// Render all songs in a playlist inside the modal
function renderSongs(songs) {
  playlistSongs.innerHTML = "";
  songs.map(song => {
    const songCard = document.createElement("li");
    songCard.className = "song-card";
    songCard.innerHTML = `
      <img src="${song.image}" alt="${song.name} Cover" class="song-image" />
      <div class="song-general">
    <p class="song-title">${song.name}</p>
    <div class="song-details">
      <p class="song-artist">${song.artist}</p>
      <p class="song-album">${song.album}</p>
    </div>
  </div>
  <div class="song-duration">
    <span>${song.duration}</span>
  </div>
    `;
    playlistSongs.appendChild(songCard);
  });
}

// Create shuffle button so that songs get randomly reordered
function setupShuffleButton(playlist) {
  const shuffleButton = document.getElementById("shuffleButton");
  shuffleButton.onclick = () => {
    playlist.songs = shuffleSongList(playlist.songs);
    renderSongs(playlist.songs);
  };
}

// Fisher-Yates shuffle: randomly reorder the songs array -> https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffleSongList(songs) {
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  return songs;
}

// Close modal when 'X' is clicked
span.onclick = function () {
  modal.style.display = "none";
}

// Close modal if user clicks outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Filter and show playlists based on search query
function handleSearching(query) {
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.playlist_name.toLowerCase().includes(query) ||
    playlist.playlist_author.toLowerCase().includes(query)
  );
  renderFilteredPlaylists(filteredPlaylists);
}

// Handle buttons for search
document.getElementById("searchBar").addEventListener("submit", function (e) {
  e.preventDefault();
  handleSearching(searchInput.value.toLowerCase());
});

document.getElementById("clearSearch").addEventListener("click", () => {
  searchInput.value = "";
  renderFilteredPlaylists(playlists);
});

// Handle sorting logic when dropdown option is selected
function handleSort(optionSelected) {
  if (optionSelected === "name") {
    playlists.sort((playlist1, playlist2) => playlist1.playlist_name.localeCompare(playlist2.playlist_name));
  } else if (optionSelected === "likes") {
    playlists.sort((playlist1, playlist2) => playlist2.likes - playlist1.likes);
  } else if (optionSelected === "date") {
    playlists.sort((playlist1, playlist2) => new Date(playlist2.dateAdded) - new Date(playlist1.dateAdded));
  }

  renderFilteredPlaylists(playlists);
}

document.getElementById("sortOptions").addEventListener("change", (e) => {
  handleSort(e.target.value);
});

// Renders a list of playlists to the page (used after filtering/sorting)
function renderFilteredPlaylists(filteredList) {
  playlistCards.innerHTML = "";
  filteredList.forEach(playlist => createPlaylistCard(playlist));
}

// Load everything on page load
loadPlaylists();