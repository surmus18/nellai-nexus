/**
 * Nellai Nexus - Cottage Gallery Modal & Lightbox Logic
 */

let currentGalleryCottage = null;
let currentGalleryIndex = 1;

function openCottageGallery(cottageId, startIdx = 1) {
  if (typeof COTTAGES_DATA === 'undefined' || !COTTAGES_DATA[cottageId]) {
    console.error('Cottage data not found for:', cottageId);
    return;
  }

  currentGalleryCottage = COTTAGES_DATA[cottageId];
  const images = currentGalleryCottage.images || [];

  if (images.length === 0) return;

  // If startIdx is out of range, default to 0
  if (startIdx >= images.length || startIdx < 0) {
    currentGalleryIndex = 0;
  } else {
    currentGalleryIndex = startIdx;
  }

  const modal = document.getElementById('cottageGalleryModal');
  const titleEl = document.getElementById('galleryCottageTitle');
  const thumbsContainer = document.getElementById('galleryThumbnails');
  const waBtn = document.getElementById('galleryWhatsAppBtn');

  if (titleEl) {
    titleEl.textContent = currentGalleryCottage.title;
  }

  // Set WhatsApp button link
  if (waBtn) {
    const waText = encodeURIComponent(`Hello Nellai Nexus, I saw photos of *${currentGalleryCottage.title}* (Courtallam) on your website. Kindly share availability, check-in details, and tariff.`);
    waBtn.href = `https://wa.me/919626272818?text=${waText}`;
  }

  // Build Thumbnail Strip
  if (thumbsContainer) {
    thumbsContainer.innerHTML = '';
    images.forEach((imgSrc, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `gallery-thumb-btn shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition ${
        idx === currentGalleryIndex ? 'border-brandPink scale-105 shadow-md' : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white'
      }`;
      btn.setAttribute('aria-label', `Thumbnail ${idx + 1}`);
      btn.onclick = () => showGalleryImage(idx);

      const thumbImg = document.createElement('img');
      thumbImg.src = imgSrc;
      thumbImg.alt = `${currentGalleryCottage.title} Photo ${idx + 1}`;
      thumbImg.className = 'w-full h-full object-cover';
      thumbImg.loading = 'lazy';

      btn.appendChild(thumbImg);
      thumbsContainer.appendChild(btn);
    });
  }

  // Display initial image
  showGalleryImage(currentGalleryIndex);

  // Show modal
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function showGalleryImage(idx) {
  if (!currentGalleryCottage || !currentGalleryCottage.images) return;
  const images = currentGalleryCottage.images;
  const total = images.length;

  if (idx < 0) idx = total - 1;
  if (idx >= total) idx = 0;
  currentGalleryIndex = idx;

  const mainImg = document.getElementById('galleryMainImg');
  const counterEl = document.getElementById('galleryCounter');
  const labelEl = document.getElementById('galleryPhotoLabel');

  if (mainImg) {
    mainImg.style.opacity = '0.3';
    mainImg.src = images[idx];
    mainImg.onload = () => {
      mainImg.style.opacity = '1';
    };
  }

  if (counterEl) {
    counterEl.textContent = `Photo ${idx + 1} of ${total}`;
  }

  if (labelEl) {
    labelEl.textContent = idx === 0 ? 'Cover Photo' : `Interior & Facility Photo ${idx}`;
  }

  // Update active thumbnail styling
  const thumbBtns = document.querySelectorAll('.gallery-thumb-btn');
  thumbBtns.forEach((btn, i) => {
    if (i === idx) {
      btn.className = 'gallery-thumb-btn shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 border-brandPink scale-105 shadow-md transition';
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      btn.className = 'gallery-thumb-btn shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 border-white/20 opacity-60 hover:opacity-100 hover:border-white transition';
    }
  });
}

function nextGalleryImage() {
  if (!currentGalleryCottage) return;
  showGalleryImage(currentGalleryIndex + 1);
}

function prevGalleryImage() {
  if (!currentGalleryCottage) return;
  showGalleryImage(currentGalleryIndex - 1);
}

function closeCottageGallery() {
  const modal = document.getElementById('cottageGalleryModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

function bookFromGallery() {
  if (!currentGalleryCottage) return;
  const title = currentGalleryCottage.title;
  closeCottageGallery();
  if (typeof selectStayForBooking === 'function') {
    selectStayForBooking(title, 'Courtallam');
  }
}

// Global Keyboard Navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('cottageGalleryModal');
  if (!modal || modal.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    closeCottageGallery();
  } else if (e.key === 'ArrowRight') {
    nextGalleryImage();
  } else if (e.key === 'ArrowLeft') {
    prevGalleryImage();
  }
});
