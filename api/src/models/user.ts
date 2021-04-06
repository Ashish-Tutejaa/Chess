import Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema({
	username: {
		type: String,
		unique: true,
	},
	createdAt: {
		type: Date,
		expires: 24 * 60 * 60,
		default: Date.now,
	},
});

const userModel = Mongoose.model('user', UserSchema);

export default userModel;
