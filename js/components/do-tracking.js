Vue.component('do-tracking', {
    template: '#tpl-tracking',
    props: {
        data: { type: Array, required: true }
    },
    data: function () {
        return {
            inputKeyword: '',
            activeKeyword: '',
            trackingLog: 'Ketik Nomor DO atau NIM lalu tekan Enter untuk mencari, atau tekan Esc untuk mereset.',
            progressInputs: {}
        };
    },
    computed: {
        filteredTracking: function () {
            if (!this.activeKeyword) {
                return this.data;
            }
            var q = this.activeKeyword.toLowerCase();
            return this.data.filter(function (item) {
                return item.noDO.toLowerCase().indexOf(q) !== -1 ||
                    item.nim.toLowerCase().indexOf(q) !== -1;
            });
        }
    },
    watch: {
        activeKeyword: function (newVal) {
            if (!newVal) {
                this.trackingLog = 'Pencarian di-reset (Esc). Menampilkan seluruh data Delivery Order (' + this.data.length + ' DO).';
            } else {
                this.trackingLog = 'Hasil pencarian untuk "' + newVal + '": ditemukan ' + this.filteredTracking.length + ' data DO.';
            }
        }
    },
    methods: {
        submitSearch: function () {
            this.activeKeyword = this.inputKeyword.trim();
        },
        clearSearch: function () {
            this.inputKeyword = '';
            this.activeKeyword = '';
        },
        getWaktuSekarang: function () {
            var now = new Date();
            var yyyy = now.getFullYear();
            var mm = String(now.getMonth() + 1).padStart(2, '0');
            var dd = String(now.getDate()).padStart(2, '0');
            var hh = String(now.getHours()).padStart(2, '0');
            var min = String(now.getMinutes()).padStart(2, '0');
            var ss = String(now.getSeconds()).padStart(2, '0');
            return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
        },
        tambahProgress: function (doItem) {
            var ket = (this.progressInputs[doItem.noDO] || '').trim();
            if (!ket) {
                this.$emit('notify', {
                    title: 'Progress Belum Diisi',
                    message: 'Isi keterangan progress pengiriman terlebih dahulu, lalu klik + Progress atau tekan Enter.',
                    tone: 'warning'
                });
                return;
            }
            var waktuLocal = this.getWaktuSekarang();
            doItem.perjalanan.push({
                waktu: waktuLocal,
                keterangan: ket
            });
            this.$set(this.progressInputs, doItem.noDO, '');
            this.trackingLog = 'Progress baru ditambahkan pada ' + doItem.noDO + ' pukul ' + waktuLocal;
        }
    }
});
