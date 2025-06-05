const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];
const playlistCards = document.getElementById("playlist-cards");
const playlistSongs = document.getElementById("playlistSongs");
const likeIcon = document.getElementsByClassName("likeIcon")


function loadPlaylists() {
  fetch("data/data.json")
    .then(response => response.json())
    .then(playlists => {
      // need to add error catcher after !!!!!!!!!!!!!
      playlists.map(playlist => createPlaylistCard(playlist))
    });
};

function createPlaylistCard(playlist) {
  const card = document.createElement("article");
  card.className = "playlist-card";
  card.onclick = () => openModal(playlist);

  card.innerHTML = `
    <img src="${playlist.playlist_art}" alt="${playlist.playlist_name}" />
    <div class="playlist-card-text">
      <h3>${playlist.playlist_name}</h3>
      <p>by ${playlist.playlist_author}</p>
    </div>
  `;

  createLikeFeature(playlist, card)

  playlistCards.appendChild(card);
}

function createLikeFeature(playlist, card) {
  const likeContainer = document.createElement("p");
  likeContainer.className = "like-container";

  const likeIcon = document.createElement("span");
  likeIcon.className = "like-icon";
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

function handleLikeFeature(likeIcon, likeCount, playlist) {
  const isLiked = likeIcon.dataset.liked === "true";

  if (isLiked) {
    playlist.likes--;
    
    const likedString = document.createElement("span");
    likedString.textContent = "♡ ";
    likedString.className = "like-icon";
    likedString.dataset.liked = "false";

    likedString.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikeFeature(likedString, likeCount, playlist);
    });

    likeIcon.replaceWith(likedString);

  } else {
    playlist.likes++;

    const likedImg = document.createElement("img");
    likedImg.src = "assets/img/liked.png";
    likedImg.alt = "Liked Icon";
    // CHANGE THIS TO CSS
    likedImg.style.width = "20px";
    likedImg.style.height = "20px";
    likedImg.className = "like-icon";
    likedImg.dataset.liked = "true";

    likedImg.addEventListener("click", (e) => {
      e.stopPropagation();
      handleLikeFeature(likedImg, likeCount, playlist);
    });

    likeIcon.replaceWith(likedImg);
  }

  likeCount.textContent = playlist.likes;
  console.log(`Updated playlist "${playlist.playlist_name}" likes:`, playlist.likes);
}

function openModal(playlist) {
  document.getElementById("playlistName").textContent = playlist.playlist_name;
  document.getElementById("playlistCreator").textContent = `Created by ${playlist.playlist_author}`;
  document.getElementById("playlistImage").src = playlist.playlist_art;

  renderSongs(playlist.songs);

  modal.style.display = "block";
}


function renderSongs(songs) {
  playlistSongs.innerHTML = "";

  songs.map(song => {
    const songCard = document.createElement("li");
    songCard.className = "song-card";
    songCard.innerHTML = `
      <img src="${song.image}" alt="${song.name}" class="song-image" />
      <div class="song-details">
        <h3>${song.name}</h3>
        <p>${song.artist}</p>
        <p>${song.album}</p>
        <p>${song.duration}</p>
      </div>
    `;
    playlistSongs.appendChild(songCard);
  });
}


span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};


loadPlaylists();