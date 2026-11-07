Vue.component('ba-stock-table', {
    template: '#tpl-stock',
    props: {
        items: { type: Array, required: true },
        upbjjList: { type: Array, required: true },
        kategoriList: { type: Array, required: true }
    },
    data: function () {
        return {
            selectedUpbjj: '',
            selectedKategori: '',
            filterReorder: false,
            sortBy: '',
            watcherLog: 'Menampilkan seluruh daftar stok bahan ajar UT.',

            // State Edit (Update)
            editingKode: null,
            editForm: {
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            },
            editError: '',

            // State Tambah (Create)
            newItem: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: null,
                qty: null,
                safety: null,
                catatanHTML: ''
            },
            errors: {}
        };
    },
    computed: {
        availableKategori: function () {
            if (!this.selectedUpbjj) return [];
            return this.kategoriList;
        },
        filteredAndSortedStok: function () {
            var hasil = this.items.slice();
            var self = this;

            if (this.selectedUpbjj !== '') {
                hasil = hasil.filter(function (item) {
                    return item.upbjj === self.selectedUpbjj;
                });
            }

            if (this.selectedUpbjj !== '' && this.selectedKategori !== '') {
                hasil = hasil.filter(function (item) {
                    return item.kategori === self.selectedKategori;
                });
            }

            if (this.filterReorder) {
                hasil = hasil.filter(function (item) {
                    return item.qty < item.safety || item.qty === 0;
                });
            }

            if (this.sortBy === 'judul-asc') {
                hasil.sort(function (a, b) { return a.judul.localeCompare(b.judul); });
            } else if (this.sortBy === 'judul-desc') {
                hasil.sort(function (a, b) { return b.judul.localeCompare(a.judul); });
            } else if (this.sortBy === 'qty-asc') {
                hasil.sort(function (a, b) { return a.qty - b.qty; });
            } else if (this.sortBy === 'qty-desc') {
                hasil.sort(function (a, b) { return b.qty - a.qty; });
            } else if (this.sortBy === 'harga-asc') {
                hasil.sort(function (a, b) { return a.harga - b.harga; });
            } else if (this.sortBy === 'harga-desc') {
                hasil.sort(function (a, b) { return b.harga - a.harga; });
            }

            return hasil;
        }
    },
    watch: {
        // Watcher 1: Memantau perubahan filter UT-Daerah & mereset filter Kategori
        selectedUpbjj: function (newVal) {
            this.selectedKategori = '';
            if (newVal === '') {
                this.watcherLog = 'Filter UT-Daerah di-reset. Menampilkan stok seluruh daerah.';
            } else {
                this.watcherLog = 'Memfilter UT-Daerah: ' + newVal + '. Filter Kategori Mata Kuliah kini diaktifkan.';
            }
        },
        // Watcher 2: Memantau pengaktifan filter pengingat Re-order
        filterReorder: function (newVal) {
            if (newVal) {
                this.watcherLog = 'Mode Re-order Aktif: Menampilkan bahan ajar dengan stok < safety stock atau stok = 0.';
            } else {
                this.watcherLog = 'Mode Re-order Dinonaktifkan.';
            }
        }
    },
    methods: {
        resetFilter: function () {
            this.selectedUpbjj = '';
            this.selectedKategori = '';
            this.filterReorder = false;
            this.sortBy = '';
            this.watcherLog = 'Seluruh pengaturan filter dan sort telah di-reset.';
        },
        mulaiEdit: function (item) {
            this.editingKode = item.kode;
            this.editError = '';
            this.editForm = {
                judul: item.judul,
                kategori: item.kategori,
                upbjj: item.upbjj,
                lokasiRak: item.lokasiRak,
                harga: item.harga,
                qty: item.qty,
                safety: item.safety,
                catatanHTML: item.catatanHTML
            };
        },
        simpanEdit: function (item) {
            if (!this.editForm.judul || !this.editForm.lokasiRak || this.editForm.harga <= 0 || this.editForm.qty < 0 || this.editForm.safety < 1) {
                this.editError = 'Validasi gagal: Judul & Rak wajib diisi, Harga > 0, Stok >= 0, Safety >= 1.';
                return;
            }
            item.judul = this.editForm.judul;
            item.kategori = this.editForm.kategori;
            item.upbjj = this.editForm.upbjj;
            item.lokasiRak = this.editForm.lokasiRak;
            item.harga = Number(this.editForm.harga);
            item.qty = Number(this.editForm.qty);
            item.safety = Number(this.editForm.safety);
            item.catatanHTML = this.editForm.catatanHTML;
            this.editingKode = null;
            this.editError = '';
            this.watcherLog = 'Berhasil memperbarui data bahan ajar: ' + item.kode;
            this.$emit('notify', {
                title: 'Perubahan Tersimpan',
                message: 'Data bahan ajar "' + item.kode + ' - ' + item.judul + '" berhasil diperbarui.'
            });
        },
        batalEdit: function () {
            this.editingKode = null;
            this.editError = '';
        },
        konfirmasiHapus: function (item) {
            var self = this;
            this.$emit('request-delete', item, function () {
                self.watcherLog = 'Data bahan ajar ' + item.kode + ' (' + item.judul + ') telah dihapus.';
            });
        },
        validasiTambah: function () {
            this.errors = {};
            var self = this;
            if (!this.newItem.kode) {
                this.errors.kode = 'Kode MK wajib diisi.';
            } else if (this.items.some(function (i) { return i.kode.toUpperCase() === self.newItem.kode.toUpperCase(); })) {
                this.errors.kode = 'Kode MK sudah terdaftar.';
            }
            if (!this.newItem.judul) this.errors.judul = 'Nama MK wajib diisi.';
            if (!this.newItem.kategori) this.errors.kategori = 'Pilih kategori.';
            if (!this.newItem.upbjj) this.errors.upbjj = 'Pilih UT-Daerah.';
            if (!this.newItem.lokasiRak) this.errors.lokasiRak = 'Lokasi rak wajib diisi.';
            if (this.newItem.harga === null || this.newItem.harga <= 0) this.errors.harga = 'Harga harus > 0.';
            if (this.newItem.qty === null || this.newItem.qty < 0) this.errors.qty = 'Stok minimal 0.';
            if (this.newItem.safety === null || this.newItem.safety < 1) this.errors.safety = 'Safety stock minimal 1.';
            if (!this.newItem.catatanHTML) this.errors.catatanHTML = 'Catatan wajib diisi.';

            return Object.keys(this.errors).length === 0;
        },
        tambahBahanAjar: function () {
            if (this.validasiTambah()) {
                var kodeBaru = this.newItem.kode.toUpperCase();
                var judulBaru = this.newItem.judul;
                this.items.push({
                    kode: kodeBaru,
                    judul: this.newItem.judul,
                    kategori: this.newItem.kategori,
                    upbjj: this.newItem.upbjj,
                    lokasiRak: this.newItem.lokasiRak,
                    harga: Number(this.newItem.harga),
                    qty: Number(this.newItem.qty),
                    safety: Number(this.newItem.safety),
                    catatanHTML: this.newItem.catatanHTML
                });
                this.watcherLog = 'Bahan ajar baru ' + kodeBaru + ' berhasil ditambahkan ke daftar stok.';
                this.$emit('notify', {
                    title: 'Bahan Ajar Tersimpan',
                    message: 'Data bahan ajar "' + kodeBaru + ' - ' + judulBaru + '" berhasil disimpan ke daftar stok.'
                });
                this.newItem = {
                    kode: '',
                    judul: '',
                    kategori: '',
                    upbjj: '',
                    lokasiRak: '',
                    harga: null,
                    qty: null,
                    safety: null,
                    catatanHTML: ''
                };
            }
        }
    }
});