import mongoose from 'mongoose';

const DB_NAME = process.env.DB_NAME || 'gugotech_db';

mongoose
	.connect(`mongodb://localhost:27017/${DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 5000})
	.catch(console.log);

mongoose.connection.on('open', () => console.log('Mongo DB connected'));
