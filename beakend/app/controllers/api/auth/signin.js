const md5 = require('md5');
module.exports = (backendApp, router) => {

    const signin = (req,res,next) => {

        const Client = backendApp.mongoose.model("Client");
        let errors = {};
        if (!req.body.login) {
            errors.login = "Login is required";
        }
        if (!req.body.pass) {
            errors.password = "Password is required";
        }
        if (Object.keys(errors).length > 0) {
            return res.badRequest(errors);
        }
        req.body.login = req.body.login.slice(-10).toLowerCase();
        Client.findOne({
            $and:[{
                $or:[
                    {login: req.body.login.toLowerCase()}
                ]
            }, {verify:true}, {banned: false}],
        }).exec(function (err, user) {
            if (err) return res.serverError(err);
            if (!user) return res.notFound("Password or login invalid!");
            if ((user.role == 'Client' && req.body.role === 'client') || !user.role){
                if (user.pass != md5(req.body.pass)) return res.notFound("Password or login invalid! 1");
            }
            if (user.role != 'Client' && user.role){
                if (user.pass != md5(req.body.pass) && req.body.role === 'client') return res.notFound("Password or login invalid! 2");
                if (user.pass != md5(req.body.pass)) return res.notFound("Password or login invalid! 3");
            }
            user.signin(req,res,backendApp)
        });
    };

    router.post('/signin', [], signin);
};
