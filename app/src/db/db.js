import mongoose from 'mongoose'
import { MongoDBUrl } from '../config.js'

try {
    await mongoose.connect(MongoDBUrl);
    console.log('Conectado a la base de datos MongoDB');
} catch (error) {
    console.log(error);
}