import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.database();

export const ready = functions.https.onRequest(
	(req: functions.Request, res: functions.Response) => {
		res.send();
		return db
			.ref('flappy-bird/ready')
			.set({ timestamp: Date.now() })
			.catch();
	}
);

export const jump = functions.https.onRequest(
	(req: functions.Request, res: functions.Response) => {
		const id: number = +req.query.id;
		res.send();
		return db
			.ref(`flappy-bird/p${id}`)
			.set({ timestamp: Date.now() })
			.catch();
	}
);

export const highscore = functions.https.onRequest(
	(req: functions.Request, res: functions.Response) => {
		const score: number = +req.query.score;
		res.send();
		return db
			.ref('flappy-bird/score')
			.set({ score, timestamp: Date.now() })
			.catch();
	}
);
