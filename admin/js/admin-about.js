// ==========================================================================
// APAI SELAMAT MOTOR PALABUHANRATU
// admin-about.js - Kelola Bagian Tentang Kami
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

export async function initAdminAbout() {
  const form = document.getElementById("form-about");
  if (!form) return;

  try {
    const snap = await getDoc(doc(db, "about", "main"));
    let data = {};
    if (snap.exists()) {
      data = snap.data();
    } else {
      const res = await fetch("../data/default-settings.json");
      const defaults = await res.json();
      data = defaults.about || {};
    }

    document.getElementById("about-input-title").value = data.title || "";
    document.getElementById("about-input-desc").value = data.deskripsi || "";

    if (data.foto) {
      const img = document.getElementById("preview-about-img");
      img.src = data.foto;
      img.style.display = "block";
    }

  } catch (err) {
    console.error("Error loading about data:", err);
  }

  // File preview
  const fileInput = document.getElementById("file-about-img");
  const imgPreview = document.getElementById("preview-about-img");
  if (fileInput && imgPreview) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imgPreview.src = e.target.result;
          imgPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btnSave = document.getElementById("btn-save-about");
    btnSave.disabled = true;
    btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    try {
      const title = document.getElementById("about-input-title").value.trim();
      const deskripsi = document.getElementById("about-input-desc").value.trim();
      let fotoUrl = imgPreview ? imgPreview.src : "";

      const file = fileInput?.files[0];
      if (file) {
        try {
          const fileRef = ref(storage, `about/about_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
          const snap = await uploadBytes(fileRef, file);
          fotoUrl = await getDownloadURL(snap.ref);
        } catch (e) {
          console.warn("Storage upload failed for about photo, using preview src:", e);
          fotoUrl = imgPreview ? imgPreview.src : fotoUrl;
        }
      }

      const updateData = {
        title,
        deskripsi,
        foto: fotoUrl,
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "about", "main"), updateData, { merge: true });
      await adminAlert("Bagian Tentang Kami berhasil diperbarui!", "Berhasil Disimpan", "success");

    } catch (err) {
      console.error("Gagal simpan about:", err);
      await adminAlert("Gagal menyimpan data Tentang Kami: " + err.message, "Gagal Menyimpan", "error");
    } finally {
      btnSave.disabled = false;
      btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan Tentang Kami';
    }
  });
}
