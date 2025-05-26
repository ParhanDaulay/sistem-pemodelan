// Asumsikan data sudah diambil dari form atau perhitungan sistem dinamik
function tampilkanGrafik(tahun, luasTPA) {
  const ctx = document.getElementById('grafikLuasTPA').getContext('2d');

  // Hapus chart lama jika ada
  if (window.grafikLuasTPA) {
    window.grafikLuasTPA.destroy();
  }

  // Buat chart baru
  window.grafikLuasTPA = new Chart(ctx, {
    type: 'line',
    data: {
      labels: tahun, // Contoh: [2025, 2026, 2027, ...]
      datasets: [{
        label: 'Estimasi Luas TPA (hektar)',
        data: luasTPA, // Contoh: [5.2, 5.6, 6.1, ...]
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: '#1e3a8a',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Grafik Estimasi Luas Lahan TPA Kabupaten Donggala',
          font: {
            size: 18
          }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tahun'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Luas (hektar)'
          },
          beginAtZero: true
        }
      }
    }
  });
}
