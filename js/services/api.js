var ApiService = {
    fallbackData: {
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        pengirimanList: [
            { kode: "REG", nama: "Reguler (3-5 hari)" },
            { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
        ],
        stok: [
            { kode: "EKMA4116", judul: "Pengantar Manajemen", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A3", harga: 65000, qty: 28, safety: 20, catatanHTML: "<em>Edisi 2024, cetak ulang</em>" },
            { kode: "EKMA4115", judul: "Pengantar Akuntansi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A4", harga: 60000, qty: 7, safety: 15, catatanHTML: "<strong>Cover baru</strong>" },
            { kode: "BIOL4201", judul: "Biologi Umum (Praktikum)", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R3-B2", harga: 80000, qty: 12, safety: 10, catatanHTML: "Butuh <u>pendingin</u> untuk kit basah" },
            { kode: "FISIP4001", judul: "Dasar-Dasar Sosiologi", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R2-C1", harga: 55000, qty: 2, safety: 8, catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder" }
        ],
        tracking: [
            {
                "DO2025-0001": {
                    nim: "123456789",
                    nama: "Rina Wulandari",
                    status: "Dalam Perjalanan",
                    ekspedisi: "JNE Reguler (3-5 hari)",
                    tanggalKirim: "2025-08-25",
                    paket: "PAKET-UT-001",
                    total: 120000,
                    perjalanan: [
                        { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" }
                    ]
                }
            }
        ]
    },

    loadTemplates: function () {
        var files = [
            'stock-table.html',
            'do-tracking.html',
            'order-form.html',
            'status-badge.html',
            'app-modal.html',
            'login-page.html'
        ];
        return Promise.all(
            files.map(function (file) {
                return fetch('./templates/' + file).then(function (res) {
                    if (!res.ok) throw new Error("Gagal memuat template: " + file);
                    return res.text();
                });
            })
        ).then(function (htmlList) {
            var container = document.getElementById('template-container');
            container.innerHTML = htmlList.join('\n');
        });
    },

    normalizeTracking: function (rawTracking) {
        var list = [];
        var seen = {};
        if (Array.isArray(rawTracking)) {
            rawTracking.forEach(function (entry) {
                var key = Object.keys(entry)[0];
                if (key && !seen[key]) {
                    seen[key] = true;
                    var item = entry[key];
                    var formattedNoDO = key.replace("DO2025-0001", "DO2025-001");
                    list.push({
                        noDO: formattedNoDO,
                        nim: item.nim,
                        nama: item.nama,
                        status: item.status,
                        ekspedisi: item.ekspedisi === "JNE" ? "JNE Reguler (3-5 hari)" : item.ekspedisi,
                        tanggalKirim: item.tanggalKirim,
                        paket: item.paket,
                        total: item.total,
                        perjalanan: item.perjalanan || []
                    });
                }
            });
        }
        return list;
    },

    fetchData: function () {
        var self = this;
        return fetch('./data/dataBahanAjar.json')
            .then(function (res) {
                if (!res.ok) throw new Error("Gagal membaca JSON");
                return res.json();
            })
            .then(function (json) {
                json.tracking = self.normalizeTracking(json.tracking);
                return json;
            })
            .catch(function () {
                var clone = JSON.parse(JSON.stringify(self.fallbackData));
                clone.tracking = self.normalizeTracking(clone.tracking);
                return clone;
            });
    }
};
