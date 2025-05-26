let tahunSimulasi = [];
let luasLahan = [];
let jumlahPenduduk = [];
let volumeSampahKg = [];

const customAlert = document.getElementById('customAlert');

document.getElementById('simulasiForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Ambil nilai input dan parsing ke tipe data yang sesuai
  const pendudukAwal = parseFloat(document.getElementById('pendudukAwal').value);
  const pertumbuhan = parseFloat(document.getElementById('pertumbuhanPenduduk').value) / 100;
  const sampahPerKapita = parseFloat(document.getElementById('sampahPerKapita').value);
  const daurUlang = parseFloat(document.getElementById('daurUlang').value) / 100;
  const kepadatan = parseFloat(document.getElementById('kepadatanSampah').value);
  const tinggiTPA = parseFloat(document.getElementById('tinggiTPA').value);
  const tahunAwal = parseInt(document.getElementById('tahunAwal').value);
  const tahunAkhir = parseInt(document.getElementById('tahunAkhir').value);

  // Reset array hasil simulasi
  tahunSimulasi = [];
  luasLahan = [];
  jumlahPenduduk = [];
  volumeSampahKg = [];

  // Mulai simulasi
  let penduduk = pendudukAwal;

  for (let tahun = tahunAwal; tahun <= tahunAkhir; tahun++) {
    const volumeSampah = penduduk * sampahPerKapita * 365; // kg/tahun
    const volumeBersih = volumeSampah * (1 - daurUlang);   // volume setelah daur ulang
    const volumeM3 = volumeBersih / kepadatan;             // volume dalam m³
    const lahan = volumeM3 / tinggiTPA;                     // luas lahan dalam m²

    tahunSimulasi.push(tahun);
    luasLahan.push(parseFloat(lahan.toFixed(2)));
    jumlahPenduduk.push(Math.round(penduduk));
    volumeSampahKg.push(Math.round(volumeBersih));

    // Update penduduk untuk tahun berikutnya
    penduduk = penduduk * (1 + pertumbuhan);
  }

  // Tampilkan alert custom dengan efek fade in
  customAlert.style.display = 'block';
  // Pakai class show agar CSS transisi opacity berjalan
  setTimeout(() => customAlert.classList.add('show'), 10);

  // Hilangkan alert setelah 3 detik dengan fade out
  setTimeout(() => {
    customAlert.classList.remove('show');
    // Setelah transisi selesai (300ms), sembunyikan element dari layout
    setTimeout(() => {
      customAlert.style.display = 'none';
    }, 300);
  }, 3000);
});

// Hilangkan alert saat user mulai mengubah input (juga dengan fade out)
const inputs = document.querySelectorAll('#simulasiForm input');
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (customAlert.classList.contains('show')) {
      customAlert.classList.remove('show');
      setTimeout(() => {
        customAlert.style.display = 'none';
      }, 300);
    }
  });
});


// Fungsi-fungsi tampilkan hasil (tidak diubah)
function tampilkanHasil() {
  const grafik = document.getElementById("grafikLuasTPA");
  const tabel = document.getElementById("tabelHasil");
  const laju = document.getElementById("lajuSampah");
  const total = document.getElementById("totalLahan");
  const ekspansi = document.getElementById("ekspansiTPA");

  grafik.style.display = "none";
  tabel.style.display = "none";
  laju.style.display = "none";
  total.style.display = "none";
  ekspansi.style.display = "none";

  const pilihan = Array.from(document.querySelectorAll('input[name="output"]:checked')).map(e => e.value);

  if (pilihan.includes("grafik")) {
    grafik.style.display = "block";
    tampilkanGrafikLuasTPA();
  }
  if (pilihan.includes("tabel")) {
    tabel.style.display = "block";
    tampilkanTabel();
  }
  if (pilihan.includes("laju")) {
    laju.style.display = "block";
    tampilkanLajuPertumbuhan();
  }
  if (pilihan.includes("total")) {
    total.style.display = "block";
    tampilkanTotalLahan();
  }
  if (pilihan.includes("ekspansi")) {
    ekspansi.style.display = "block";
    tampilkanLajuEkspansi();
  }
}


function tampilkanGrafikLuasTPA() {
  const ctx = document.getElementById("grafikLuasTPA").getContext("2d");

  // Jika chart sudah ada, hapus dulu supaya tidak terjadi duplikat
  if (window.chartLuas) window.chartLuas.destroy();

  window.chartLuas = new Chart(ctx, {
    type: "line",
    data: {
      labels: tahunSimulasi,
      datasets: [{
        label: "Estimasi Luas Lahan TPA (m²)",
        data: luasLahan,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        fill: true,
        tension: 0.2,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
        x: { title: { display: true, text: "Tahun" } },
      },
    },
  });
}

function tampilkanTabel() {
  const container = document.getElementById("tabelContainer");
  let html = `
    <table border="1" cellspacing="0" cellpadding="4">
      <thead>
        <tr>
          <th>Tahun</th>
          <th>Jumlah Penduduk</th>
          <th>Volume Sampah (kg)</th>
          <th>Luas Lahan (m²)</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < tahunSimulasi.length; i++) {
    html += `
      <tr>
        <td>${tahunSimulasi[i]}</td>
        <td>${jumlahPenduduk[i].toLocaleString()}</td>
        <td>${volumeSampahKg[i].toLocaleString()}</td>
        <td>${luasLahan[i].toLocaleString()}</td>
      </tr>
    `;
  }

  html += "</tbody></table>";
  container.innerHTML = html;
}

function tampilkanLajuPertumbuhan() {
  const growth = ((volumeSampahKg[volumeSampahKg.length - 1] - volumeSampahKg[0]) / volumeSampahKg[0]) * 100;
  document.getElementById("lajuSampahText").textContent = 
    `Laju pertumbuhan volume sampah selama periode ${tahunSimulasi[0]}-${tahunSimulasi[tahunSimulasi.length - 1]} adalah sekitar ${growth.toFixed(2)}%.`;
}

function tampilkanTotalLahan() {
  const total = luasLahan.reduce((acc, val) => acc + val, 0);
  document.getElementById("totalLahanText").textContent = 
    `Total estimasi kebutuhan lahan TPA selama ${tahunSimulasi.length} tahun adalah sekitar ${total.toFixed(2).toLocaleString()} m².`;
}

function tampilkanLajuEkspansi() {
  const awal = luasLahan[0];
  const akhir = luasLahan[luasLahan.length - 1];
  const persen = ((akhir - awal) / awal) * 100;
  document.getElementById("ekspansiTPAText").textContent = 
    `Laju ekspansi kebutuhan lahan dari tahun pertama ke terakhir meningkat sekitar ${persen.toFixed(2)}%.`;
}
