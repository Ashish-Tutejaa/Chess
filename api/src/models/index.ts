import Mongoose from 'mongoose';

Mongoose.connect(
	'mongodb://localhost:27017/chessUsers',
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
