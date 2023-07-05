import express from 'express';
import morgan from 'morgan';
import dirname from './utils.js';
import bodyParser from 'body-parser';
import './db/db.js';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartRouter.js';
import session from 'express-session';
import usersRouter from './routes/userRouter.js';
import views from './routes/viewsRouter.js';
import { errorHandler } from './middlewares/errorHandler.js';
import passport from 'passport';
import './passport/github.js';
import './passport/local.js';

const app = express();
const port = 8080;
const path = dirname

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(express.static(path + '/public'))
app.engine('handlebars', handlebars.engine({
        defaultLayout: "main",
        runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        },
    }));
app.set('view engine', 'handlebars')
app.set('views', path + '/views')

app.use(cookieParser())
app.use(session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    store : new MongoStore({
        mongoUrl: 'mongodb+srv://genaroActis:toxinfinito22@cluster0.6zafi08.mongodb.net/LoginForm?retryWrites=true&w=majority',
        ttl: 100,
        // autoRemove:'interval',
        // autoRemoveInterval: 10,
    })
})
);

app.use(errorHandler)
app.use(passport.initialize());
app.use(passport.session());

app.use('/products', productsRouter);
app.use('/carts', cartsRouter);
app.use('/user', usersRouter);
app.use('/views', views);

const httpServer = app.listen(port, ()=>{
    console.log('server ok en port', port);
});


