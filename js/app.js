// Indikator 7: Formatting data teks menggunakan konsep Vue Filter
Vue.filter('formatRupiah', function (value) {
    if (value === null || value === undefined || isNaN(value)) return 'Rp 0';
    return 'Rp ' + Number(value).toLocaleString('id-ID');
});

Vue.filter('formatBuah', function (value) {
    if (value === null || value === undefined || isNaN(value)) return '0 buah';
    return Number(value) + ' buah';
});

Vue.filter('formatTanggalIndo', function (dateStr) {
    if (!dateStr) return '-';
    var bulanIndo = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    var parts = String(dateStr).split('-');
    if (parts.length === 3) {
        var tahun = parts[0];
        var bulanIdx = parseInt(parts[1], 10) - 1;
        var tanggal = parseInt(parts[2], 10);
        if (bulanIndo[bulanIdx]) {
            return tanggal + ' ' + bulanIndo[bulanIdx] + ' ' + tahun;
        }
    }
    return dateStr;
});

// Memuat seluruh file template di /templates/*.html terlebih dahulu sebelum mounting #app
ApiService.loadTemplates().then(function () {
    window.app = new Vue({
        el: '#app',
        data: {
            tab: 'stok',
            isLoggedIn: false,
            currentUser: null,
            state: {
                upbjjList: [],
                kategoriList: [],
                pengirimanList: [],
                paket: [],
                stok: [],
                tracking: []
            }
        },
        created: function () {
            var self = this;
            // Pulihkan sesi login dari tab yang sama (sessionStorage).
            var session = AuthService.getSession();
            if (session) {
                this.isLoggedIn = true;
                this.currentUser = session;
            }
            ApiService.fetchData().then(function (data) {
                self.state.upbjjList = data.upbjjList || [];
                self.state.kategoriList = data.kategoriList || [];
                self.state.pengirimanList = data.pengirimanList || [];
                self.state.paket = data.paket || [];
                self.state.stok = data.stok || [];
                self.state.tracking = data.tracking || [];
            });
        },
        methods: {
            handleLogin: function (user) {
                this.currentUser = user;
                this.isLoggedIn = true;
                this.tab = 'stok';
                AuthService.saveSession(user);
            },
            handleLogout: function () {
                AuthService.clearSession();
                this.isLoggedIn = false;
                this.currentUser = null;
                this.tab = 'stok';
            },
            handleNotify: function (payload) {
                if (this.$refs.modal) {
                    this.$refs.modal.open(payload.title, payload.message, null, payload.tone);
                }
            },
            handleNewDO: function (newDO) {
                this.state.tracking.push(newDO);
                this.tab = 'tracking';
                if (this.$refs.modal) {
                    this.$refs.modal.open(
                        'Delivery Order Berhasil Dibuat',
                        'Nomor DO ' + newDO.noDO + ' atas nama ' + newDO.nama + ' berhasil ditambahkan ke daftar Tracking DO.'
                    );
                }
            },
            handleDeleteStok: function (item, afterDeleteCallback) {
                var self = this;
                if (this.$refs.modal) {
                    this.$refs.modal.open(
                        'Konfirmasi Hapus Bahan Ajar',
                        'Apakah Anda yakin ingin menghapus bahan ajar "' + item.kode + ' - ' + item.judul + '" dari daftar stok?',
                        function () {
                            var idx = self.state.stok.indexOf(item);
                            if (idx !== -1) {
                                self.state.stok.splice(idx, 1);
                                if (typeof afterDeleteCallback === 'function') afterDeleteCallback();
                                if (self.$refs.modal) {
                                    self.$refs.modal.open(
                                        'Data Bahan Ajar Dihapus',
                                        'Bahan ajar "' + item.kode + ' - ' + item.judul + '" berhasil dihapus dari daftar stok.'
                                    );
                                }
                            }
                        }
                    );
                }
            }
        }
    });
});