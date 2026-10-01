// ==========================================================================
// APAI SELAMAT MOTOR PALABUHANRATU
// admin-hero.js - Kelola Hero Section & Banner Promo
// ==========================================================================

import { 
  db, 
  doc, 
  getDoc, 
  setDoc 
} from "../../js/firebase-config.js";

import { adminAlert } from "./admin-dialogs.js";
import { 
  uploadWithFallback, 
  setupCompressedPreview, 
  formatAdminImageUrl 
} from "./image-utils.js";

export async function initAdminHero() {
  const form = document.getElementById("form-hero");
  if (!form) return;

  let currentBackgroundUrl = "";
  let currentPromoImageUrl = "";

  const fileHeroBg = document.getElementById("file-hero-bg");
  const previewHeroBg = document.getElementById("preview-hero-bg");
  const fileHeroPromo = document.getElementById("file-hero-promo");
  const previewHeroPromo = document.getElementById("preview-hero-promo");

  // Load current hero data
  try {
    const snap = await getDoc(doc(db, "hero", "main"));
    let defaults = {};
    try {
      const res = await fetch("../data/default-settings.json");
      defaults = (await res.json()).hero || {};
    } catch (defaultError) {
      console.warn("Pengaturan hero default tidak dapat dimuat:", defaultError);
    }
    let data = { ...defaults };
    if (snap.exists()) {
      data = { ...data, ...snap.data() };
    }

    // Empty legacy fields must not erase the working site defaults.
    currentBackgroundUrl = data.backgroundUrl || defaults.backgroundUrl || "";
    currentPromoImageUrl = data.promoImageUrl || defaults.promoImageUrl || "";

    // Populate inputs
    document.getElementById("hero-input-title").value = data.title || "";
    document.getElementById("hero-input-subtitle").value = data.subtitle || "";
    document.getElementById("hero-input-tagline").value = data.tagline || "";
    document.getElementById("hero-input-cta").value = data.ctaText || "";
    document.getElementById("hero-promo-active").checked = data.promoActive !== false;

    if (currentBackgroundUrl && previewHeroBg) {
      previewHeroBg.src = formatAdminImageUrl(currentBackgroundUrl);
      previewHeroBg.style.display = "block";
    }
    if (currentPromoImageUrl && previewHeroPromo) {
      previewHeroPromo.src = formatAdminImageUrl(currentPromoImageUrl);
      previewHeroPromo.style.display = "block";
    }

  } catch (e) {
    console.error("Error loading hero data:", e);
  }

  // Setup client-side compressed preview on file selection
  setupCompressedPreview(fileHeroBg, previewHeroBg, {
    maxWidth: 1400,
    maxHeight: 900,
    quality: 0.78,
    maxSizeBytes: 140 * 1024
  });

  setupCompressedPreview(fileHeroPromo, previewHeroPromo, {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.8,
    maxSizeBytes: 120 * 1024
  });

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

      let bgUrl = currentBackgroundUrl;
      let promoUrl = currentPromoImageUrl;

      const bgFile = fileHeroBg?.files?.[0];
      const promoFile = fileHeroPromo?.files?.[0];

      // Upload in parallel if both are selected
      const uploadTasks = [];

      if (bgFile) {
        uploadTasks.push(
          (async () => {
            const bgPath = `hero/bg_${Date.now()}_${bgFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            bgUrl = await uploadWithFallback(bgFile, bgPath, {
              preCompressed: fileHeroBg._compressed,
              maxWidth: 1400,
              maxHeight: 900,
              quality: 0.78,
              maxSizeBytes: 140 * 1024
            });
            currentBackgroundUrl = bgUrl;
          })()
        );
      }

      if (promoFile) {
        uploadTasks.push(
          (async () => {
            const promoPath = `hero/promo_${Date.now()}_${promoFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            promoUrl = await uploadWithFallback(promoFile, promoPath, {
              preCompressed: fileHeroPromo._compressed,
              maxWidth: 1200,
              maxHeight: 800,
              quality: 0.8,
              maxSizeBytes: 120 * 1024
            });
            currentPromoImageUrl = promoUrl;
          })()
        );
      }

      if (uploadTasks.length > 0) {
        await Promise.all(uploadTasks);
      }

      if (!bgUrl || !promoUrl) {
        throw new Error("URL gambar background atau promo kosong. Silakan pilih gambar lalu coba simpan kembali.");
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
      const savedHero = await getDoc(doc(db, "hero", "main"));
      if (!savedHero.exists() || savedHero.data().backgroundUrl !== bgUrl || savedHero.data().promoImageUrl !== promoUrl) {
        throw new Error("Pengaturan belum terkonfirmasi tersimpan. Periksa koneksi dan izin Firestore.");
      }
      currentBackgroundUrl = bgUrl;
      currentPromoImageUrl = promoUrl;
      if (previewHeroBg) previewHeroBg.src = formatAdminImageUrl(bgUrl);
      if (previewHeroPromo) previewHeroPromo.src = formatAdminImageUrl(promoUrl);

      // Clear file inputs so re-submitting doesn't re-upload
      if (fileHeroBg) fileHeroBg.value = "";
      if (fileHeroPromo) fileHeroPromo.value = "";

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
