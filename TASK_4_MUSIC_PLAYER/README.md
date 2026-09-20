# SonicPulse - Modern Web Music Player

**CodSoft Frontend Development Internship — Task 4**  
*A sleek, modern music player featuring native HTML5 Audio API, animated disc showcase, responsive playlists, audio scrubbing, and keyboard controls.*

---

## 🚀 Overview

**SonicPulse** is an interactive, browser-based media player built with semantic HTML5, modern CSS3, and vanilla JavaScript. It delivers a rich, desktop-and-mobile responsive listening experience with animated visualizer waves, dynamic ambient gradients, track favoriting, and persistent playback settings.

---

## ✨ Features Checklist

### Official Required Features
- [x] **Modern Music Player Interface:** Sleek glassmorphism with rotating vinyl animation and dynamic ambient lighting.
- [x] **Play & Pause Controls:** Smooth playback toggling with spacebar support.
- [x] **Next & Previous Controls:** Seamless playlist navigation with smart track rewind on previous.
- [x] **Display Song Title & Artist:** Prominently showcased with album information.
- [x] **Album Artwork:** Custom high-resolution SVG artwork for each track.
- [x] **Duration & Time Display:** Formatted elapsed time (`mm:ss`) and total track duration.
- [x] **Progress Bar with Seek:** Interactive rail with smooth drag and click seeking.
- [x] **Volume Control:** Slider with fine-grained level adjustment.
- [x] **Mute Option:** Instant mute/unmute toggle.
- [x] **Automatic Time Updates:** Real-time progress updates synced with the native `timeupdate` event.
- [x] **Responsive Desktop Layout:** Dual-column view (now playing card + playlist queue).
- [x] **Responsive Mobile Layout:** Compact, touch-friendly mobile layout with drawer navigation.

### Bonus Features Implemented
- [x] **Multiple Playlists:** Categorized queues including *All Tracks*, *Favorites*, *Chill / Lo-Fi*, and *Electronic*.
- [x] **Shuffle Mode:** Randomized track sequencing without repetitive immediate plays.
- [x] **Repeat Mode:** Multi-state repeat (*Off*, *Repeat All*, *Repeat One*).
- [x] **Autoplay Support:** Automatic next-track playback on song completion with user toggle.
- [x] **Favorite Songs Functionality:** One-click favoriting with heart toggle and dedicated Favorites view.
- [x] **Local Storage Persistence:** Remembers Favorites, Volume level, Mute state, Shuffle, Repeat, and Autoplay preferences.

---

## 📁 File Structure

```
TASK_4_MUSIC_PLAYER/
├── index.html            # Semantic markup, audio player interface, playlist
├── css/
│   └── style.css         # Glassmorphism, animations, responsive layouts
├── js/
│   └── script.js         # HTML5 Audio controller, playlists, local storage
├── assets/
│   ├── audio/            # Royalty-free synthesized 16-bit demo tracks (.wav)
│   │   ├── neon_horizon.wav
│   │   ├── lofi_study.wav
│   │   ├── cyber_pulse.wav
│   │   └── midnight_rain.wav
│   └── images/           # Custom SVG album covers
│       ├── neon_horizon.svg
│       ├── lofi_study.svg
│       ├── cyber_pulse.svg
│       └── midnight_rain.svg
└── README.md             # Project documentation
```

---

## 🛠️ How to Run

1. Open `TASK_4_MUSIC_PLAYER/index.html` in your web browser.
2. Or serve via any local static server:
   ```bash
   # Python 3
   python -m http.server 3000
   ```
3. Navigate to `http://localhost:3000/TASK_4_MUSIC_PLAYER/index.html`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| **Space** | Play / Pause |
| **Arrow Right** | Seek Forward 5 seconds |
| **Arrow Left** | Seek Backward 5 seconds |
| **Arrow Up** | Increase Volume (+5%) |
| **Arrow Down** | Decrease Volume (-5%) |
| **M** | Toggle Mute |
| **N** | Next Track |
| **P** | Previous Track |
