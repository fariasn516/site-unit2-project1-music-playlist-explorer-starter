const featuredPlaylistImage = document.getElementById("featuredPlaylistImage");
const featuredPlaylistName = document.getElementById("featuredPlaylistName");
const featuredPlaylistSongs = document.getElementById("featuredPlaylistSongs");

// Fetch data from json
fetch("data/data.json")
  .then(response => response.json())
  .then(playlists => {
    renderFeaturedPlaylist(loadRandomPlaylist(playlists));
  })

// Load the randomly chosen playlist
function loadRandomPlaylist(playlists) {
  return playlists[Math.floor(Math.random() * playlists.length)];
}

// Display the chosen playlist
function renderFeaturedPlaylist(playlist) {
  featuredPlaylistImage.src = playlist.playlist_art;
  featuredPlaylistImage.alt = playlist.playlist_name;
  featuredPlaylistName.textContent = playlist.playlist_name;
  renderFeaturedSongs(playlist.songs);
}

// Display songs under chosen playlist
function renderFeaturedSongs(songs) {
  featuredPlaylistSongs.innerHTML = "";
  songs.forEach(song => {
    const songCard = document.createElement("li");
    songCard.className = "featured-song-card";
    songCard.innerHTML = `
      <img src="${song.image}" alt="${song.name}" />
      <div class="featured-song-card-text">
        <h3>${song.name}</h3>
        <p>${song.artist}</p>
        <p>${song.album}</p>
        <p>${song.duration}</p>
      </div>
    `;
    featuredPlaylistSongs.appendChild(songCard);
  });
}
