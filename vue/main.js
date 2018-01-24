var app = new Vue({
    el:"#login",
    data: {
        email: null,
        pword: null,
        user: null
    },
    methods: {
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