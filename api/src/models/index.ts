import Mongoose from 'mongoose';

if (process.env.MONGO_URI) {
	Mongoose.connect(
		process.env.MONGO_URI,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
		err => {
			if (err) {
				console.error(err);
			} else {
				console.log('successfully connected to database');
			}
		}
	);
} else {
	console.log('No URI found');
}
