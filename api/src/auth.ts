import express, { Request, Router, Response, NextFunction } from 'express';

//router
const authRouter: Router = express.Router();

//db
import userModel from './models/user';

authRouter.delete('/delete-user', async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.cookies['uid'];
		console.log(user, 'deleting');
		if (!user) res.status(400).json({ err: 'No token found' });
		else {
			let resp = await userModel.findOneAndDelete({ username: user });
			console.log(resp);
			res.cookie('uid', '', {
				httpOnly: true,
				path: '/',
				expires: new Date(1970, 0, 1, 0, 0),
			});
			res.status(200).json({ done: true });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

authRouter.get('/get-user', async (req: Request, res: Response, next: NextFunction) => {
	try {
		let user = req.cookies['uid'];
		console.log(user);
		if (!user) res.status(400).json({ err: 'No token found' });
		else {
			let resp = await userModel.findOne({ username: user });
			console.log(resp);
			res.status(200).json({ resp });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

authRouter.post('/is-valid', async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.body);
		let user = req.body.username;
		console.log(user);
		if (!user) res.status(400).json({ err: 'No username found' });
		else {
			let resp = await userModel.findOne({ username: user });
			res.status(200);
			if (resp) res.json({ found: true });
			else res.json({ found: false });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ err });
	}
});

authRouter.post('/make-user', async (req: Request, res: Response, next: NextFunction) => {
	try {
		let username: string = req.body.username;
		let tempUser = new userModel({ username });
		await tempUser.save();
		res.cookie('uid', username, {
			httpOnly: true,
			path: '/',
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.status(200).json({ op: true });
	} catch (err) {
		console.log(err);
		res.status(500).json({ err: 'An internal server error Occurred.  Please try again later.' });
	}
});

export default authRouter;
