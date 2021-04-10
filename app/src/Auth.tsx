import React, { useEffect, useRef, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import styled from 'styled-components';
import Alert from './Alert';

export const UserContext = React.createContext<{ username: string }>({ username: '&007' });

const StyledButton = styled('button')`
	background: white;
	width: 60px;
	height: 30px;
	margin-top: 15px;
	outline: none;
	border: 0px;
	cursor: pointer;
	color: white;
	background: #17a2b8;
	border-radius: 5px;
	font-size: 1rem;
	font-weight: bold;
`;

interface toUserForm {
	className?: string;
	redirect: React.Dispatch<React.SetStateAction<number>>;
	userRef: React.MutableRefObject<string | null>;
}

const UserForm: (props: toUserForm) => JSX.Element = ({ redirect, className, userRef }) => {
	const inputRef = useRef<null | HTMLInputElement>(null);
	const [err, setErr] = useState<null | { timer: number; title: string }>(null);
	const [load, setLoad] = useState<number>(0);

	const checkUser: () => Promise<boolean> = async () => {
		let resp = await fetch('http://localhost:5000/api/auth/is-valid', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: (inputRef as any).current.value }),
		});

		let body = await resp.json();
		if (body.err || !body.found) return false;
		return true;
	};

	const makeUser: () => Promise<boolean | string> = async () => {
		let resp = await fetch('http://localhost:5000/api/auth/make-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: (inputRef as any).current.value }),
			credentials: 'include',
		});

		let body = await resp.json();

		if (resp.status === 200) return true;
		else return body.err;
	};

	const handleUserClick = async () => {
		setLoad(1);
		setTimeout(async () => {
			let avail = await checkUser();
			console.log(avail);
			if (avail) {
				setErr({ timer: 5, title: `This Username is already taken!` });
				setLoad(0);
				return;
			}
			let made = await makeUser();
			if (made !== true) {
				setErr({ timer: 5, title: 'An internal server error occurred, please try again later.' });
				setLoad(0);
			} else {
				userRef.current = (inputRef as any).current.value;
				redirect(2);
			}
		}, 1000);
	};

	return (
		<div className={className}>
			<Alert options={err} />
			<h1>Choose a Username</h1>
			<input
				ref={ref => {
					inputRef.current = ref;
					if (ref) {
						ref.onblur = () => {
							console.log(ref.value);
							if (ref.value.length > 0) {
								ref.style.width = `${ref.value.length}ch`;
								ref.classList.add('usernameSet');
							}
						};
						ref.onfocus = () => {
							ref.style.width = '250px';
							ref.classList.remove('usernameSet');
						};
					}
				}}
				type="text"
				placeholder=""></input>
			<StyledButton onClick={handleUserClick}>{load === 1 ? '...' : 'Enter'}</StyledButton>
		</div>
	);
};

const StyledUserForm = styled(UserForm)<toUserForm>`
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: center;
	font-family: 'Open Sans', sans-serif;
	font-size: 1.1rem;
	background: ${props => props.theme.colors.bgLIGHT};
	color: white;
	& h1 {
		margin-top: 10%;
		margin-bottom: 50px;
	}
	& input {
		width: 250px;
		height: 30px;
		outline: none;
		border: 0px;
		box-shadow: 0px 0px 0px 1px #abc;
		border-radius: 2px;
		transition-duration: 250ms;
		font-size: 1.3rem;
		font-weight: bold;
		text-align: center;
	}
	& input:focus {
		box-shadow: 0px 0px 0px 4px #abc;
	}
`;

interface toAuth {
	children: JSX.Element | JSX.Element[] | null;
}

const Auth: (props: toAuth) => JSX.Element = ({ children }) => {
	const [status, setStatus] = useState<number>(0);
	const alertRef = useRef<{ timer: number; title: string } | null>(null);
	const userRef = useRef<null | string>(null);
	//0 -> checking login
	//1 -> no auth
	//2 -> auth

	useEffect(() => {
		(async () => {
			let resp = await fetch('http://localhost:5000/api/auth/get-user', {
				method: 'GET',
				credentials: 'include',
			});

			let body = await resp.json();

			if (body.err) {
				alertRef.current = {
					title: body.err,
					timer: 5,
				};
				setStatus(1);
			} else {
				userRef.current = body.resp.username;
				setStatus(2);
			}
		})();
	}, []);

	let toRender: JSX.Element | null = null;
	if (status === 0) {
		toRender = (
			<div>
				<BiLoaderAlt />
			</div>
		);
	} else if (status === 1) {
		toRender = (
			<div style={{ width: '100%', height: '100%' }}>
				<Alert options={alertRef.current} />
				<StyledUserForm userRef={userRef} redirect={setStatus} />
			</div>
		);
	} else {
		toRender = <>{children}</>;
	}
	return <UserContext.Provider value={{ username: userRef.current as string }}>{toRender}</UserContext.Provider>;
};

export default Auth;
