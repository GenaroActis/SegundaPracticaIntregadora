import UsersDaoMongoDB from "../daos/mongodb/usersDao.js";
const userDao = new UsersDaoMongoDB();
import CartsDaoMongoDB from "../daos/mongodb/cartsDao.js";
const cartDao = new CartsDaoMongoDB();
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const strategyConf = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

const signup = async (req, email, password, done)=>{
    try {
        const findUser = await userDao.getUserByEmail(email);
        if(findUser.length > 0){
            return done(null, false)
        }else{
            const newCart = await cartDao.createCart()
            const cartId = newCart._id
            req.body.cartId = cartId
            const token = await userDao.createUser(req.body);
            if(!token){
                return done(null, false);
            } else {
                return done(null, token)
            };
        };
    } catch (error) {
        console.log(error)
    }
};
const login = async (req, email, password, done)=>{
    const user = {email, password};
    const userLogged = await userDao.loginUser(user)
    if(userLogged){
        return done(null, userLogged)
    }else{
        return done(null, false)
    };
};

const signupStrategy = new LocalStrategy(strategyConf, signup);
const loginStrategy = new LocalStrategy(strategyConf, login);

passport.use('register', signupStrategy);
passport.use('login', loginStrategy);

passport.serializeUser((user, done)=>{
    done(null, user._id);
});

passport.deserializeUser(async(id, done)=>{
    const user = await userDao.getUserById(id);
    return done(null, user)
});

export const frontResponseRegister = {
    failureRedirect: '/views/register/Error',
    successRedirect: '/views/login',
    passReqToCallback: true,
};
export const frontResponseLogin = {
    failureRedirect: '/views/login/Error',
    successRedirect: '/views/products',
    passReqToCallback: true,
};
