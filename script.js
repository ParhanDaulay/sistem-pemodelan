document.getElementById('simulasiForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const pendudukAwal = parseFloat(document.getElementById('pendudukAwal').value);
  const pertumbuhan = parseFloat(document.getElementById('pertumbuhanPenduduk').value) / 100;
  const sampahPerKapita = parseFloat(document.getElementById('sampahPerKapita').value);
  const daurUlang = parseFloat(document.getElementById('daurUlang').value) / 100;
  const kepadatan = parseFloat(document.getElementById('kepadatanSampah').value);
  const tinggiTPA = parseFloat(document.getElementById('tinggiTPA').value);
  const tahunAwal = parseInt(document.getElementById('tahunAwal').value);
  const tahunAkhir = parseInt(document.getElementById('tahunAkhir').value);

  const tahunSimulasi = [];
  const luasLahan = [];
  const jumlahPenduduk = [];
  const volumeSampahKg = [];


  let penduduk = pendudukAwal;

  for (let tahun = tahunAwal; tahun <= tahunAkhir; tahun++) {
    // Hitung volume sampah tahunan (kg)
    const volumeSampah = penduduk * sampahPerKapita * 365;
    const volumeBersih = volumeSampah * (1 - daurUlang); // dikurangi daur ulang
    const volumeM3 = volumeBersih / kepadatan; // kg -> m3
    const lahan = volumeM3 / tinggiTPA; // m²

    tahunSimulasi.push(tahun);
    luasLahan.push(lahan.toFixed(2));
    jumlahPenduduk.push(penduduk.toFixed(0));
    volumeSampahKg.push(volumeBersih.toFixed(0));


    penduduk = penduduk * (1 + pertumbuhan); // tumbuh setiap tahun
  }


    // Grafik Penduduk
  if (window.chartPenduduk) window.chartPenduduk.destroy();
  const ctxPenduduk = document.getElementById('grafikPenduduk').getContext('2d');
  window.chartPenduduk = new Chart(ctxPenduduk, {
    type: 'line',
    data: {
      labels: tahunSimulasi,
      datasets: [{
        label: 'Jumlah Penduduk',
        data: jumlahPenduduk,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Penduduk'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tahun'
          }
        }
      }
    }
  });

  // Grafik Sampah
  if (window.chartSampah) window.chartSampah.destroy();
  const ctxSampah = document.getElementById('grafikSampah').getContext('2d');
  window.chartSampah = new Chart(ctxSampah, {
    type: 'line',
    data: {
      labels: tahunSimulasi,
      datasets: [{
        label: 'Volume Sampah (kg/tahun)',
        data: volumeSampahKg,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sampah (kg)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tahun'
          }
        }
      }
    }
  });

  if (window.chartLahan) window.chartLahan.destroy();

  const ctx = document.getElementById('grafikLahan').getContext('2d');
  window.chartLahan = new Chart(ctx, {
    type: 'line',
    data: {
      labels: tahunSimulasi,
      datasets: [{
        label: 'Estimasi Luas Lahan TPA (m²)',
        data: luasLahan,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Luas Lahan (m²)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tahun'
          }
        }
      }
    }
  });
});
