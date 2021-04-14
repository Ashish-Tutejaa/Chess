import React, { useEffect, useRef, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import styled, { keyframes } from 'styled-components';
import Alert from './Alert';
import { StyledButton, StyledLoader } from './shared/Styles';

export const UserContext = React.createContext<{ username: string }>({ username: '&007' });

const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
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
		if (inputRef.current) {
			let len = inputRef.current.value.length;
			if (len < 3) {
				setErr({ timer: 5, title: `Username must be atleast 3 characters` });
				setLoad(0);
				return;
			} else if (len > 15) {
				setErr({ timer: 5, title: `Username must can be atmost 15 characters` });
				setLoad(0);
				return;
			}
		}

		let avail = await checkUser();
		console.log(avail);
		if (avail) {
			setErr({ timer: 5, title: `This Username is taken already!` });
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
			<StyledButton onClick={handleUserClick}>{load === 1 ? <StyledLoader /> : 'Enter'}</StyledButton>
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

const StyledWrapper = styled('div')`
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 3rem;
	svg {
		animation: ${rotate} 1000ms 0ms infinite normal ease-in-out forwards;
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
					title: 'You must Login to Play',
					timer: 5,
				};
				setStatus(1);
			} else if (body.resp) {
				userRef.current = body.resp.username;
				setStatus(2);
			}
		})();
	}, []);

	let toRender: JSX.Element | null = null;
	if (status === 0) {
		toRender = (
			<StyledWrapper>
				<BiLoaderAlt />
			</StyledWrapper>
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
