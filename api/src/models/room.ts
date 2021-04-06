import Mongoose from 'mongoose';

const roomSchema = new Mongoose.Schema({
	user1: {
		type: String,
		default: '',
	},
	user2: {
		type: String,
		default: '',
	},
});

const roomModel = Mongoose.model('room', roomSchema);

export default roomModel;
