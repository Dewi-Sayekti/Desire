// ======================================================================
// 1. UTILITIES & STORAGE
// ======================================================================

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const keys = {
    photos: 'desire_photos_v1',
    video: 'desire_video_v1',
};

// simple storage helpers
function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        console.error('Error loading key:', key, e);
        return [];
    }
}
function save(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
}

// Membuat URL sementara dari File object untuk preview (berlaku hanya selama sesi browser)
function createTempUrl(file) {
    return URL.createObjectURL(file); 
}

// simple toast
function showToast(msg) {
    const el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-dark border-0 show';
    el.style.position = 'fixed';
    el.style.right = '18px';
    el.style.top = '18px';
    el.style.zIndex = 3000;
    el.innerHTML = `<div class='d-flex'><div class='toast-body'>${escapeHtml(msg)}</div>
    <button class='btn-close btn-close-white me-2 m-auto' type='button'></button></div>`;
    document.body.appendChild(el);
    el.querySelector('button').addEventListener('click', () => el.remove());
    setTimeout(() => el.remove(), 3500);
}

// escape HTML
function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

// ======================================================================
// 2. ANIMASI & LOADER (TIDAK BERUBAH)
// ======================================================================

// initial loader
window.addEventListener('load', () => {
    setTimeout(() => (document.getElementById('loader').style.display = 'none'), 800);
});

// create twinkling stars randomly
const starsEl = document.getElementById('stars');
if(starsEl) {
    for (let i = 0; i < 40; i++) {
        const s = document.createElement('div');
        s.className = 'star-twinkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.animationDuration = 2 + Math.random() * 4 + 's';
        s.style.opacity = 0.6 + Math.random() * 0.5;
        starsEl.appendChild(s);
    }
}


// falling leaves (decorative) - random shapes
const leafContainer = document.getElementById('leaf-container');
if(leafContainer) {
    function spawnLeaf() {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        const left = Math.random() * 100;
        leaf.style.left = left + '%';
        leaf.style.top = '-10vh';
        leaf.style.width = 12 + Math.random() * 14 + 'px';
        leaf.style.height = 12 + Math.random() * 14 + 'px';
        leaf.style.background = 'linear-gradient(45deg,#ffd1f7,#b389ff)';
        leaf.style.borderRadius = '4px';
        leaf.style.transformOrigin = 'center';
        leaf.style.animation = 'fall ' + (6 + Math.random() * 6) + 's linear';
        leafContainer.appendChild(leaf);
        setTimeout(() => leaf.remove(), 12000);
    }
    setInterval(spawnLeaf, 3000);
}

// Inisialisasi Modal untuk media
const viewModalEl = document.getElementById('viewModal');
const viewModal = viewModalEl ? new bootstrap.Modal(viewModalEl) : null;

// ======================================================================
// 3. PROFIL STATIS (TIDAK BERUBAH)
// ======================================================================

const profileContainer = document.getElementById('profileCardContainer');
const STATIC_PROFILES_DATA = [
    {
        id: 'xingqiu-main', 
        title: "Qiu Ding Jie (邱鼎杰)", 
        subtitle: "Kipuka", 
        name: "XingQiu", 
        status: "Kipuka qiu", 
        TTL: ": Shanghai, China 3 April 1998",
        Zodiak: ": Aries",
        Shio: ": Harimau",
        Tinggi: ": 185 cm (6′0″)",
        Berat: ": 70 kg (154 lbs)",
        Profesi: ": Aktor",
        Company: ": Shanghai Yile Culture",
        Weibo: ': <a href="https://weibo.com/u/7464197479" target="_blank" class="text-info">@邱鼎杰_kipuka</a>',
        Instagram: ': <a href="https://www.instagram.com/kipuka_qiu" target="_blank" class="text-info">@kipuka_qiu</a>',
        bio: " Meski lahir di Shanghai, ia memiliki akar keluarga dari Provinsi Fujian. Kiprah seninya dimulai sejak ia menempuh pendidikan di Shanghai Film Academy. Ia lulus dari Departemen Seni Peran dan berada di bawah naungan agensi Shanghai Yile Culture. Sejak itu, ia aktif membangun reputasi sebagai aktor dengan karakteristik khas. Qiu dikenal memiliki nama panggilan Kipuka di kalangan penggemarnya. Kepribadiannya yang kalem di luar layar membuatnya digemari banyak penggemar drama Tiongkok.",
        photoUrl: "assets/Kipuka.jpg", 
        city: "Tiongkok",
    }
];

function renderProfileCard() {
    const p = STATIC_PROFILES_DATA[0];
    
    if (!profileContainer || !p) {
        if(profileContainer) {
             profileContainer.innerHTML = '<div class="muted">Tidak ada data profil statis yang dimuat.</div>';
        }
        return;
    }

    const detailKeys = [
        { key: 'TTL', label: 'TTL' },
        { key: 'Zodiak', label: 'Zodiak' },
        { key: 'Shio', label: 'Shio' },
        { key: 'Tinggi', label: 'Tinggi' },
        { key: 'Berat', label: 'Berat' },
        { key: 'Profesi', label: 'Profesi' },
        { key: 'Company', label: 'Company' },
        { key: 'Weibo', label: 'Weibo' },
        { key: 'Instagram', label: 'Instagram' },
    ];

    const tableRows = detailKeys.map(d => {
        const value = (d.key === 'Weibo' || d.key === 'Instagram') ? p[d.key] : escapeHtml(p[d.key] || 'N/A');
        
        if (value) {
            return `
                <tr>
                    <td class="muted" style="width:120px;">${d.label}</td>
                    <td class="text-purple-pink">${value}</td> 
                </tr>
            `;
        }
        return '';
    }).join('');

    profileContainer.innerHTML = `
        <div class="card p-4" style="background: transparent !important; border: 1px solid rgba(255,255,255,0.08);">
          <div class="row">
              <div class="col-md-3 text-center mb-3 mb-md-0">
                  <img 
                      src="${p.photoUrl}" 
                      alt="${p.name}" 
                      class="img-fluid rounded-circle" 
                      style="width:200px; height:200px; object-fit:cover; border: 3px solid var(--accent);"
                  />
              </div>
              
              <div class="col-md-9">
                  <h3 style="color:var(--accent);">${escapeHtml(p.title)}</h3>
                  <h5 class="muted mb-3">${escapeHtml(p.subtitle)} (${escapeHtml(p.name)})</h5>

                  <table class="table table-borderless text-white">
                      ${tableRows}
                  </table>
                  
                  <p class="mt-4 text-purple-pink">
                      <strong>${escapeHtml(p.status)}:</strong>
                  </p>
                  <p class="text-purple-pink">
                      ${escapeHtml(p.bio)}
                  </p>
              </div>
          </div>
        </div>
    `;
}

// ======================================================================
// 4. MEDIA (FOTO & VIDEO) (TIDAK BERUBAH SIGNIFIKAN)
// ======================================================================

const fotoForm = document.getElementById('fotoForm');
const fotoGallery = document.getElementById('fotoGallery');

function renderFotos() {
    const arr = load(keys.photos);
    if (!fotoGallery) return;

    if (arr.length === 0) {
        fotoGallery.innerHTML = '<div class="muted">Galeri kosong.</div>';
        return;
    }
    fotoGallery.innerHTML = arr
        .map(
            (p) => `
            <div class="col-12 col-md-4">
                <div class="card p-1" style="background:transparent;border:1px solid rgba(255,255,255,0.04)">
                    <img src="${p.url}" class="img-fluid" style="border-radius:6px;cursor:pointer" data-id="${p.id}" />
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <small class="muted">${escapeHtml(p.name || '')}</small>
                        <button class="btn btn-sm btn-outline-light btn-del" data-id="${p.id}">Hapus</button>
                    </div>
                </div>
            </div>
        `
        )
        .join('');
    fotoGallery.querySelectorAll('img').forEach((img) =>
        img.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            openMediaInModal(load(keys.photos).find((x) => x.id === id));
        })
    );
    fotoGallery.querySelectorAll('.btn-del').forEach((b) =>
        b.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const arr = load(keys.photos).filter((x) => x.id !== id);
            save(keys.photos, arr);
            renderFotos();
        })
    );
}

if(fotoForm) {
    fotoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const files = document.getElementById('fotoFile').files;
        if (!files.length) return;
        const arr = load(keys.photos);
        for (const f of files) {
            const url = createTempUrl(f); 
            arr.unshift({ id: uid(), name: f.name, type: f.type, url, created: Date.now() });
        }
        save(keys.photos, arr);
        fotoForm.reset();
        renderFotos();
        showToast('Foto berhasil diunggah!');
    });
}


const videoForm = document.getElementById('videoForm');
const videoList = document.getElementById('videoList');

function renderVideo() {
    const arr = load(keys.video);
    if (!videoList) return;

    if (arr.length === 0) {
        videoList.innerHTML = '<div class="muted">Belum ada film.</div>';
        return;
    }
    videoList.innerHTML = arr
        .map(
            (v) => `
            <div class="list-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${escapeHtml(v.title || v.name || 'Untitled')}</strong>
                        <div class="muted small">${new Date(v.created).toLocaleString()}</div>
                    </div>
                    <div class="d-flex flex-column align-items-end"> 
                        <video controls style="width:220px; max-width:100%;" src="${v.url}"></video>
                        <button class="btn btn-sm btn-outline-light btn-del mt-1" data-id="${v.id}">Hapus</button>
                    </div>
                </div>
            </div>
        `
        )
        .join('');
    videoList.querySelectorAll('.btn-del').forEach((b) => {
        b.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const arr = load(keys.video).filter((x) => x.id !== id);
            save(keys.video, arr);
            renderVideo();
        });
    });
}

if(videoForm) {
    videoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = document.getElementById('videoFile').files[0];
        const title = document.getElementById('videoTitle').value.trim();
        
        if (!f) {
            alert('Pilih file video');
            return;
        }

        const MAX_VIDEO_SIZE_MB = 25;
        const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
        
        if (f.size > MAX_VIDEO_SIZE_BYTES) {
            showToast(`❌ Video terlalu besar. Maksimum: ${MAX_VIDEO_SIZE_MB} MB.`);
            return; 
        }

        const url = createTempUrl(f);
        const arr = load(keys.video);
        arr.unshift({ id: uid(), title, name: f.name, type: f.type, url, created: Date.now() });
        save(keys.video, arr);
        videoForm.reset();
        renderVideo();
        showToast('Video berhasil diunggah!');
    });
}

function openMediaInModal(item) {
    if (!item || !viewModal) return;
    const viewTitle = document.getElementById('viewTitle');
    const viewBody = document.getElementById('viewBody');

    if(viewTitle) viewTitle.textContent = item.title || item.name || 'Preview';
    if(viewBody) viewBody.innerHTML = '';
    
    const mediaSource = item.url; 

    if (!mediaSource) {
        if(viewBody) viewBody.textContent = 'Sumber media tidak ditemukan.';
    } else if (item.type && item.type.startsWith('image')) {
        const img = document.createElement('img');
        img.src = mediaSource;
        img.className = 'img-fluid rounded';
        if(viewBody) viewBody.appendChild(img);
    } else if (item.type && (item.type.startsWith('video') || item.type.startsWith('audio'))) {
        const tag = item.type.startsWith('video') ? 'video' : 'audio';
        const mediaEl = document.createElement(tag);
        mediaEl.src = mediaSource;
        mediaEl.controls = true;
        mediaEl.className = 'w-100 rounded';
        if(viewBody) viewBody.appendChild(mediaEl);
    } else {
        if(viewBody) viewBody.textContent = 'Preview not available.';
    }
    viewModal.show();
}

// ======================================================================
// 5. FANS (BIOGRAFI PENGGEMAR)
// ======================================================================
const Fans = document.getElementById('Fans');
const STATIC_PROFILES_DATA = [
    {
        id: 'fans-main', 
        title: "FansGirl", 
        Nama: ": Dewi Sayekti Sutrisni", 
        Semester: ": 5 (Lima)", 
        Jurusan: ": Informatika",
        photoUrl: "assets/Dewi.jpg", 
     }
];

function renderFans() {
    const p = STATIC_PROFILES_DATA[0];
    
    if (!fans || !p) {
        if(fans) {
             fans.innerHTML = '<div class="muted">Tidak ada data profil statis yang dimuat.</div>';
        }
        return;
    }

    const detailKeys = [
        { key: 'Nama', label: 'Nama' },
        { key: 'Semester', label: 'Semester' },
        { key: 'Jurusan', label: 'Jurusan' },
    ];

    if (value) {
            return `
                <tr>
                    <td class="muted" style="width:120px;">${d.label}</td>
                    <td class="text-purple-pink">${value}</td> 
                </tr>
            `;
        }
        return '';
    }).join('');

fans.innerHTML = `
        <div class="card p-4" style="background: transparent !important; border: 1px solid rgba(255,255,255,0.08);">
          <div class="row">
              <div class="col-md-3 text-center mb-3 mb-md-0">
                  <img 
                      src="${p.photoUrl}" 
                      alt="${p.name}" 
                      class="img-fluid rounded-circle" 
                      style="width:200px; height:200px; object-fit:cover; border: 3px solid var(--accent);"
                  />
              </div>
              <div class="col-md-9">
                  <h3 style="color:var(--accent);">${escapeHtml(p.title)}</h3>

                  <table class="table table-borderless text-white">
                      ${tableRows}
                  </table>
              </div>
          </div>
        </div>
    `;
}
// ======================================================================
// 6. INITIALIZATION (TIDAK BERUBAH SIGNIFIKAN)
// ======================================================================

// secret interactions
const goldenEl = document.getElementById('golden');
if(goldenEl) {
    goldenEl.addEventListener('click', () => {
        alert('✨ Semoga harimu penuh keberuntungan, fans XingQiu! ⭐🍂');
    });
}

// KONTEN DEMO ASSET 
if (load(keys.photos).length === 0) {
    const demoPhotos = [
        { 
            id: uid(), 
            name: 'Foto XingQiu', 
            url: 'assets/xingqiu_demo.jpg', 
            type: 'image/jpeg', 
            created: Date.now() 
        },
    ];
    save(keys.photos, demoPhotos);
}

if (load(keys.video).length === 0) {
    const demoVideos = [
        { 
            id: uid(), 
            title: 'XingQiu', 
            url: 'assets/xingqiu_demo_trailer.mp4', 
            type: 'video/mp4', 
            created: Date.now() 
        },
    ];
    save(keys.video, demoVideos);
}

// Panggil semua fungsi render
renderProfileCard(); 
renderFotos();
renderVideo();
renderFans();
