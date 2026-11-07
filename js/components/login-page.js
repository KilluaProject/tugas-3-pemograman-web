Vue.component('login-page', {
    template: '#tpl-login',
    data: function () {
        return {
            form: {
                username: '',
                password: ''
            },
            error: '',
            showPassword: false
        };
    },
    methods: {
        submitLogin: function () {
            this.error = '';
            var username = this.form.username.trim();

            if (!username || !this.form.password) {
                this.error = 'Username dan password wajib diisi.';
                return;
            }

            var user = AuthService.login(username, this.form.password);
            if (!user) {
                this.error = 'Username atau password salah.';
                return;
            }

            this.form.username = '';
            this.form.password = '';
            this.$emit('login-success', user);
        },
        togglePassword: function () {
            this.showPassword = !this.showPassword;
        }
    }
});
