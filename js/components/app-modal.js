Vue.component('app-modal', {
    template: '#tpl-modal',
    data: function () {
        return {
            visible: false,
            title: '',
            message: '',
            tone: 'success',
            onConfirmCallback: null
        };
    },
    methods: {
        open: function (title, message, callback, tone) {
            this.title = title;
            this.message = message;
            this.onConfirmCallback = callback || null;
            this.tone = tone || (callback ? 'danger' : 'success');
            this.visible = true;
        },
        confirmAction: function () {
            var callback = this.onConfirmCallback;
            this.close();
            if (typeof callback === 'function') {
                callback();
            }
        },
        close: function () {
            this.visible = false;
            this.onConfirmCallback = null;
        }
    }
});