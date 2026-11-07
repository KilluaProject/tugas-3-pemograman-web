
var AuthService = {
    SESSION_KEY: 'sitta_ut_user',

    users: [
        { username: 'admin', password: 'admin123', nama: 'Administrator SITTA', role: 'Administrator' },
    ],

    login: function (username, password) {
        var user = this.users.find(function (u) {
            return u.username === username && u.password === password;
        });
        if (!user) return null;
        return { username: user.username, nama: user.nama, role: user.role };
    },

    saveSession: function (user) {
        try {
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        } catch (e) {

        }
    },

    getSession: function () {
        try {
            var raw = sessionStorage.getItem(this.SESSION_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    clearSession: function () {
        try {
            sessionStorage.removeItem(this.SESSION_KEY);
        } catch (e) {

        }
    }
};
