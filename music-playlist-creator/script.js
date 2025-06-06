const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];
const playlistCards = document.getElementById("playlist-cards");
const playlistSongs = document.getElementById("playlistSongs");
const likeIcon = document.getElementsByClassName("likeIcon")
const shuffleButton = document.getElementById("shuffleButton");
let playlists = [];

function loadPlaylists() {
  fetch("data/data.json")
    .then(response => response.json())
    .then(data => {
      // this is for current session data to add, delete, and edit
      playlists = data;
      playlists.forEach(playlist => createPlaylistCard(playlist));
    });
};

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

function createLikeFeature(playlist, card) {
  const likeContainer = document.createElement("section");
  likeContainer.className = "like-container";

  const likeIcon = document.createElement("button");
  likeIcon.className = "like-button";
  likeIcon.textContent = "♡ ";
  likeIcon.dataset.liked = "false";

  const likeCount = document.createElement("span");
  likeCount.className = "like-count";
  likeCount.textContent = playlist.likes;

  likeContainer.appendChild(likeIcon);
  likeContainer.appendChild(likeCount);

  card.querySelector(".playlist-card-text").appendChild(likeContainer);

  likeIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    handleLikeFeature(likeIcon, likeCount, playlist);
  });
}

function handleLikeFeature(likeButton, likeCount, playlist) {
  const isLiked = likeButton.dataset.liked === "true";

  if (isLiked) {
    playlist.likes--;
    const unlikedButton = document.createElement("button");
    unlikedButton.className = "like-button";
    unlikedButton.textContent = "♡ ";
    unlikedButton.dataset.liked = "false";

    unlikedButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikeFeature(unlikedButton, likeCount, playlist);
    });

    likeButton.replaceWith(unlikedButton);
  } else {
    playlist.likes++;
    const likedButton = document.createElement("button");
    likedButton.className = "like-button";
    likedButton.dataset.liked = "true";

    const likedImg = document.createElement("img");
    likedImg.src = "assets/img/liked.png";
    likedImg.alt = "Liked Icon";
    likedImg.style.width = "20px";
    likedImg.style.height = "20px";
    likedImg.className = "liked-icon"

    likedButton.appendChild(likedImg);

    likedButton.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikeFeature(likedButton, likeCount, playlist);
    });

    likeButton.replaceWith(likedButton);
  }

  likeCount.textContent = playlist.likes;
}

function handleDeletePlaylist(playlist, card) {
  const deleteButton = card.querySelector(".delete-playlist-button");
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    playlists = playlists.filter(p => p.playlistID !== playlist.playlistID);
    card.remove();
  });
}

function openModal(playlist) {
  document.getElementById("playlistName").textContent = playlist.playlist_name;
  document.getElementById("playlistCreator").textContent = `Created by ${playlist.playlist_author}`;
  document.getElementById("playlistImage").src = playlist.playlist_art;

  renderSongs(playlist.songs);
  setupShuffleButton(playlist);

  modal.style.display = "block";
}

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

function setupShuffleButton(playlist) {
  const shuffleButton = document.getElementById("shuffleButton");
  shuffleButton.onclick = () => {
    playlist.songs = shuffleSongList(playlist.songs);
    renderSongs(playlist.songs);
  };
}

// Fisher-Yates shuffle algorithm -> https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffleSongList(songs) {
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  return songs;
}


span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function handleSearching(query) {
  const reaffirmLower = query.toLowerCase();
  const filteredPlaylists = playlists.filter(playlist =>
    playlist.playlist_name.toLowerCase().includes(reaffirmLower) ||
    playlist.playlist_author.toLowerCase().includes(reaffirmLower)
  );
  renderFilteredPlaylists(filteredPlaylists);
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  handleSearching(e.target.value);
});

document.getElementById("searchInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault(); 
    return false;     
  }
});

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

function renderFilteredPlaylists(filteredList) {
  playlistCards.innerHTML = "";
  filteredList.forEach(playlist => createPlaylistCard(playlist));
}

loadPlaylists();