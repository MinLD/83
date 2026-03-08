document.addEventListener("DOMContentLoaded", () => {
  /* ================= DATA ================= */
  const CORRECT_PIN = "220822";

  // Danh sách nhạc - Sẽ map mỗi bài với ảnh và tự liên kết
  const audioSource = document.getElementById("audio-source").src;

  // Use images from album/ directory
  const albumPhotos = [
    "album/ab1.jpg",
    "album/ab2.jpg",
    "album/ab3.jpg",
    "album/ab4.jpg",
    "album/ab5.jpg",
    "album/ab6.jpg",
    "album/ab8.jpg",
    "album/ab9.jpg",
    "album/ab10.jpg",
    "album/ab11.jpg",
    "album/ab12.jpg",
    "album/ab13.jpg",
    "album/ab14.jpg",
    "album/ab15.jpg",
    "album/ab16.jpg",
    "album/ab17.jpg",
    "album/ab18.jpg",
    "album/ab19.jpg",
    "album/ab20.jpg",
    "album/ab21.jpg",
    "album/ab22.jpg",
  ];
  const explosivePhotos = [...albumPhotos, ...albumPhotos, ...albumPhotos];

  // Preload images to prevent long loading times when opening modals
  const preloadedImages = [];
  albumPhotos.forEach((src) => {
    const img = new Image();
    img.src = src;
    preloadedImages.push(img);
  });

  const songs = [
    {
      id: 1,
      title: "Cầu Hôn",
      src: "track/Cầu Hôn.mp3",
      cover: "album/ab4.jpg",
    },
    {
      id: 2,
      title: "Bài Này Cute",
      src: "track/BaiNayCute.mp3",
      cover: "album/ab3.jpg",
    },

    {
      id: 3,
      title: "Cầu Hôn",
      src: "track/Cầu Hôn.mp3",
      cover: "album/ab5.jpg",
    },
    {
      id: 4,
      title: "Vì Lòng Anh",
      src: "track/Vì Lòng Anh.mp3",
      cover: "album/ab6.jpg",
    },
    {
      id: 5,
      title: "Vì Anh Sẽ Luôn Yêu Em",
      src: "track/ViAnhSeLuonYeuEm.mp3",
      cover: "album/ab8.jpg",
    },
    {
      id: 6,
      title: "Na Na Na",
      src: "track/nanana.mp3",
      cover: "album/ab9.jpg",
    },
  ];

  const letterText = `Gửi em, cô gái xinh đẹp nhất của anh,\n\nHôm nay là 8/3, ngày Quốc tế Phụ nữ. Anh viết bức thư nhỏ này để gửi gắm tất cả những lời chúc yêu thương nhất đến em.\n\nCảm ơn em vì đã đến bên anh, làm cho mọi khoảnh khắc trở nên rực rỡ và ấm áp. Nụ cười của em luôn là nguồn động lực lớn lao nhất đối với anh.\n\nChúc em luôn tươi vui, hạnh phúc và thành công trong những dự định sắp tới.\n\nMãi yêu em! ❤️`;

  const giftWishes = [
    "Chúc em 8/3 mãi luôn xinh đẹp và rạng rỡ nha",
    "Ngày càng thành công và đạt được mọi ước mơ nhé bé con",
    "Mong em luôn vui vẻ, hạnh phúc khi ở bên anh",
    "Cảm ơn em đã đến và làm cuộc sống của anh thêm màu sắc",
    "Thương em nhiều lắm, cô gái nhỏ của anh",
    "Mãi yêu bé",
    "Nụ cười của em là điều tuyệt vời nhất",
    "Hãy luôn tự tin và tỏa sáng nhé",
    "Gửi đến em ngàn nụ hôn trong ngày đặc biệt này",
    "Chúc công chúa của anh một ngày 8/3 ngập tràn tình yêu",
    "Anh sẽ luôn ở đây, bảo vệ và yêu thương em",
    "My heart belongs to you",
  ];
  const explosiveWishes = [...giftWishes, ...giftWishes]; // x2 lời chúc

  /* ================= ELEMENTS ================= */
  const lockScreen = document.getElementById("lock-screen");
  const mainMenu = document.getElementById("main-menu");
  const modalOverlay = document.getElementById("modal-overlay");
  const particlesContainer = document.getElementById("particles");

  const bgMusic = document.getElementById("bg-music");

  /* ================= 1. PIN LOGIC ================= */
  const keys = document.querySelectorAll(".keypad .key");
  const pinDots = document.querySelectorAll(".pin-dot");
  const lockRightContainer = document.querySelector(".lock-right");
  let currentPin = "";

  keys.forEach((key) => {
    key.addEventListener("click", () => {
      const val = key.getAttribute("data-val");

      // Xóa lỗi nếu đang có
      lockRightContainer.classList.remove("lock-error-shake");
      pinDots.forEach((d) => d.classList.remove("error"));

      if (val === "del") {
        currentPin = currentPin.slice(0, -1);
        updatePinDisplay();
      } else if (val) {
        if (currentPin.length < 6) {
          currentPin += val;
          updatePinDisplay();
          if (currentPin.length === 6) {
            // Trigger music immediately on the 6th keystroke to satisfy browser autoplay policies
            if (currentPin === CORRECT_PIN) {
              bgMusic
                .play()
                .then(() => {
                  playPauseBtn.innerText = "⏸";
                  playerDisk.classList.add("playing");
                })
                .catch((err) =>
                  console.log("Auto-play blocked by browser", err),
                );
            }
            setTimeout(checkPin, 200);
          }
        }
      }
    });
  });

  function updatePinDisplay() {
    pinDots.forEach((dot, index) => {
      if (index < currentPin.length) dot.classList.add("filled");
      else dot.classList.remove("filled");
    });
  }

  function checkPin() {
    if (currentPin === CORRECT_PIN) {
      // Unlock!
      lockScreen.classList.remove("active");
      setTimeout(() => {
        mainMenu.classList.add("active");
        startParticles();
      }, 500);
    } else {
      // Error
      lockRightContainer.classList.add("lock-error-shake");
      pinDots.forEach((d) => d.classList.add("error"));
      setTimeout(() => {
        currentPin = "";
        updatePinDisplay();
      }, 500);
    }
  }

  /* ================= 2. MODAL SYSTEM ================= */
  const menuBtns = document.querySelectorAll(".menu-btn");
  const closeBtns = document.querySelectorAll(".close-btn");
  let activeModal = null;

  menuBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = `modal-${btn.getAttribute("data-target")}`;
      openModal(targetId);
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  function openModal(id) {
    modalOverlay.classList.remove("hidden");
    document
      .querySelectorAll(".modal")
      .forEach((m) => m.classList.remove("active"));

    activeModal = document.getElementById(id);
    if (activeModal) {
      activeModal.classList.add("active");

      // Trigger specific logic when opening
      if (id === "modal-letter") startTypewriter();
      if (id === "modal-album") renderAlbum();
      if (id === "modal-gift") resetGiftScene();
    }
  }

  function closeModal() {
    if (activeModal) activeModal.classList.remove("active");
    modalOverlay.classList.add("hidden");
  }

  /* ================= 3. MUSIC PLAYER ================= */
  let currentSongIndex = 0;
  const playerDisk = document.querySelector(".player-disk");
  const playerCover = document.getElementById("player-cover");
  const playerTitle = document.getElementById("player-title");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const songListContainer = document.getElementById("song-list");

  function loadSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    bgMusic.src = song.src;
    playerCover.src = song.cover;
    playerTitle.innerText = song.title;
    renderSongList(); // update active state in list

    // Auto play when loaded via controls
    bgMusic
      .play()
      .then(() => {
        playPauseBtn.innerText = "⏸";
        playerDisk.classList.add("playing");
      })
      .catch(() => {
        playPauseBtn.innerText = "▶";
        playerDisk.classList.remove("playing");
      });
  }

  function togglePlay() {
    if (bgMusic.paused) {
      bgMusic.play();
      playPauseBtn.innerText = "⏸";
      playerDisk.classList.add("playing");
    } else {
      bgMusic.pause();
      playPauseBtn.innerText = "▶";
      playerDisk.classList.remove("playing");
    }
  }

  document.getElementById("prev-btn").addEventListener("click", () => {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) newIndex = songs.length - 1;
    loadSong(newIndex);
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= songs.length) newIndex = 0;
    loadSong(newIndex);
  });

  playPauseBtn.addEventListener("click", togglePlay);

  function renderSongList() {
    songListContainer.innerHTML = "";
    songs.forEach((song, idx) => {
      const div = document.createElement("div");
      div.className = `song-item ${idx === currentSongIndex ? "active" : ""}`;
      div.innerHTML = `
                <img src="${song.cover}" alt="cover">
                <span>${song.title}</span>
            `;
      div.addEventListener("click", () => loadSong(idx));
      songListContainer.appendChild(div);
    });
  }

  // Init first song (but don't play until interacted)
  bgMusic.src = songs[0].src;
  playerCover.src = songs[0].cover;
  playerTitle.innerText = songs[0].title;
  renderSongList();

  // Auto play next song when ended
  bgMusic.addEventListener("ended", () => {
    document.getElementById("next-btn").click();
  });

  /* ================= 4. LETTER TEXT ================= */
  const typewriteContainer = document.getElementById("typewrite-text");
  let typeTimeout;

  function startTypewriter() {
    typewriteContainer.innerHTML = '<span class="cursor"></span>';
    clearTimeout(typeTimeout);
    let i = 0;

    function type() {
      if (i < letterText.length) {
        const char =
          letterText.charAt(i) === "\n" ? "<br>" : letterText.charAt(i);
        typewriteContainer.innerHTML =
          typewriteContainer.innerHTML.replace(
            '<span class="cursor"></span>',
            "",
          ) +
          char +
          '<span class="cursor"></span>';
        i++;
        typeTimeout = setTimeout(type, 50); // Typing speed
      }
    }
    type();
  }

  /* ================= 5. ALBUM ================= */
  const albumGrid = document.getElementById("album-grid");
  function renderAlbum() {
    if (albumGrid.children.length > 0) return; // Prevent re-rendering
    albumPhotos.forEach((src, index) => {
      const card = document.createElement("div");
      card.className = "album-card";
      card.innerHTML = `<img src="${src}" alt="Memory">`;

      const rot = Math.random() * 40 - 20; // -20 to 20 deg
      card.style.transform = `scale(0.1) rotate(${rot * 3}deg)`;

      albumGrid.appendChild(card);

      setTimeout(
        () => {
          card.style.transform = `scale(1) rotate(${rot}deg)`;
          card.classList.add("show");
          card.setAttribute("data-rot", rot);
        },
        150 * index + 300,
      );

      card.addEventListener("mouseleave", () => {
        card.style.transform = `scale(1) rotate(${card.getAttribute("data-rot")}deg)`;
        card.style.zIndex = "1";
      });
    });
  }

  /* ================= 6. GIFT ANIMATION ================= */
  const giftScene = document.getElementById("gift-scene");
  const openGiftBtn = document.getElementById("open-gift-btn");

  function resetGiftScene() {
    openGiftBtn.style.display = "block";
    // Xóa các phần tử bay cũ nếu có
    document
      .querySelectorAll(".fly-photo, .fly-text, .base-flower")
      .forEach((e) => e.remove());
  }

  openGiftBtn.addEventListener("click", () => {
    openGiftBtn.style.display = "none";

    // 1. Tạo chậu hoa / bông hoa mọc lên từ dưới
    const flower = document.createElement("div");
    flower.className = "base-flower";
    flower.innerText = "🌸";
    giftScene.appendChild(flower);

    setTimeout(() => {
      flower.style.transform = "scale(1)";
    }, 100);

    // 2. Tỏa ảnh và khung chữ (sử dụng mảng đã nhân bản)
    setTimeout(() => {
      explosivePhotos.forEach((src, idx) => {
        createFlyingElement("photo", src, idx);
      });
      explosiveWishes.forEach((text, idx) => {
        createFlyingElement("text", text, idx);
      });
    }, 1000);
  });

  function createFlyingElement(type, content, index) {
    const el = document.createElement("div");
    el.className = type === "photo" ? "fly-photo" : "fly-text";

    if (type === "photo") {
      el.style.backgroundImage = `url(${content})`;
    } else {
      el.innerText = content;
    }

    // Xuất phát từ trên trời rớt xuống
    const startX = Math.random() * 80 + 10;
    el.style.left = `${startX}%`;
    el.style.top = "-150px";
    el.style.transform = `translate(-50%, 0) scale(0.5) rotate(${Math.random() * 90 - 45}deg)`;

    giftScene.appendChild(el);

    // Vị trí đích rải rác vòng quanh
    const targetY = Math.random() * 60 + 10; // 10% to 70% từ đỉnh
    const targetRot = Math.random() * 60 - 30; // -30 to 30deg

    setTimeout(
      () => {
        el.style.opacity = "1";
        el.style.top = `${targetY}%`;
        el.style.transform = `translate(-50%, 0) rotate(${targetRot}deg) scale(1)`;
      },
      150 * index + 100,
    );

    // Enable dragging and hovering after initial animation completes
    setTimeout(
      () => {
        el.classList.add("draggable");
        makeDraggable(el);
      },
      150 * index + 100 + 5000,
    );
  }

  function makeDraggable(el) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;

      // Bring to front
      document.querySelectorAll(".fly-photo, .fly-text").forEach((n) => {
        if (n.style.zIndex > 10) n.style.zIndex = parseInt(n.style.zIndex) - 1;
      });
      el.style.zIndex = 1000;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  /* ================= GLOBAL PARTICLES ================= */
  function createPetal() {
    const petal = document.createElement("div");
    petal.className = "petal";

    const colors = ["#ffd6e5", "#fecfef", "#fff", "#ffb3c6"];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.animationDuration = Math.random() * 5 + 5 + "s"; // 5 - 10s

    particlesContainer.appendChild(petal);

    setTimeout(() => petal.remove(), 10000); // clear element
  }

  function startParticles() {
    setInterval(createPetal, 400); // rơi lá liên tục
  }
});
