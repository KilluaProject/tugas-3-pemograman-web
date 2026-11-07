Vue.component('order-form', {
    template: '#tpl-order',
    props: {
        paket: { type: Array, required: true },
        ekspedisi: { type: Array, required: true },
        upbjjList: { type: Array, required: true },
        stokList: { type: Array, required: true },
        trackingCount: { type: Number, required: true }
    },
    data: function () {
        return {
            formDO: {
                nim: '',
                nama: '',
                upbjj: '',
                ekspedisi: '',
                kodePaket: '',
                tanggalKirim: ''
            },
            errors: {},
            orderLog: 'Silakan lengkapi formulir di bawah untuk menerbitkan Nomor Delivery Order (DO) baru.'
        };
    },
    created: function () {
        this.setTanggalHariIni();
    },
    computed: {
        generatedNomorDO: function () {
            var tahun = new Date().getFullYear();
            var seq = String(this.trackingCount + 1).padStart(3, '0');
            return 'DO' + tahun + '-' + seq;
        },
        selectedPaketObj: function () {
            var kode = this.formDO.kodePaket;
            return this.paket.find(function (p) {
                return p.kode === kode;
            }) || null;
        },
        totalHargaPaket: function () {
            return this.selectedPaketObj ? this.selectedPaketObj.harga : 0;
        }
    },
    watch: {
        'formDO.kodePaket': function (newVal) {
            if (newVal && this.selectedPaketObj) {
                this.orderLog = 'Paket ' + this.selectedPaketObj.nama + ' dipilih. Harga otomatis disesuaikan.';
            }
        }
    },
    methods: {
        setTanggalHariIni: function () {
            var now = new Date();
            var yyyy = now.getFullYear();
            var mm = String(now.getMonth() + 1).padStart(2, '0');
            var dd = String(now.getDate()).padStart(2, '0');
            this.formDO.tanggalKirim = yyyy + '-' + mm + '-' + dd;
        },
        getJudulMk: function (kodeMk) {
            var found = this.stokList.find(function (s) { return s.kode === kodeMk; });
            return found ? found.judul : 'Bahan Ajar UT';
        },
        validasiOrder: function () {
            this.errors = {};
            if (!this.formDO.nim) {
                this.errors.nim = 'NIM wajib diisi.';
            } else if (!/^\d{5,12}$/.test(this.formDO.nim)) {
                this.errors.nim = 'NIM harus berupa angka (5-12 digit).';
            }
            if (!this.formDO.nama) this.errors.nama = 'Nama wajib diisi.';
            if (!this.formDO.upbjj) this.errors.upbjj = 'Pilih UT-Daerah.';
            if (!this.formDO.ekspedisi) this.errors.ekspedisi = 'Pilih ekspedisi.';
            if (!this.formDO.kodePaket) this.errors.kodePaket = 'Pilih paket bahan ajar.';
            if (!this.formDO.tanggalKirim) this.errors.tanggalKirim = 'Tanggal kirim wajib diisi.';

            return Object.keys(this.errors).length === 0;
        },
        submitOrder: function () {
            if (this.validasiOrder()) {
                var now = new Date();
                var jam = String(now.getHours()).padStart(2, '0') + ':' +
                    String(now.getMinutes()).padStart(2, '0') + ':' +
                    String(now.getSeconds()).padStart(2, '0');

                var newDO = {
                    noDO: this.generatedNomorDO,
                    nim: this.formDO.nim,
                    nama: this.formDO.nama,
                    status: 'Dalam Perjalanan',
                    ekspedisi: this.formDO.ekspedisi,
                    tanggalKirim: this.formDO.tanggalKirim,
                    paket: this.formDO.kodePaket,
                    total: this.totalHargaPaket,
                    perjalanan: [
                        {
                            waktu: this.formDO.tanggalKirim + ' ' + jam,
                            keterangan: 'DO diterbitkan & paket disiapkan menuju UPBJJ ' + this.formDO.upbjj
                        }
                    ]
                };

                this.$emit('created', newDO);
                this.orderLog = 'Delivery Order ' + newDO.noDO + ' berhasil dibuat!';

                this.formDO.nim = '';
                this.formDO.nama = '';
                this.formDO.upbjj = '';
                this.formDO.ekspedisi = '';
                this.formDO.kodePaket = '';
                this.setTanggalHariIni();
            }
        }
    }
});