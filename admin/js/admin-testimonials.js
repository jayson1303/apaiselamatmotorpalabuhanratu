// ==========================================================================
// APAI SELAMAT MOTOR PALABUHANRATU
// admin-testimonials.js - CRUD Kelola Testimoni Pelanggan
// ==========================================================================

import { 
  db, 
  storage, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "../../js/firebase-config.js";

import { adminAlert, adminConfirm } from "./admin-dialogs.js";

let testimonialsList = [];
let editingTestiId = null;

export async function initAdminTestimonials() {
  await loadTestimonialsTable();

  // Add Button
  const btnAdd = document.getElementById("btn-add-testi");
  if (btnAdd) {
    btnAdd.addEventListener("click", () => openTestiModal());
  }

  // Close Modal Button
  const btnClose = document.getElementById("modal-testi-close");
  const modal = document.getElementById("modal-testi");
  if (btnClose && modal) {
    btnClose.addEventListener("click", () => modal.classList.remove("active"));
  }

  // File preview
  const fileInput = document.getElementById("testi-input-foto");
  const imgPreview = document.getElementById("preview-testi-img");
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

  // Form Submit
  const form = document.getElementById("form-testi");
  if (form) {
    form.addEventListener("submit", handleSaveTestimonial);
  }
}

async function loadTestimonialsTable() {
  const tbody = document.getElementById("tbody-testimonials");
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat testimoni...</td></tr>';

  try {
    const snap = await getDocs(collection(db, "testimonials"));
    testimonialsList = [];
    snap.forEach(d => {
      testimonialsList.push({ id: d.id, ...d.data() });
    });

    if (testimonialsList.length === 0) {
      // Fallback
      const res = await fetch("../data/seed-testimonials.json");
      testimonialsList = await res.json();
    }
  } catch (err) {
    console.warn("Firestore error, loading fallback testimonials:", err);
    try {
      const res = await fetch("../data/seed-testimonials.json");
      testimonialsList = await res.json();
    } catch (e) {
      testimonialsList = [];
    }
  }

  // Update counter
  const badgeCount = document.getElementById("metric-testi-count");
  if (badgeCount) badgeCount.textContent = testimonialsList.length;

  renderTestimonialsTable();
}

function renderTestimonialsTable() {
  const tbody = document.getElementById("tbody-testimonials");
  if (!tbody) return;

  if (testimonialsList.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 24px; color: #94A3B8;">Belum ada testimoni. Klik "+ Tambah Testimoni" untuk menambahkan.</td></tr>';
    return;
  }

  tbody.innerHTML = "";
  testimonialsList.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <img src="${t.foto || '../assets/img/logo/logo.png'}" alt="${t.nama}" class="table-thumb" onerror="this.src='../assets/img/logo/logo.png'">
      </td>
      <td><strong>${t.nama || 'Konsumen'}</strong></td>
      <td>
        <span style="color: #F59E0B;">
          ${Array(t.rating || 5).fill('<i class="fa-solid fa-star"></i>').join("")}
        </span>
      </td>
      <td style="max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        "${t.komentar || ''}"
      </td>
      <td>
        <div class="table-action-btns">
          <button type="button" class="btn-tbl-edit" data-id="${t.id}"><i class="fa-solid fa-pen"></i> Edit</button>
          <button type="button" class="btn-tbl-delete" data-id="${t.id}"><i class="fa-solid fa-trash"></i> Hapus</button>
        </div>
      </td>
    `;

    tr.querySelector(".btn-tbl-edit").addEventListener("click", () => openTestiModal(t));
    tr.querySelector(".btn-tbl-delete").addEventListener("click", () => handleDeleteTesti(t.id));

    tbody.appendChild(tr);
  });
}

function openTestiModal(data = null) {
  const modal = document.getElementById("modal-testi");
  const modalTitle = document.getElementById("modal-testi-title");
  const inputNama = document.getElementById("testi-input-nama");
  const inputRating = document.getElementById("testi-input-rating");
  const inputKomentar = document.getElementById("testi-input-komentar");
  const imgPreview = document.getElementById("preview-testi-img");
  const fileInput = document.getElementById("testi-input-foto");

  if (!modal) return;
  fileInput.value = "";

  if (data) {
    editingTestiId = data.id;
    modalTitle.textContent = "Edit Testimoni Konsumen";
    inputNama.value = data.nama || "";
    inputRating.value = data.rating || 5;
    inputKomentar.value = data.komentar || "";
    if (data.foto) {
      imgPreview.src = data.foto;
      imgPreview.style.display = "block";
    } else {
      imgPreview.style.display = "none";
    }
  } else {
    editingTestiId = null;
    modalTitle.textContent = "Tambah Testimoni Baru";
    inputNama.value = "";
    inputRating.value = 5;
    inputKomentar.value = "";
    imgPreview.src = "";
    imgPreview.style.display = "none";
  }

  modal.classList.add("active");
}

async function handleSaveTestimonial(e) {
  e.preventDefault();
  const btnSave = document.getElementById("btn-save-testi");
  btnSave.disabled = true;
  btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

  try {
    const nama = document.getElementById("testi-input-nama").value.trim();
    const rating = parseInt(document.getElementById("testi-input-rating").value);
    const komentar = document.getElementById("testi-input-komentar").value.trim();
    const fileInput = document.getElementById("testi-input-foto");
    const imgPreview = document.getElementById("preview-testi-img");

    let fotoUrl = imgPreview ? imgPreview.src : "";
    const file = fileInput?.files[0];
    if (file) {
      try {
        const fileRef = ref(storage, `testimonials/testi_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
        const snap = await uploadBytes(fileRef, file);
        fotoUrl = await getDownloadURL(snap.ref);
      } catch (e) {
        console.warn("Storage upload failed for testimonial, using preview src:", e);
        fotoUrl = imgPreview ? imgPreview.src : fotoUrl;
      }
    }

    const payload = {
      nama,
      rating,
      komentar,
      foto: fotoUrl,
      updatedAt: new Date().toISOString()
    };

    if (editingTestiId) {
      await setDoc(doc(db, "testimonials", editingTestiId), payload, { merge: true });
    } else {
      await addDoc(collection(db, "testimonials"), payload);
    }

    document.getElementById("modal-testi").classList.remove("active");
    await adminAlert("Testimoni konsumen berhasil disimpan!", "Berhasil Disimpan", "success");
    await loadTestimonialsTable();

  } catch (err) {
    console.error("Gagal simpan testimoni:", err);
    await adminAlert("Gagal menyimpan testimoni: " + err.message, "Gagal Menyimpan", "error");
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Testimoni';
  }
}

async function handleDeleteTesti(id) {
  const confirmed = await adminConfirm(
    "Apakah Anda yakin ingin menghapus ulasan testimoni konsumen ini?",
    "Hapus Testimoni",
    "danger",
    "Ya, Hapus Testimoni"
  );
  if (!confirmed) return;
  
  try {
    await deleteDoc(doc(db, "testimonials", id));
    testimonialsList = testimonialsList.filter(t => t.id !== id);
    renderTestimonialsTable();
    await adminAlert("Testimoni konsumen berhasil dihapus!", "Berhasil Dihapus", "success");
  } catch (err) {
    console.error("Gagal hapus testimoni:", err);
    await adminAlert("Gagal menghapus testimoni: " + err.message, "Gagal Menghapus", "error");
  }
}
