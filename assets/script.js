const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MS_PLAYER";

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Vicetone",
            singer: "Nevada",
            path: "https://vnso-zn-15-tf-mp3-s1-zmp3.zmdcdn.me/1d9de0bd79f990a7c9e8/1660985765828162804?authen=exp=1666254498~acl=/1d9de0bd79f990a7c9e8/*~hmac=f5b654862ef6552405be489268fa1b5b&fs=MTY2NjA4MTY5Nzk4Nnx3ZWJWNnwxMDY2MDg2NjQyfDExNi4xMDYdUngMjA2LjE4MQ&filename=Vicetone-Nevada-Remix.mp3",
            image: "https://i1.sndcdn.com/artworks-000174788935-d1hrl9-t500x500.jpg",
        },
        {
            name: "Chạy Về Nơi Phía Anh",
            singer: "Khắc Việt",
            path: "https://vnso-zn-15-tf-mp3-s1-zmp3.zmdcdn.me/30ebf1a99ce875b62cf9/1207873609872211285?authen=exp=1666261101~acl=/30ebf1a99ce875b62cf9/*~hmac=31fd029172a1eb52afdf94022876a1ec&fs=MTY2NjA4ODMwMTMyNnx3ZWJWNnwxMDY2MDg2NjQyfDExNi4xMDYdUngMjA2LjE4MQ&filename=Chay-Ve-Noi-Phia-Anh-Khac-Viet.mp3",
            image: "https://i.ytimg.com/vi/RaoBKCKIDAI/maxresdefault.jpg",
        },
        {
            name: "Bước Qua Nhau",
            singer: "Raftaar x Brobha V",
            path: "https://tainhachay.biz/download-mp3/EdENCgJm9dAa/mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/share/2021/11/19/b/e/5/0/1637317185220.jpg",
        },
        {
            name: "Chạy Về Khóc Với Anh",
            singer: "ERIK",
            path: "https://vnso-zn-5-tf-mp3-s1-zmp3.zmdcdn.me/baa2ed6e9d2f74712d3e/7034223956028953907?authen=exp=1666261269~acl=/baa2ed6e9d2f74712d3e/*~hmac=42a9491bd1cf920a8ef4349b4063062f&fs=MTY2NjA4ODQ2OTA5M3x3ZWJWNnwxMDY2MDg2NjQyfDExNi4xMDYdUngMjA2LjE4MQ&filename=Chay-Ve-Khoc-Voi-Anh-ERIK.mp3",
            image: "https://dj24h.com/wp-content/uploads/2022/03/chay-ve-khoc-voi-anh.jpg",
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image: "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg",
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                            <div class="thumb" style="background-image: url('${song.image}')"></div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                        `;
        });
        playlist.innerHTML = htmls.join("");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        // Handles CD enlargement / reduction
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Handle CD spins / stops
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        //When the song is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        // When the song is paused
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // Handling when seek
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };
        // When next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // When prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Handling on / off random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };
        // Handle next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Single-parallel repeat processing
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Listen to playlist clicks
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            if (songNode || e.target.closest(".option")) {
                // Handle song click
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Handle option click
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 300);
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Assign configuration from config to application
        this.loadConfig();
        // Defines properties for the object
        this.defineProperties();

        // Listening / handling events (DOM events)
        this.handleEvents();

        // Load the first song information into the UI when running the app
        this.loadCurrentSong();

        //Render playlist
        this.render();

        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    },
};
app.start();
