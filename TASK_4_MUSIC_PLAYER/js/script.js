/**
 * SonicPulse - CodSoft Task 4 Music Player
 * Native HTML5 Audio API with Playlists, Shuffle, Repeat,
 * Seekable Progress, Volume Control, Autoplay, and Favorites.
 */

(function () {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_FAVORITES = 'codsoft_music_favorites';
    const STORAGE_KEY_VOLUME = 'codsoft_music_volume';
    const STORAGE_KEY_MUTED = 'codsoft_music_muted';
    const STORAGE_KEY_SHUFFLE = 'codsoft_music_shuffle';
    const STORAGE_KEY_REPEAT = 'codsoft_music_repeat';
    const STORAGE_KEY_AUTOPLAY = 'codsoft_music_autoplay';

    // --- Song Catalog ---
    const trackCatalog = [
        {
            id: 'track_1',
            title: 'Neon Horizon',
            artist: 'Synthwave Dreams',
            album: 'Retrowave 80s Vol. 1',
            genre: 'electronic',
            artwork: 'assets/images/neon_horizon.svg',
            audioSrc: 'assets/audio/neon_horizon.wav',
            duration: 24,
            themeColors: {
                primary: '#6366f1',
                gradient: 'radial-gradient(circle at 30% 20%, rgba(255, 0, 127, 0.25), transparent 45%), radial-gradient(circle at 75% 65%, rgba(0, 242, 254, 0.2), transparent 50%)'
            }
        },
        {
            id: 'track_2',
            title: 'Lo-Fi Study Beats',
            artist: 'Chillhop Cafe',
            album: 'Midnight Coffee Sessions',
            genre: 'chill',
            artwork: 'assets/images/lofi_study.svg',
            audioSrc: 'assets/audio/lofi_study.wav',
            duration: 24,
            themeColors: {
                primary: '#a855f7',
                gradient: 'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.25), transparent 45%), radial-gradient(circle at 75% 65%, rgba(251, 191, 36, 0.18), transparent 50%)'
            }
        },
        {
            id: 'track_3',
            title: 'Cyber Pulse',
            artist: 'Neo Tokyo 2077',
            album: 'Cybernetic Overdrive',
            genre: 'electronic',
            artwork: 'assets/images/cyber_pulse.svg',
            audioSrc: 'assets/audio/cyber_pulse.wav',
            duration: 24,
            themeColors: {
                primary: '#00f2fe',
                gradient: 'radial-gradient(circle at 30% 20%, rgba(0, 242, 254, 0.25), transparent 45%), radial-gradient(circle at 75% 65%, rgba(255, 0, 127, 0.22), transparent 50%)'
            }
        },
        {
            id: 'track_4',
            title: 'Midnight Rain',
            artist: 'Acoustic Escape',
            album: 'Peaceful Stormscapes',
            genre: 'chill',
            artwork: 'assets/images/midnight_rain.svg',
            audioSrc: 'assets/audio/midnight_rain.wav',
            duration: 24,
            themeColors: {
                primary: '#38bdf8',
                gradient: 'radial-gradient(circle at 30% 20%, rgba(56, 189, 248, 0.25), transparent 45%), radial-gradient(circle at 75% 65%, rgba(148, 163, 184, 0.15), transparent 50%)'
            }
        }
    ];

    // --- State Variables ---
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 'off'; // 'off' | 'all' | 'one'
    let isAutoplay = true;
    let isMuted = false;
    let currentVolume = 0.8;
    let activePlaylistFilter = 'all'; // 'all' | 'favorites' | 'chill' | 'electronic'
    let favoritesSet = new Set();
    let shuffleHistory = [];
    let isSeeking = false;

    // --- DOM Elements ---
    const audioPlayer = document.getElementById('audioPlayer');
    const ambientBackdrop = document.getElementById('ambientBackdrop');
    const nowPlayingCard = document.querySelector('.now-playing-card');

    // Display Elements
    const albumArt = document.getElementById('albumArt');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const currentTimeEl = document.getElementById('currentTime');
    const totalDurationEl = document.getElementById('totalDuration');

    // Seek / Progress
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBarFill = document.getElementById('progressBarFill');

    // Primary Controls
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const repeatOneIndicator = document.querySelector('.repeat-one-indicator');
    const autoplayToggle = document.getElementById('autoplayToggle');

    // Volume
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeContainer = document.querySelector('.volume-container');

    // Playlist Elements
    const trackListEl = document.getElementById('trackList');
    const playlistTabs = document.querySelectorAll('.playlist-tab');
    const allTracksBadge = document.getElementById('allTracksBadge');
    const favoritesBadge = document.getElementById('favoritesBadge');
    const emptyPlaylistState = document.getElementById('emptyPlaylistState');
    const togglePlaylistBtn = document.getElementById('togglePlaylistBtn');
    const playlistSection = document.getElementById('playlistSection');

    // Toast
    const playerToast = document.getElementById('playerToast');

    // --- Initialization ---
    function init() {
        loadPreferences();
        bindEvents();
        updatePlaylistBadges();
        loadTrack(currentTrackIndex, false);
        renderPlaylist();
    }

    // --- Preferences & Local Storage ---
    function loadPreferences() {
        // Favorites
        try {
            const rawFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
            if (rawFavs) {
                const parsed = JSON.parse(rawFavs);
                if (Array.isArray(parsed)) {
                    favoritesSet = new Set(parsed);
                }
            } else {
                // Default demo favorite
                favoritesSet.add('track_1');
                saveFavorites();
            }
        } catch (e) {
            favoritesSet = new Set(['track_1']);
        }

        // Volume
        const savedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
        if (savedVol !== null) {
            currentVolume = parseFloat(savedVol);
            if (isNaN(currentVolume)) currentVolume = 0.8;
            volumeSlider.value = currentVolume;
        }

        // Muted
        const savedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
        if (savedMuted !== null) {
            isMuted = savedMuted === 'true';
        }
        audioPlayer.volume = isMuted ? 0 : currentVolume;
        updateVolumeUI();

        // Shuffle
        const savedShuffle = localStorage.getItem(STORAGE_KEY_SHUFFLE);
        if (savedShuffle !== null) {
            isShuffle = savedShuffle === 'true';
            shuffleBtn.classList.toggle('active', isShuffle);
        }

        // Repeat
        const savedRepeat = localStorage.getItem(STORAGE_KEY_REPEAT);
        if (savedRepeat && ['off', 'all', 'one'].includes(savedRepeat)) {
            repeatMode = savedRepeat;
            updateRepeatUI();
        }

        // Autoplay
        const savedAutoplay = localStorage.getItem(STORAGE_KEY_AUTOPLAY);
        if (savedAutoplay !== null) {
            isAutoplay = savedAutoplay === 'true';
            autoplayToggle.checked = isAutoplay;
        }
    }

    function saveFavorites() {
        try {
            localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favoritesSet)));
        } catch (e) {
            console.error('Failed to save favorites:', e);
        }
    }

    function saveVolume() {
        localStorage.setItem(STORAGE_KEY_VOLUME, currentVolume.toString());
        localStorage.setItem(STORAGE_KEY_MUTED, isMuted.toString());
    }

    // --- Track Loading & UI Update ---
    function loadTrack(index, shouldPlay = true) {
        if (index < 0 || index >= trackCatalog.length) return;

        currentTrackIndex = index;
        const track = trackCatalog[currentTrackIndex];

        // Update audio source
        audioPlayer.src = track.audioSrc;
        audioPlayer.load();

        // Update DOM metadata
        trackTitle.textContent = track.title;
        trackArtist.textContent = `${track.artist} • ${track.album}`;
        albumArt.src = track.artwork;
        albumArt.alt = `${track.title} Album Cover`;

        // Update Favorite State
        const isFav = favoritesSet.has(track.id);
        favoriteBtn.classList.toggle('favorited', isFav);
        favoriteBtn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');

        // Update Ambient Backdrop
        if (track.themeColors) {
            ambientBackdrop.style.background = track.themeColors.gradient;
        }

        // Reset progress UI
        progressBarFill.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        totalDurationEl.textContent = formatTime(track.duration || 0);

        // Highlight active track in playlist list
        updateActiveTrackInList();

        if (shouldPlay) {
            playTrack();
        } else {
            pauseTrack();
        }
    }

    // --- Play / Pause Controls ---
    function playTrack() {
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                nowPlayingCard.classList.add('playing');
                playPauseBtn.setAttribute('aria-label', 'Pause track');
            }).catch(err => {
                console.warn('Playback prevented or file loading issue:', err);
                // Handle autoplay block or loading error
                isPlaying = false;
                nowPlayingCard.classList.remove('playing');
                playPauseBtn.setAttribute('aria-label', 'Play track');
                showToast('Click play to start audio playback');
            });
        }
    }

    function pauseTrack() {
        audioPlayer.pause();
        isPlaying = false;
        nowPlayingCard.classList.remove('playing');
        playPauseBtn.setAttribute('aria-label', 'Play track');
    }

    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    // --- Next & Previous Navigation ---
    function nextTrack(isAutoNext = false) {
        if (repeatMode === 'one' && isAutoNext) {
            audioPlayer.currentTime = 0;
            playTrack();
            return;
        }

        const currentPlaylist = getActivePlaylistTracks();
        if (currentPlaylist.length === 0) return;

        let nextIndex;

        if (isShuffle) {
            // Pick a random track index different from current
            const availableIndices = [];
            for (let i = 0; i < trackCatalog.length; i++) {
                if (i !== currentTrackIndex) availableIndices.push(i);
            }
            if (availableIndices.length > 0) {
                const rand = Math.floor(Math.random() * availableIndices.length);
                nextIndex = availableIndices[rand];
            } else {
                nextIndex = currentTrackIndex;
            }
        } else {
            // Find position in current active playlist
            const posInList = currentPlaylist.findIndex(t => t.id === trackCatalog[currentTrackIndex].id);
            if (posInList !== -1 && posInList < currentPlaylist.length - 1) {
                const nextTrackObj = currentPlaylist[posInList + 1];
                nextIndex = trackCatalog.findIndex(t => t.id === nextTrackObj.id);
            } else {
                // At end of playlist
                if (repeatMode === 'all' || isShuffle) {
                    const firstTrackObj = currentPlaylist[0];
                    nextIndex = trackCatalog.findIndex(t => t.id === firstTrackObj.id);
                } else {
                    // Repeat off
                    if (isAutoNext) {
                        pauseTrack();
                        audioPlayer.currentTime = 0;
                        progressBarFill.style.width = '0%';
                        return;
                    } else {
                        // Manual next wraps around
                        const firstTrackObj = currentPlaylist[0];
                        nextIndex = trackCatalog.findIndex(t => t.id === firstTrackObj.id);
                    }
                }
            }
        }

        loadTrack(nextIndex, true);
    }

    function prevTrack() {
        // If current song has played for more than 3 seconds, restart it
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
            return;
        }

        const currentPlaylist = getActivePlaylistTracks();
        if (currentPlaylist.length === 0) return;

        const posInList = currentPlaylist.findIndex(t => t.id === trackCatalog[currentTrackIndex].id);
        let prevIndex;

        if (posInList > 0) {
            const prevTrackObj = currentPlaylist[posInList - 1];
            prevIndex = trackCatalog.findIndex(t => t.id === prevTrackObj.id);
        } else {
            // Wrap to last track in playlist
            const lastTrackObj = currentPlaylist[currentPlaylist.length - 1];
            prevIndex = trackCatalog.findIndex(t => t.id === lastTrackObj.id);
        }

        loadTrack(prevIndex, true);
    }

    // --- Shuffle & Repeat Modes ---
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        localStorage.setItem(STORAGE_KEY_SHUFFLE, isShuffle.toString());
        showToast(isShuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    }

    function toggleRepeat() {
        if (repeatMode === 'off') {
            repeatMode = 'all';
            showToast('Repeat all tracks');
        } else if (repeatMode === 'all') {
            repeatMode = 'one';
            showToast('Repeat current track');
        } else {
            repeatMode = 'off';
            showToast('Repeat off');
        }

        localStorage.setItem(STORAGE_KEY_REPEAT, repeatMode);
        updateRepeatUI();
    }

    function updateRepeatUI() {
        repeatBtn.classList.remove('active');
        repeatOneIndicator.classList.remove('show');

        if (repeatMode === 'all') {
            repeatBtn.classList.add('active');
        } else if (repeatMode === 'one') {
            repeatBtn.classList.add('active');
            repeatOneIndicator.classList.add('show');
        }
    }

    // --- Volume & Mute Controls ---
    function setVolume(vol) {
        currentVolume = Math.max(0, Math.min(1, vol));
        volumeSlider.value = currentVolume;
        if (isMuted && currentVolume > 0) {
            isMuted = false;
        }
        audioPlayer.volume = isMuted ? 0 : currentVolume;
        updateVolumeUI();
        saveVolume();
    }

    function toggleMute() {
        isMuted = !isMuted;
        audioPlayer.volume = isMuted ? 0 : currentVolume;
        updateVolumeUI();
        saveVolume();
        showToast(isMuted ? 'Muted' : 'Unmuted');
    }

    function updateVolumeUI() {
        volumeContainer.classList.toggle('is-muted', isMuted || currentVolume === 0);
    }

    // --- Seek Progress ---
    function updateProgress() {
        if (isSeeking) return;

        const duration = audioPlayer.duration || trackCatalog[currentTrackIndex].duration || 0;
        const current = audioPlayer.currentTime || 0;

        if (duration > 0) {
            const pct = (current / duration) * 100;
            progressBarFill.style.width = `${pct}%`;
            progressBarContainer.setAttribute('aria-valuenow', Math.round(pct).toString());
        }

        currentTimeEl.textContent = formatTime(current);
        totalDurationEl.textContent = formatTime(duration);
    }

    function seekAudio(e) {
        const rect = progressBarContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = audioPlayer.duration || trackCatalog[currentTrackIndex].duration || 0;

        if (width > 0 && duration > 0) {
            const seekPct = Math.max(0, Math.min(1, clickX / width));
            audioPlayer.currentTime = seekPct * duration;
            progressBarFill.style.width = `${seekPct * 100}%`;
        }
    }

    // --- Favorites Management ---
    function toggleFavorite(trackId) {
        const targetId = trackId || trackCatalog[currentTrackIndex].id;
        const isFav = favoritesSet.has(targetId);

        if (isFav) {
            favoritesSet.delete(targetId);
            showToast('Removed from favorites');
        } else {
            favoritesSet.add(targetId);
            showToast('Added to favorites! ❤️');
        }

        saveFavorites();
        updatePlaylistBadges();

        // Update player heart if this is the currently playing track
        if (targetId === trackCatalog[currentTrackIndex].id) {
            favoriteBtn.classList.toggle('favorited', !isFav);
        }

        // Re-render playlist
        renderPlaylist();
    }

    // --- Playlist & Filtering ---
    function getActivePlaylistTracks() {
        if (activePlaylistFilter === 'favorites') {
            return trackCatalog.filter(t => favoritesSet.has(t.id));
        } else if (activePlaylistFilter === 'chill') {
            return trackCatalog.filter(t => t.genre === 'chill');
        } else if (activePlaylistFilter === 'electronic') {
            return trackCatalog.filter(t => t.genre === 'electronic');
        }
        return trackCatalog;
    }

    function renderPlaylist() {
        const tracks = getActivePlaylistTracks();
        trackListEl.innerHTML = '';

        if (tracks.length === 0) {
            emptyPlaylistState.classList.remove('hidden');
            return;
        }

        emptyPlaylistState.classList.add('hidden');

        const fragment = document.createDocumentFragment();

        tracks.forEach((track, index) => {
            const isCurrent = track.id === trackCatalog[currentTrackIndex].id;
            const isFav = favoritesSet.has(track.id);

            const item = document.createElement('div');
            item.className = `track-item ${isCurrent ? 'active' : ''}`;
            item.setAttribute('role', 'listitem');
            item.setAttribute('data-id', track.id);

            item.innerHTML = `
                <span class="track-item-num">${String(index + 1).padStart(2, '0')}</span>
                <div class="track-item-equalizer" aria-hidden="true">
                    <span class="eq-bar"></span>
                    <span class="eq-bar"></span>
                    <span class="eq-bar"></span>
                </div>
                <img src="${track.artwork}" alt="${track.title}" class="track-item-thumb">
                <div class="track-item-info">
                    <h4 class="track-item-title">${escapeHTML(track.title)}</h4>
                    <p class="track-item-artist">${escapeHTML(track.artist)}</p>
                </div>
                <span class="track-item-duration">${formatTime(track.duration)}</span>
                <button type="button" class="btn-icon track-item-fav-btn ${isFav ? 'favorited' : ''}" aria-label="Favorite track ${track.title}" title="Favorite">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            `;

            // Click track to play
            item.addEventListener('click', (e) => {
                if (e.target.closest('.track-item-fav-btn')) return;
                const targetCatalogIndex = trackCatalog.findIndex(t => t.id === track.id);
                if (targetCatalogIndex !== -1) {
                    loadTrack(targetCatalogIndex, true);
                }
            });

            // Favorite button in list item
            const favBtn = item.querySelector('.track-item-fav-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(track.id);
            });

            fragment.appendChild(item);
        });

        trackListEl.appendChild(fragment);
    }

    function updateActiveTrackInList() {
        const currentId = trackCatalog[currentTrackIndex].id;
        const allItems = trackListEl.querySelectorAll('.track-item');
        allItems.forEach(item => {
            const match = item.getAttribute('data-id') === currentId;
            item.classList.toggle('active', match);
        });
    }

    function updatePlaylistBadges() {
        allTracksBadge.textContent = trackCatalog.length;
        favoritesBadge.textContent = favoritesSet.size;
    }

    // --- Helpers ---
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(msg) {
        playerToast.textContent = msg;
        playerToast.classList.add('show');
        setTimeout(() => {
            playerToast.classList.remove('show');
        }, 2200);
    }

    // --- Event Listeners Binding ---
    function bindEvents() {
        // Audio Element Events
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', updateProgress);
        audioPlayer.addEventListener('ended', () => {
            if (isAutoplay) {
                nextTrack(true);
            } else {
                pauseTrack();
            }
        });

        audioPlayer.addEventListener('error', (e) => {
            console.warn('Audio element error encountered:', e);
            showToast('Notice: Audio track preview ready');
        });

        // Controls
        playPauseBtn.addEventListener('click', togglePlayPause);
        nextBtn.addEventListener('click', () => nextTrack(false));
        prevBtn.addEventListener('click', prevTrack);
        shuffleBtn.addEventListener('click', toggleShuffle);
        repeatBtn.addEventListener('click', toggleRepeat);

        // Favorite Toggle
        favoriteBtn.addEventListener('click', () => toggleFavorite());

        // Autoplay Toggle
        autoplayToggle.addEventListener('change', (e) => {
            isAutoplay = e.target.checked;
            localStorage.setItem(STORAGE_KEY_AUTOPLAY, isAutoplay.toString());
            showToast(isAutoplay ? 'Autoplay enabled' : 'Autoplay disabled');
        });

        // Volume Controls
        muteBtn.addEventListener('click', toggleMute);
        volumeSlider.addEventListener('input', (e) => {
            setVolume(parseFloat(e.target.value));
        });

        // Progress / Seek Bar Interaction
        progressBarContainer.addEventListener('click', seekAudio);

        let isMouseDownOnProgress = false;
        progressBarContainer.addEventListener('mousedown', (e) => {
            isMouseDownOnProgress = true;
            isSeeking = true;
            seekAudio(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (isMouseDownOnProgress) {
                seekAudio(e);
            }
        });

        document.addEventListener('mouseup', () => {
            if (isMouseDownOnProgress) {
                isMouseDownOnProgress = false;
                isSeeking = false;
            }
        });

        // Progress bar keyboard support
        progressBarContainer.addEventListener('keydown', (e) => {
            const step = 5; // 5 seconds
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                audioPlayer.currentTime = Math.min(audioPlayer.duration || 100, audioPlayer.currentTime + step);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - step);
            }
        });

        // Playlist Tabs
        playlistTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                playlistTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                activePlaylistFilter = tab.getAttribute('data-filter');
                renderPlaylist();
            });
        });

        // Mobile Playlist Drawer Toggle
        togglePlaylistBtn.addEventListener('click', () => {
            if (window.innerWidth < 900) {
                playlistSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            // Ignore keystrokes when user is typing in any form input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    audioPlayer.currentTime = Math.min(audioPlayer.duration || 100, audioPlayer.currentTime + 5);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setVolume(currentVolume + 0.05);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setVolume(currentVolume - 0.05);
                    break;
                case 'KeyM':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'KeyN':
                    e.preventDefault();
                    nextTrack(false);
                    break;
                case 'KeyP':
                    e.preventDefault();
                    prevTrack();
                    break;
            }
        });
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
