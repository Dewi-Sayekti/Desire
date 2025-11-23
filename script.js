// Utilities
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const keys = {
    photos: 'desire_photos_v1',
    audio: 'desire_audio_v1',
    video: 'desire_video_v1',
};

// simple storage helpers
function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
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

// initial loader
window.addEventListener('load', () => {
    setTimeout(() => (document.getElementById('loader').style.display = 'none'), 800);
});

// create twinkling stars randomly
const starsEl = document.getElementById('stars');
for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'star-twinkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDuration = 2 + Math.random() * 4 + 's';
    s.style.opacity = 0.6 + Math.random() * 0.5;
    starsEl.appendChild(s);
}

// falling leaves (decorative) - random shapes
const leafContainer = document.getElementById('leaf-container');
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

// Inisialisasi Modal untuk media (perlu dipertahankan)
const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));

// --- BAGIAN PROFIL STATIS BARU (Kartu Penuh) ---
const profileContainer = document.getElementById('profileCardContainer');

// Data Biodata Statis (Dibuat sebagai array, tapi kita akan pakai item [0])
const STATIC_PROFILES_DATA = [
    {
        id: 'xingqiu-main', 
        title: "Qiu Ding Jie (邱鼎杰)", 
        subtitle: "Kipuka", 
        name: "XingQiu", 
        status: "Kipuka qiu", 
        
        // Data Biografi Lengkap
        TTL: ": Shanghai, China 3 April 1998",
        Zodiak: ": Aries",
        Shio: ": Harimau",
        Tinggi: ": 185 cm (6′0″)",
        Berat: ": 70 kg (154 lbs)",
        Profesi: ": Aktor",
        Company: ": Shanghai Yile Culture",
        // Menggunakan HTML tag di sini agar link bisa langsung berfungsi
        Weibo: ': <a href="https://weibo.com/u/7464197479" target="_blank" class="text-info">@邱鼎杰_kipuka</a>',
        Instagram: ': <a href="https://www.instagram.com/kipuka_qiu" target="_blank" class="text-info">@kipuka_qiu</a>',
        bio: " Meski lahir di Shanghai, ia memiliki akar keluarga dari Provinsi Fujian. Kiprah seninya dimulai sejak ia menempuh pendidikan di Shanghai Film Academy. Ia lulus dari Departemen Seni Peran dan berada di bawah naungan agensi Shanghai Yile Culture. Sejak itu, ia aktif membangun reputasi sebagai aktor dengan karakteristik khas. Qiu dikenal memiliki nama panggilan Kipuka di kalangan penggemarnya. Kepribadiannya yang kalem di luar layar membuatnya digemari banyak penggemar drama Tiongkok.",
        photoUrl: "assets/Kipuka.jpg", // Pastikan file ini ada
        city: "Tiongkok",
    }
];

// FUNGSI UTAMA BARU: Render Kartu Profil Penuh
function renderProfileCard() {
    const p = STATIC_PROFILES_DATA[0];
    
    if (!profileContainer || !p) {
        if(profileContainer) {
             profileContainer.innerHTML = '<div class="muted">Tidak ada data profil statis yang dimuat.</div>';
        }
        return;
    }

    // List kunci data yang ingin dimasukkan ke dalam tabel detail
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

    // Generate baris tabel secara dinamis
    const tableRows = detailKeys.map(d => {
        const value = (d.key === 'Weibo' || d.key === 'Instagram') ? p[d.key] : escapeHtml(p[d.key] || 'N/A');
        
        if (value) {
            return `
                <tr>
                    <td class="muted" style="width:120px;">${d.label}</td>
                    <td>${value}</td>
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
                  
                  <p class="mt-4 text-white">
                      <strong>${escapeHtml(p.status)}:</strong>
                  </p>
                  <p class="text-white">
                      ${escapeHtml(p.bio)}
                  </p>
              </div>
          </div>
        </div>
    `;
}

// --- AKHIR BAGIAN PROFIL STATIS BARU ---


// Foto gallery
const fotoForm = document.getElementById('fotoForm');
const fotoGallery = document.getElementById('fotoGallery');
function renderFotos() {
// ... (Kode renderFotos tetap sama) ...
    const arr = load(keys.photos);
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
fotoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const files = document.getElementById('fotoFile').files;
    if (!files.length) return;
    const arr = load(keys.photos);
    for (const f of files) {
        // Menggunakan URL objek sementara untuk preview
        const url = createTempUrl(f); 
        arr.unshift({ id: uid(), name: f.name, type: f.type, url, created: Date.now() });
    }
    save(keys.photos, arr);
    fotoForm.reset();
    renderFotos();
});
// Memanggil renderFotos() di akhir skrip


// Video list
const videoForm = document.getElementById('videoForm');
const videoList = document.getElementById('videoList');
function renderVideo() {
// ... (Kode renderVideo tetap sama) ...
    const arr = load(keys.video);
    if (arr.length === 0) {
        videoList.innerHTML = '<div class="muted">Belum ada film.</div>';
        return;
    }
    videoList.innerHTML = arr
        .map(
            (v) => `
            <div class="list-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div><strong>${escapeHtml(v.title || v.name || 'Untitled')}</strong><div class="muted small">${new Date(v.created).toLocaleString()}</div>
                    </div>
                    <div>
                        <video controls width="220" src="${v.url}">
                        </video>
                        <button class="btn btn-sm btn-outline-light btn-del" data-id="${v.id}">Hapus</button>
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
videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = document.getElementById('videoFile').files[0];
    const title = document.getElementById('videoTitle').value.trim();
    if (!f) {
        alert('Pilih file video');
        return;
    }
    // Menggunakan URL objek sementara untuk preview
    const url = createTempUrl(f);

    const arr = load(keys.video);
    arr.unshift({ id: uid(), title, name: f.name, type: f.type, url, created: Date.now() });
    save(keys.video, arr);
    videoForm.reset();
    renderVideo();
});
// Memanggil renderVideo() di akhir skrip

// open media in modal
// viewModal sudah dideklarasikan di bagian atas
function openMediaInModal(item) {
// ... (Kode openMediaInModal tetap sama) ...
    if (!item) return;
    document.getElementById('viewTitle').textContent = item.title || item.name || 'Preview';
    const body = document.getElementById('viewBody');
    body.innerHTML = '';
    
    // SELALU gunakan properti 'url' untuk sumber media
    const mediaSource = item.url; 

    if (!mediaSource) {
        body.textContent = 'Sumber media tidak ditemukan.';
    } else if (item.type && item.type.startsWith('image')) {
        const img = document.createElement('img');
        img.src = mediaSource;
        img.className = 'img-fluid rounded';
        body.appendChild(img);
    } else if (item.type && item.type.startsWith('video')) {
        const v = document.createElement('video');
        v.src = mediaSource;
        v.controls = true;
        v.className = 'w-100 rounded';
        body.appendChild(v);
    } else {
        body.textContent = 'Preview not available.';
    }
    viewModal.show();
}

// escape HTML
function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

// simple toast
function showToast(msg) {
// ... (Kode showToast tetap sama) ...
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

// 5. FANS (BIOGRAFI PENGGEMAR) - BAGIAN INI DIPERBAIKI
// ======================================================================

// Mengubah dari 'Fans' ke 'fansList' (Sesuai ID HTML yang sudah diperbaiki)
const fansList = document.getElementById('fansList'); 

// Data Fans Statis (Dibuat array agar lebih mudah ditambah jika diperlukan)
const STATIC_FANS_DATA = [
    {
        id: 'fans-dewi', 
        title: "FansGirl", 
        name: ": Dewi Sayekti Sutrisni",
        semester: ": 5 (Lima)",
        major: ": Informatika",
        photoUrl: "assest/Dewi.jpg",
    }
];

function renderFans() {
    const p = STATIC_FANS_DATA[0]; 
    
    if (!fansList || !p) {
        if(fansList) {
             fansList.innerHTML = '<div class="muted">Tidak ada data profil statis Fans yang dimuat.</div>';
        }
        return;
    }

    const detailKeys = [
        // Menggunakan kunci data yang sudah diperbaiki
        { key: 'name', label: 'Nama' },
        { key: 'semester', label: 'Semester' },
        { key: 'major', label: 'Jurusan' },
    ];
const tableRows = detailKeys.map(d => {
        const value = escapeHtml(p[d.key] || 'N/A');
        
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
        
        // Render ke fansList
    fansList.innerHTML = `
        <div class="col-12">
            <div class="card p-4" style="background: transparent !important; border: 1px solid var(--accent);">
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
                        <p class="muted mb-3">Biografi Penggemar</p>

                        <table class="table table-borderless text-white">
                            ${tableRows}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// secret interactions
document.getElementById('golden').addEventListener('click', () => {
    alert('✨ Semoga harimu penuh keberuntungan, fans XingQiu! ⭐🍂');
});


// **KONTEN DEMO ASSET**
// Memuat data demo jika Local Storage kosong untuk mensimulasikan file di folder 'assets/'
if (load(keys.photos).length === 0) {
    const demoPhotos = [
        { 
            id: uid(), 
            name: 'Foto XingQiu', 
            // URL MENGGUNAKAN PATH RELATIF KE FOLDER ASSET
            url: 'assets/xingqiu_demo.jpg', 
            type: 'image/jpeg', 
            created: Date.now() 
        },
    ];
    save(keys.photos, demoPhotos);
}

// **Tambahkan Demo Video di Sini**
if (load(keys.video).length === 0) {
    const demoVideos = [
        { 
            id: uid(), 
            title: 'XingQiu', 
            url: 'assets/xingqiu_demo_trailer.mp4', 
            type: 'video/mp4', // Pastikan jenis mime sesuai
            created: Date.now() 
        },
    ];
    save(keys.video, demoVideos);
}
// Panggil fungsi render setelah demo data ditambahkan
renderProfileCard(); // Panggilan untuk Profil Statis Baru
renderFotos();
renderVideo();
renderFans();
