let restFunction = {};
const fs = require('fs');
module.exports = backendApp => {
    const restify = require('express-restify-mongoose');
    const modelNames = backendApp.mongoose.modelNames();

    modelNames.forEach( modelName => {
        const model = backendApp.mongoose.model(modelName);
        let update_ws = (req, res, next) =>{
            if (!req.body.ws) return next();
            backendApp.events.callWS.emit('message', req.body.ws);
            next()
        };
        const checkFile = (req,res,next) => {
            if (!req.params.id) return next();
            let prop;
            if (req.body.img){
                prop = 'img'
            } else if (req.body.image){
                prop = 'image'
            } else {
                prop = null;
            }
            new Promise((rs,rj)=>{
                model.findOne({_id:req.params.id}).exec((e,r)=>{
                    if (e) return rj(e);
                    if (!r) return rj("Not Found!");
                    if (prop) {
                        if (r[prop] === req.body[prop]){
                            rs('return')
                        } else {
                            rs(r[prop])
                        }
                    } else {
                        let result = r.img || r.image;
                        rs(result)
                    }

                })
            }).then(mainName => {
                if (!mainName || mainName === 'return') return next();
                fs.unlink("upload/"+mainName, fsCallbeack=>{
                    fs.unlink("upload/address/"+mainName, fsCallbeack=>{
                        fs.unlink("upload/avatar/"+mainName, fsCallbeack=>{
                            fs.unlink("upload/product/"+mainName, fsCallbeack=>{
                                next()
                            });
                        });
                    });
                });
            }).catch(e=>{
                res.serverError(e)
            })
        };

        if (model.schema.options.createRestApi) {
            const modelOpt = model.schema.options;
            const router = backendApp.express.Router();
            restify.serve(router, model, {
                prefix: "",
                version: "",
                runValidators: true,
                totalCountHeader: true,
                lean: false,
                findOneAndUpdate: true,
                findOneAndRemove: true,
                postRead: [schemaPre.PostRead],
                // preMiddleware: backendApp.middlewares.isLoggedIn,
                preRead: [
                    modelOpt.needLogined ? backendApp.middlewares.isLoggedIn : backendApp.middlewares.checkLoggedIn,
                    modelOpt.needLogined ? isVerify(backendApp) : backendApp.middlewares.checkLoggedIn,
                    schemaPre.Read],
                preCreate: [
                    modelOpt.notCreate ? forbidden : nextS,
                    modelOpt.needLogined ? backendApp.middlewares.isLoggedIn : backendApp.middlewares.checkLoggedIn,
                    isVerify(backendApp),
                    schemaPre.Save],
                postCreate: [update_ws, schemaPre.PostCreate],
                preUpdate: [
                    backendApp.middlewares.isLoggedIn,
                    isVerify(backendApp),
                    checkFile,
                    schemaPre.Update],
                postUpdate: [update_ws, schemaPre.PostUpdate],
                preDelete: [
                    backendApp.middlewares.isLoggedIn,
                    isVerify(backendApp),
                    checkFile,
                    schemaPre.Delete],
                postDelete: [update_ws, schemaPre.PostDelete],
            });
            backendApp.app.use("/api", router);
        }
    });

    const glob = require('glob');
    let schemaMethods = glob.sync(backendApp.config.root+'/model/model_methods/restifyMethod/*.js');
    schemaMethods.forEach((controller) => {
        restFunction[parseFileName(controller).toLowerCase()] = require(controller);
    });


};
const isVerify = backendApp => {
    return (req,res,next)=>{
        if (req.user && req.user.verify && !req.user.banned) {
            next()
        } else {
            if (req.user && req.user.banned){
                res.forbidden("Profile is banned")
            } else
            if (req.user && !req.user.verify) {
                const signup = new backendApp.hooks.signupRole(req, res, req.user, backendApp);
                signup.init()
            } else if (!req.user) {
                next()
            }
        }
    }
};


const schemaPre = {
    Read: (req, res, next) => callMethod(req, res, next, 'preRead'),
    Save: (req, res, next) => {
        req.body.date = new Date();
        if (req.user) req.body.createdBy = req.user._id;
        callMethod(req, res, next, 'preSave')
    },
    Update: (req, res, next) => {
        req.body.lastUpdate = req.body.lastUpdate ? req.body.lastUpdate : new Date();
        delete req.body.createdBy;
        callMethod(req, res, next, 'preUpdate')
    },
    Delete: (req, res, next) => callMethod(req, res, next, 'preDel'),
    PostUpdate: (req, res, next) => callMethod(req, res, next, 'postUpdate'),
    PostCreate: (req, res, next) => callMethod(req, res, next, 'postCreate'),
    PostDelete: (req, res, next) => callMethod(req, res, next, 'postDelete'),
    PostRead: (req, res, next) => callMethod(req, res, next, 'postRead'),
};

const nextS = (req, res, next) => next();
const forbidden = (req, res, next) => res.forbidden("Not access!");
const callMethod = (req,res,next,method) => {
    let schem = restFunction[String(req.erm.model.modelName.toLowerCase())];
    if (schem && schem[method]) {
        try {
            schem[method](req, res, next, backendApp);
        } catch (e) {
            next()
        }
    } else {
        next()
    }
};
const parseFileName = str =>{
    let strRout = str.split('.js')[0];
    return strRout ? strRout.split('restifyMethod/')[1] : ''
};