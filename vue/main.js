var app = new Vue({
    el:"#app",
    data: {
        title: 'Whoopi!!!',
        user: null
    },
    methods: {
        loadUser: function () {
            axios.get('/user/1').then((result)=>{
                this.user = result.data;
            }).catch((err)=>{
                console.log(err);
            })
        }
    }
});