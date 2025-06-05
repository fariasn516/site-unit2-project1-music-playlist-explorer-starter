const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

const testPlaylist = {
  title: "Playlist 1",
  creator: "Nancy F.",
  imageUrl: "assets/img/playlist.png",
  songs: [
    {
      name: "Daddy Shark",
      artist: "Cocomelon",
      album: "Children's",
      duration: "2:45",
      image: "assets/img/song.png"
    }
  ]
};

function openModal(playlist) {
  document.getElementById("playlistName").textContent = playlist.title;
  document.getElementById("playlistCreator").textContent = `Created by ${playlist.creator}`;
  document.getElementById("playlistImage").src = playlist.imageUrl;

  playlist.songs.forEach(song => {
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

  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};