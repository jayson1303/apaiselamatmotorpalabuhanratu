// ==========================================================================
// APAI SELAMAT MOTOR PALABUHANRATU
// admin-hero.js - Kelola Hero Section & Banner Promo
// ==========================================================================

import { 
  db, 
  storage, 
  doc, 
  getDoc, 
  setDoc, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "../../js/firebase-config.js";

import { adminAlert } from "./admin-dialogs.js";

export async function initAdminHero() {
  const form = document.getElementById("form-hero");
  if (!form) return;

  // Load current hero data
  try {
    const snap = await getDoc(doc(db, "hero", "main"));
    let data = {};
    if (snap.exists()) {
      data = snap.data();
    } else {
      const res = await fetch("../data/default-settings.json");
      const defaults = await res.json();
      data = defaults.hero || {};
    }

    // Populate inputs
    document.getElementById("hero-input-title").value = data.title || "";
    document.getElementById("hero-input-subtitle").value = data.subtitle || "";
    document.getElementById("hero-input-tagline").value = data.tagline || "";
    document.getElementById("hero-input-cta").value = data.ctaText || "";
    document.getElementById("hero-promo-active").checked = data.promoActive !== false;

    if (data.backgroundUrl) {
      document.getElementById("preview-hero-bg").src = data.backgroundUrl;
      document.getElementById("preview-hero-bg").style.display = "block";
    }
    if (data.promoImageUrl) {
      document.getElementById("preview-hero-promo").src = data.promoImageUrl;
      document.getElementById("preview-hero-promo").style.display = "block";
    }

  } catch (e) {
    console.error("Error loading hero data:", e);
  }

  // Preview local file on change
  setupFilePreview("file-hero-bg", "preview-hero-bg");
  setupFilePreview("file-hero-promo", "preview-hero-promo");

  // Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSave = document.getElementById("btn-save-hero");
    btnSave.disabled = true;
    btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    try {
      const title = document.getElementById("hero-input-title").value.trim();
      const subtitle = document.getElementById("hero-input-subtitle").value.trim();
      const tagline = document.getElementById("hero-input-tagline").value.trim();
      const ctaText = document.getElementById("hero-input-cta").value.trim();
      const promoActive = document.getElementById("hero-promo-active").checked;

      let bgUrl = document.getElementById("preview-hero-bg").src;
      let promoUrl = document.getElementById("preview-hero-promo").src;

      const bgFile = document.getElementById("file-hero-bg").files[0];
      if (bgFile) {
        try {
          const bgRef = ref(storage, `hero/bg_${Date.now()}_${bgFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
          const snap = await uploadBytes(bgRef, bgFile);
          bgUrl = await getDownloadURL(snap.ref);
        } catch (e) {
          console.warn("Storage upload failed for hero bg, using preview src:", e);
          bgUrl = document.getElementById("preview-hero-bg").src;
        }
      }

      const promoFile = document.getElementById("file-hero-promo").files[0];
      if (promoFile) {
        try {
          const promoRef = ref(storage, `hero/promo_${Date.now()}_${promoFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
          const snap = await uploadBytes(promoRef, promoFile);
          promoUrl = await getDownloadURL(snap.ref);
        } catch (e) {
          console.warn("Storage upload failed for hero promo, using preview src:", e);
          promoUrl = document.getElementById("preview-hero-promo").src;
        }
      }

      const updateData = {
        title,
        subtitle,
        tagline,
        ctaText,
        promoActive,
        backgroundUrl: bgUrl,
        promoImageUrl: promoUrl,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "hero", "main"), updateData, { merge: true });
      await adminAlert("Pengaturan Hero & Banner Promo berhasil disimpan!", "Berhasil Disimpan", "success");

    } catch (err) {
      console.error("Gagal simpan hero:", err);
      await adminAlert("Gagal menyimpan data hero: " + err.message, "Gagal Menyimpan", "error");
    } finally {
      btnSave.disabled = false;
      btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan Hero';
    }
  });
}

function setupFilePreview(inputId, imgId) {
  const fileInput = document.getElementById(inputId);
  const img = document.getElementById(imgId);
  if (!fileInput || !img) return;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}
