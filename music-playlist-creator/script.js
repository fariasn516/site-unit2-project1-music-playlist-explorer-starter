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
    <p>by ${playlist.playlist_author}</p>
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
    const unlikedBtn = document.createElement("button");
    unlikedBtn.className = "like-button";
    unlikedBtn.textContent = "♡ ";
    unlikedBtn.dataset.liked = "false";

    unlikedBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikeFeature(unlikedBtn, likeCount, playlist);
    });

    likeButton.replaceWith(unlikedBtn);
  } else {
    playlist.likes++;
    const likedBtn = document.createElement("button");
    likedBtn.className = "like-button";
    likedBtn.dataset.liked = "true";

    const likedImg = document.createElement("img");
    likedImg.src = "assets/img/liked.png";
    likedImg.alt = "Liked Icon";
    likedImg.style.width = "20px";
    likedImg.style.height = "20px";
    likedImg.className = "liked-icon"

    likedBtn.appendChild(likedImg);

    likedBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikeFeature(likedBtn, likeCount, playlist);
    });

    likeButton.replaceWith(likedBtn);
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

function renderFilteredPlaylists(filteredList) {
  playlistCards.innerHTML = "";
  filteredList.forEach(playlist => createPlaylistCard(playlist));
}

loadPlaylists();