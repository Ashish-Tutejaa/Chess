import Mongoose from 'mongoose';

Mongoose.connect(
	'mongodb+srv://tuteja:tuteja123@mern.1ft2r.mongodb.net/MERN?retryWrites=true&w=majority',
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
