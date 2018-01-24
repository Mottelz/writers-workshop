var app = new Vue({
    el:"#login",
    data: {
        email: null,
        pword: null,
        user: null
    },
    methods: {
        loadUser: function () {
            axios.get('/user/1').then((result)=>{
                this.user = result.data;
            }).catch((err)=>{
                console.log(err);
            })
        },
        login: function () {
            axios.post('/login', {email: this.email, pword: this.pword})
                .then((result)=>{
                    this.user = result.data;
                    console.log(this.user);
                })
                .catch((err)=>{
                    console.log(err);
            })
        }
    }
});