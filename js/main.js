// 1. Initialize Lucide Icons with exactly 1.5 stroke width
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons({
      attrs: {
        'stroke-width': 1.5
      }
    });
  }
  initVariableFontProximity();
  initScrollReveal();
  initNavScroll();
  initNavScrollSpy();
  initHeroDrift();
  initThreeMesh();
  initMobileMenu();
  initToastNotification();
  initServiceModals();
});

// 2. Custom "wchar" variable font weight interaction (600 base to 900 on mouse proximity < 200px)
function initVariableFontProximity() {
  const headingElements = document.querySelectorAll('h1, h2');
  const wcharSpans = [];

  headingElements.forEach(el => {
    wrapTextNodesWithWchar(el, wcharSpans);
  });

  window.addEventListener('pointermove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    wcharSpans.forEach(span => {
      const rect = span.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - charCenterX, mouseY - charCenterY);

      if (dist < 200) {
        const weight = Math.round(600 + (1 - dist / 200) * 300);
        span.style.fontVariationSettings = `'wght' ${weight}`;
      } else {
        span.style.fontVariationSettings = "'wght' 600";
      }
    });

    // Parallax Bloom Shift
    const bloom = document.getElementById('bloom');
    if (bloom) {
      const shiftX = (mouseX / window.innerWidth - 0.5) * 40;
      const shiftY = (mouseY / window.innerHeight - 0.5) * 40;
      bloom.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    }
  });
}

function wrapTextNodesWithWchar(node, list) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent;
    if (!text.trim()) return;

    // Split text into words and whitespace parts to avoid breaking line wraps
    const parts = text.split(/(\s+)/);
    const fragment = document.createDocumentFragment();

    parts.forEach(part => {
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
      } else if (part.length > 0) {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        for (let char of part) {
          const span = document.createElement('span');
          span.className = 'wchar';
          span.textContent = char;
          list.push(span);
          wordSpan.appendChild(span);
        }
        fragment.appendChild(wordSpan);
      }
    });

    node.parentNode.replaceChild(fragment, node);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Skip element nodes that shouldn't be fragmented (badges, pills, icons, serif accents, buttons)
    if (node.classList.contains('no-wchar') ||
      node.closest('.no-wchar') ||
      node.classList.contains('wchar') ||
      node.hasAttribute('data-lucide') ||
      node.classList.contains('font-serif-accent') ||
      node.tagName === 'BUTTON' ||
      node.tagName === 'I' ||
      node.tagName === 'SVG') {
      return;
    }
    Array.from(node.childNodes).forEach(child => wrapTextNodesWithWchar(child, list));
  }
}

// 3. Three.js Canvas (#meshGL): Faceted IcosahedronGeometry(3, 0)
function initThreeMesh() {
  const canvas = document.getElementById('meshGL');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 10;

  // Geometry: 0xE34A32, roughness 0.3, metalness 0.6, flatShading: true
  const geometry = new THREE.IcosahedronGeometry(3, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xE34A32,
    roughness: 0.3,
    metalness: 0.6,
    flatShading: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xF05A3C, 1.5, 50);
  pointLight.position.set(-5, -5, 5);
  scene.add(pointLight);

  function updateSizeAndPosition() {
    if (!canvas.parentElement) return;
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Mesh positioning: x=4.5 for desktop (>= 1024px) and x=0 for mobile
    if (window.innerWidth >= 1024) {
      mesh.position.x = 4.5;
      mesh.scale.set(1.15, 1.15, 1.15);
    } else {
      mesh.position.x = 0;
      mesh.scale.set(0.85, 0.85, 0.85);
    }
  }

  window.addEventListener('resize', updateSizeAndPosition);
  updateSizeAndPosition();

  // Float animation: Math.sin(t * 1.2) * 0.3
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mesh.rotation.y = t * 0.35;
    mesh.rotation.x = t * 0.2;
    mesh.position.y = Math.sin(t * 1.2) * 0.3;

    renderer.render(scene, camera);
  }
  animate();
}

// 4. Hero Drift: Three-tile stack with translateY oscillation using Math.sin(t + i * 2) * 6
function initHeroDrift() {
  const driftTiles = document.querySelectorAll('[data-drift]');
  if (!driftTiles.length) return;

  let startTime = performance.now();
  function loop() {
    const t = (performance.now() - startTime) / 1000;
    driftTiles.forEach((tile, i) => {
      const offsetY = Math.sin(t * 1.5 + i * 2) * 6;
      tile.style.transform = `translateY(${offsetY}px)`;
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

// 5. Nav Shadow & Scroll Handling
function initNavScroll() {
  const navContainer = document.getElementById('navContainer');
  if (!navContainer) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      navContainer.classList.add('scrolled-header');
    } else {
      navContainer.classList.remove('scrolled-header');
    }
  });
}

// 6. Active Nav Link ScrollSpy
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link, #mobileMenu a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active', 'text-[#E34A32]');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active', 'text-[#E34A32]');
      }
    });
  });
}

// 7. IntersectionObserver for data-rise & data-reveal
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('[data-rise], [data-reveal]').forEach(el => observer.observe(el));
}

// 8. Mobile Menu Toggle & Auto-close on link click
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Auto close mobile menu on clicking any link inside it
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// 9. Toast Notification System
function initToastNotification() {
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toastNotification';
  toastContainer.className = 'toast-notification bg-[#171719] text-white px-5 py-3.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 text-xs font-medium';
  toastContainer.innerHTML = `
    <div class="w-2 h-2 rounded-full bg-[#E34A32] animate-pulse"></div>
    <span id="toastMessage">Terima kasih! Layanan notifikasi BPS 3524 telah terdaftar.</span>
  `;
  document.body.appendChild(toastContainer);
}

function showToast(message, duration = 3500) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Global scope window.showToast for form triggers
window.showToast = showToast;

// 10. Interactive Service Detail Modal
function initServiceModals() {
  const serviceData = {
    'pst': {
      title: 'Pelayanan Statistik Terpadu (PST)',
      category: 'PST Center',
      icon: 'database',
      description: 'Layanan terpadu BPS Kabupaten Lamongan untuk kebutuhan data mikro, peta digital, publikasi berkala, dan konsultasi statistik.',
      features: [
        'Standar pelayanan cepat 1 hari kerja',
        'Konsultasi statistik gratis tatap muka atau virtual',
        'Penjualan & permintaan tabel mikro terverifikasi',
        'Akses koleksi perpustakaan statistik fisik & digital'
      ],
      link: 'https://lamongankab.bps.go.id',
      linkText: 'Akses Portal PST BPS'
    },
    'romantik': {
      title: 'Rekomendasi Kegiatan Statistik (ROMANTIK)',
      category: 'ROMANTIK',
      icon: 'file-check-2',
      description: 'Pendampingan bagi Perangkat Daerah (OPD) Pemkab Lamongan dalam penerbitan Surat Rekomendasi Kegiatan Statistik Sektoral sesuai Perpres 39/2019.',
      features: [
        'Pemeriksaan metodologi & racangan kuesioner survei',
        'Evaluasi EPSS (Evaluasi Penyelenggaraan Statistik Sektoral)',
        'Standardisasi definisi operasional & variabel statistik',
        'Penerbitan Surat Rekomendasi Resmi BPS 3524'
      ],
      link: 'https://romantik.bps.go.id',
      linkText: 'Buka Portal ROMANTIK'
    },
    'halo-pst': {
      title: 'HALO PST WhatsApp Lamongan',
      category: 'WhatsApp Official',
      icon: 'message-square',
      description: 'Asisten virtual dan Customer Officer responsif BPS Lamongan untuk permintaan tabel cepat, konfirmasi jadwal kunjungan, dan pengaduan.',
      features: [
        'Respon cepat Senin - Jumat (07.30 - 16.00 WIB)',
        'Konfirmasi otomatis tabel indikator inflasi & PDRB',
        'Reservasi jadwal konsultasi statistik tatap muka',
        'Informasi syarat & prosedur pengajuan rekomendasi'
      ],
      link: 'https://wa.me/6285111383218',
      linkText: 'Chat via WhatsApp PST'
    },
    'elibrary': {
      title: 'E-Library & Publikasi Daerah',
      category: 'E-Library',
      icon: 'book-open',
      description: 'Perpustakaan digital resmi BPS Kabupaten Lamongan yang menyediakan unduhan gratis publikasi statistik daerah dalam format PDF & XLSX.',
      features: [
        'Lamongan Dalam Angka (Edisi Tahunan Lengkap)',
        'Statistik Daerah & Indikator Kesejahteraan Rakyat',
        'Profil Kemiskinan & Produk Domestik Regional Bruto',
        'Hasil Sensus Pertanian, Penduduk & Ekonomi'
      ],
      link: 'https://lamongankab.bps.go.id/publication.html',
      linkText: 'Unduh Publikasi PDF'
    },
    'zi-pengaduan': {
      title: 'Zona Integritas & Pengaduan (WBK)',
      category: 'WBK / WBM',
      icon: 'shield-check',
      description: 'Komitmen BPS Kabupaten Lamongan dalam mewujudkan Wilayah Bebas dari Korupsi (WBK) & Wilayah Birokrasi Bersih dan Melayani (WBBM).',
      features: [
        'Pencegahan gratifikasi, pungli, & benturan kepentingan',
        'Whistleblowing System (WBS) BPS RI yang aman & rahasia',
        'Integrasi SP4N LAPOR BPS 3524',
        'Jaminan kepastian & transparansi tarif Rp 0 (Gratis)'
      ],
      link: 'https://wbs.bps.go.id',
      linkText: 'Akses Portal WBS / Pengaduan'
    },
    'api-soto': {
      title: 'Konektor Satu Data API (SDMX)',
      category: 'API Portal',
      icon: 'code-2',
      description: 'Antarmuka API RESTful terstandar SDMX untuk mengagregasi indikator makro desa dan kecamatan secara otomatis ke sistem pemerintah daerah.',
      features: [
        'Format Data SDMX, JSON, CSV, & GeoJSON',
        'Dokumentasi Webhook SOTO & API Key Access',
        'Metadata baku sesuai standar Satu Data Indonesia',
        'Dukungan sinkronisasi otomatis dashboard desa'
      ],
      link: 'https://lamongankab.bps.go.id',
      linkText: 'Akses Portal BPS Lamongan'
    }
  };

  // Create Modal Container in DOM
  const modalMarkup = `
    <div id="serviceModal" class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="modal-content bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/80 shadow-2xl relative text-[#2E3034]">
        <button id="closeModalBtn" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
          <i data-lucide="x" class="w-4 h-4 text-[#2E3034]"></i>
        </button>
        
        <div class="flex items-center gap-3 mb-4">
          <span id="modalCategory" class="text-xs font-semibold px-3 py-1 rounded-full bg-[#E34A32]/10 text-[#E34A32]">Category</span>
          <span class="text-xs font-semibold text-gray-400">BPS 3524</span>
        </div>

        <h3 id="modalTitle" class="text-2xl font-bold text-[#171719] mb-3">Service Title</h3>
        <p id="modalDesc" class="text-sm text-[#55575c] leading-relaxed mb-6">Service Description...</p>

        <div class="space-y-2.5 mb-8 text-xs text-[#2E3034] bg-[#F4F5F5] p-4 rounded-2xl border border-black/5" id="modalFeatures">
          <!-- Dynamic Features -->
        </div>

        <div class="flex items-center justify-between gap-3 pt-2">
          <button id="modalDismissBtn" class="px-5 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold transition-colors">
            Tutup
          </button>
          <a id="modalActionLink" href="#" target="_blank" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#171719] hover:bg-[#E34A32] text-white text-xs font-semibold transition-colors">
            <span id="modalLinkText">Kunjungi Portal</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalMarkup);

  const modal = document.getElementById('serviceModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');

  function closeModal() {
    modal.classList.remove('is-open');
  }

  closeBtn.addEventListener('click', closeModal);
  dismissBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Attach click events to service cards
  const serviceCards = document.querySelectorAll('#layanan .grid > div');
  const serviceKeys = ['pst', 'romantik', 'halo-pst', 'elibrary', 'zi-pengaduan', 'api-soto'];

  serviceCards.forEach((card, index) => {
    const key = serviceKeys[index];
    if (!key) return;

    card.classList.add('cursor-pointer');
    card.addEventListener('click', (e) => {
      // Avoid triggering if user clicked directly on link inside card
      if (e.target.closest('a')) return;

      const data = serviceData[key];
      if (!data) return;

      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalDesc').textContent = data.description;

      const featuresEl = document.getElementById('modalFeatures');
      featuresEl.innerHTML = data.features.map(f => `
        <div class="flex items-center gap-2">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-[#E34A32] flex-shrink-0"></i>
          <span>${f}</span>
        </div>
      `).join('');

      const actionLink = document.getElementById('modalActionLink');
      actionLink.href = data.link;
      document.getElementById('modalLinkText').textContent = data.linkText;

      if (window.lucide) {
        lucide.createIcons({
          attrs: { 'stroke-width': 1.5 }
        });
      }

      modal.classList.add('is-open');
    });
  });

  // Global Helper for Quick Access Circle Buttons
  window.openServiceModalByKey = function (key) {
    const data = serviceData[key];
    if (!data) return;

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalDesc').textContent = data.description;

    const featuresEl = document.getElementById('modalFeatures');
    featuresEl.innerHTML = data.features.map(f => `
      <div class="flex items-center gap-2">
        <i data-lucide="check-circle-2" class="w-4 h-4 text-[#E34A32] flex-shrink-0"></i>
        <span>${f}</span>
      </div>
    `).join('');

    const actionLink = document.getElementById('modalActionLink');
    actionLink.href = data.link;
    document.getElementById('modalLinkText').textContent = data.linkText;

    if (window.lucide) {
      lucide.createIcons({
        attrs: { 'stroke-width': 1.5 }
      });
    }

    modal.classList.add('is-open');
  };
}

// 11. Admin Login Modal Handler
function initAdminLoginModal() {
  const adminBtn = document.getElementById('adminLoginBtn');
  const mobileAdminBtn = document.getElementById('mobileAdminLoginBtn');
  const modal = document.getElementById('adminLoginModal');
  const closeBtn = document.getElementById('closeAdminLoginBtn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('is-open');
  }
  function closeModal() {
    modal.classList.remove('is-open');
  }

  if (adminBtn) adminBtn.addEventListener('click', openModal);
  if (mobileAdminBtn) mobileAdminBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// 12. QnA Accordion Handler
function initQnaAccordion() {
  const triggers = document.querySelectorAll('.qna-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('[data-lucide="chevron-down"]');

      if (content) {
        const isHidden = content.classList.contains('hidden');
        content.classList.toggle('hidden');
        if (icon) {
          icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    });
  });
}

// Call new initializers on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initAdminLoginModal();
  initQnaAccordion();
});

// Admin Login Handler
window.handleLogin = function (event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Test credentials: admin@bps.go.id / admin123
  if (email === 'admin@bps.go.id' && password === 'admin123') {
    showToast('Login SSO Admin berhasil. Selamat datang!');
    document.getElementById('adminLoginModal').classList.remove('is-open');

    // Redirect to admin dashboard after short delay
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1000);
  } else {
    showToast('Login gagal. Email atau kata sandi salah.', 'error');
  }
};

// Load custom stats from PHP API (fallback to localStorage for Vercel)
async function loadCustomStats() {
  let stats = null;

  try {
    // Try fetching from Laragon PHP backend
    const response = await fetch('api/get_stats.php');
    const result = await response.json();
    if (result.status === 'success') {
      stats = result.data;
    }
  } catch (err) {
    console.warn("PHP API not reachable, falling back to localStorage.");
  }

  // Fallback to localStorage if PHP is not available
  if (!stats) {
    const savedData = localStorage.getItem('soto_vital_stats');
    if (savedData) {
      try {
        stats = JSON.parse(savedData);
      } catch (e) {
        console.error("Error parsing localStorage stats", e);
      }
    }
  }

  if (stats) {
    try {
      // Update Hero Stats if they exist
      if(stats.hero1_val && document.getElementById('hero1-val')) document.getElementById('hero1-val').textContent = stats.hero1_val;
      if(stats.hero1_l1 && document.getElementById('hero1-l1')) document.getElementById('hero1-l1').textContent = stats.hero1_l1;
      
      if(stats.hero2_val && document.getElementById('hero2-val')) document.getElementById('hero2-val').textContent = stats.hero2_val;
      if(stats.hero2_l1 && document.getElementById('hero2-l1')) document.getElementById('hero2-l1').textContent = stats.hero2_l1;
      if(stats.hero2_sub && document.getElementById('hero2-sub')) document.getElementById('hero2-sub').textContent = stats.hero2_sub;
      
      if(stats.hero3_val && document.getElementById('hero3-val')) document.getElementById('hero3-val').textContent = stats.hero3_val;
      if(stats.hero3_l1 && document.getElementById('hero3-l1')) document.getElementById('hero3-l1').textContent = stats.hero3_l1;

      // Update Pill 1
      if (document.getElementById('stat1-val')) document.getElementById('stat1-val').textContent = stats.p1_val || stats.p1_val;
      if (document.getElementById('stat1-l1')) document.getElementById('stat1-l1').textContent = stats.p1_l1;
      if (document.getElementById('stat1-l2')) document.getElementById('stat1-l2').textContent = stats.p1_l2;
      if (document.getElementById('stat1-badge')) document.getElementById('stat1-badge').textContent = stats.p1_badge;

      // Update Pill 2
      if (document.getElementById('stat2-val')) document.getElementById('stat2-val').textContent = stats.p2_val;
      if (document.getElementById('stat2-l1')) document.getElementById('stat2-l1').textContent = stats.p2_l1;
      if (document.getElementById('stat2-l2')) document.getElementById('stat2-l2').textContent = stats.p2_l2;
      if (document.getElementById('stat2-badge')) document.getElementById('stat2-badge').textContent = stats.p2_badge;

      // Update Pill 3
      if (document.getElementById('stat3-val')) document.getElementById('stat3-val').textContent = stats.p3_val;
      if (document.getElementById('stat3-l1')) document.getElementById('stat3-l1').textContent = stats.p3_l1;
      if (document.getElementById('stat3-l2')) document.getElementById('stat3-l2').textContent = stats.p3_l2;
      if (document.getElementById('stat3-badge')) document.getElementById('stat3-badge').textContent = stats.p3_badge;
    } catch (e) {
      console.error("Error updating stats DOM", e);
    }
  }
}

// Ensure Feedback form submits to PHP
function initFeedbackModal() {
  const openBtn = document.getElementById('openFeedbackBtn');
  const closeBtn = document.getElementById('closeFeedbackBtn');
  const modal = document.getElementById('feedbackModal');
  const form = document.getElementById('feedbackForm');

  if (openBtn && closeBtn && modal) {
    modal.style.display = 'none';

    openBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
      modal.classList.add('is-open');
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      modal.classList.remove('is-open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        modal.classList.remove('is-open');
      }
    });

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputs = form.querySelectorAll('input, textarea');
        const data = {
          nama: inputs[0].value,
          email: inputs[1].value,
          pesan: inputs[2].value
        };

        try {
          // Send to PHP API
          const response = await fetch('api/save_feedback.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if(response.ok) {
            showToast('Terima kasih! Masukan Anda telah berhasil dikirim ke database.', 'info');
          } else {
            throw new Error('API failed');
          }
        } catch(err) {
          // Fallback if PHP not working
          console.warn("Fallback to local storage for feedback");
          let feedbacks = JSON.parse(localStorage.getItem('soto_feedbacks') || '[]');
          feedbacks.push({...data, tanggal: new Date().toISOString()});
          localStorage.setItem('soto_feedbacks', JSON.stringify(feedbacks));
          showToast('Masukan disimpan secara lokal (PHP API tidak ditemukan).', 'info');
        }

        modal.style.display = 'none';
        modal.classList.remove('is-open');
        form.reset();
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCustomStats();
  initFeedbackModal();
});
