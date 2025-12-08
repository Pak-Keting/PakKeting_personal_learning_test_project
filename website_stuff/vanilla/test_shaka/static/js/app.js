const video = document.getElementById("video");
const playBtn = document.getElementById("play-btn");
const volSlider = document.getElementById("volume");
const fsBtn = document.getElementById("fullscreen-btn");
const qualitySelect = document.getElementById("quality");

// Start Shaka
const player = new shaka.Player(video);

// --- Recommended live settings ---
player.configure({
  streaming: {
    lowLatencyMode: false,
    rebufferingGoal: 1,
    jumpLargeGaps: true
  },
  drm: {
    clearKeys: {
      "912760c409eb5aff3e060422c502f410": "bea2d0f89fb3fbafa1fc9f34ba8734a6"
    }
  }
});

// --- Load stream ---
async function loadStream(url) {
  try {
    await player.load(url);
    if (player.isLive()) player.seekToLive();
    populateQualityList();
  } catch (err) {
    console.error(err);
  }
}

// --- Play / pause with "resume to live edge" ---
playBtn.onclick = () => {
  if (video.paused) {
    video.play();
    if (player.isLive()) player.seekToLive();
    playBtn.textContent = "⏸️";
  } else {
    video.pause();
    playBtn.textContent = "▶️";
  }
};

// --- Volume ---
volSlider.oninput = () => {
  video.volume = volSlider.value;
};

// --- Fullscreen ---
fsBtn.onclick = () => {
  if (!document.fullscreenElement) {
    video.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// --- Quality selection ---
function populateQualityList() {
  const tracks = player.getVariantTracks();
  qualitySelect.innerHTML = "";

  // Add AUTO option
  const autoOption = document.createElement("option");
  autoOption.value = "auto";
  autoOption.textContent = "Auto";
  qualitySelect.appendChild(autoOption);

  // Add all video resolutions
  tracks
    .filter(t => t.type === "variant")
    .sort((a, b) => b.height - a.height) // highest first
    .forEach(track => {
      const opt = document.createElement("option");
      opt.value = track.id;
      opt.textContent = `${track.height}p`;
      qualitySelect.appendChild(opt);
    });
}

// Apply chosen quality
qualitySelect.onchange = () => {
  if (qualitySelect.value === "auto") {
    player.configure({ abr: { enabled: true } });
    return;
  }

  player.configure({ abr: { enabled: false } });
  const id = Number(qualitySelect.value);
  const tracks = player.getVariantTracks();
  const chosen = tracks.find(t => t.id === id);
  if (chosen) player.selectVariantTrack(chosen, /* clearBuffer= */ true);
};

// --- Load your HLS ---
loadStream("http://localhost:17009/manifest.m3u8");
