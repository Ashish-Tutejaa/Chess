import { useContext, useState } from 'react';
import './App.css';
import SideBar from './SideBar';
import GameController from './GameController';
import JoinController from './JoinController';
import { ChessBoard } from './ChessBoard';
import { UserContext } from './Auth';

const App: (props: {}) => JSX.Element = () => {
	const [page, setPage] = useState<number>(0);

	const user = useContext(UserContext);

	const Pages: { [props: string]: () => JSX.Element } = {
		0: () => <ChessBoard side={null} />,
		1: () => <GameController />,
		2: () => <JoinController />,
	};

	const RenderThis = Pages[page];

	return (
		<div className="wrapper">
			<SideBar remote={setPage} username={user.username} />
			{RenderThis()}
		</div>
	);
};

export default App;
