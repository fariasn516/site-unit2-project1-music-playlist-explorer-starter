const modal = document.getElementById("playlistModal");
const span = document.getElementsByClassName("close")[0];

const testPlaylist = {
  title: "Playlist 1",
  creator: "Nancy F.",
  imageUrl: "assets/img/playlist.png",
  songs: ["Rainy Afternoon", "Coffee Break", "Soft Focus"]
};

function openModal(playlist) {
  document.getElementById("playlistName").textContent = playlist.title;
  document.getElementById("playlistCreator").textContent = `by ${playlist.creator}`;
  document.getElementById("playlistImage").src = playlist.imageUrl;

  const playlistSongs = document.getElementById("playlistSongs");
  playlistSongs.innerHTML = ""; 
  playlist.songs.forEach(song => {
    const li = document.createElement("li");
    li.textContent = song;
    playlistSongs.appendChild(li);
  });

  modal.style.display = "block";
}

span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
};