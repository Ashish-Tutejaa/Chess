import Mongoose, { Document } from 'mongoose';

interface room extends Document {
	rid: string;
	user1: string;
	user2: string;
	time: string;
	side: string;
}

const roomSchema = new Mongoose.Schema({
	rid: {
		type: String,
		required: true,
	},
	user1: {
		type: String,
		default: '',
	},
	user2: {
		type: String,
		default: '',
	},
	time: {
		type: String,
		required: true,
	},
	side: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		expires: 60 * 60 * 60,
		default: Date.now,
	},
});

const roomModel = Mongoose.model<room>('room', roomSchema);

export default roomModel;
