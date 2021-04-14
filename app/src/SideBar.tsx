import React from 'react';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';

interface toSideBar {
	className?: string;
	username: string;
	remote: React.Dispatch<React.SetStateAction<number>>;
}

const SideBar: (props: toSideBar) => JSX.Element = ({ remote, className, username }) => {
	const handleLogout = () => {
		console.log`logout`;
		fetch('http://localhost:5000/api/auth/delete-user', {
			method: 'DELETE',
			credentials: 'include',
		})
			.then(res => {
				window.location.pathname = '';
			})
			.catch(res => {
				alert(res);
				console.log(res);
			});
	};

	return (
		<>
			<div className={className}>
				<a onClick={e => e.preventDefault()} href="">
					<FaBars />
				</a>
				<div>
					<h3 onMouseDown={() => remote(0)}>{username}</h3>
				</div>
				<div>
					<h3 onMouseDown={() => remote(1)}>Make Challenge</h3>
				</div>
				<div>
					<h3 onMouseDown={() => remote(2)}>Join Challenge</h3>
				</div>
				<div>
					<h3 onMouseDown={handleLogout}>Logout</h3>
				</div>
			</div>
			<div className="overlay"></div>
		</>
	);
};

const StyledSideBar = styled(SideBar)<toSideBar>`
	position: absolute;
	z-index: 1001;
	left: 0px;
	top: 0px;
	margin-top: 5%;
	margin-left: 5%;
	width: 40px;
	height: 40px;
	border-radius: 3px;
	background: ${props => props.theme.colors.bgDARK};
	/* box-shadow: 0px 0px 0px 1px ${props => props.theme.colors.fgCOL}; */
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: center;
	font-family: ${props => props.theme.font.main};
	& div:nth-child(2) {
		margin-top: 15px;
	}
	& div {
		margin-bottom: 20px;
		cursor: pointer;
		transform: scaleY(0);
		transform-origin: center top;
		transition-duration: 0ms;
		transition-delay: 0ms;
	}
	& h3 {
		color: white;
		margin: 0px;
		padding: 4px;
		border-radius: 5px;
	}
	& h3:hover {
		background: ${props => props.theme.colors.bgLIGHT};
	}

	&:focus-within {
		transition-duration: 250ms;
		transition-delay: 250ms;
		height: 240px;
		width: 200px;
	}

	&:focus-within svg {
		transform: scale(0);
	}

	&:focus-within > a {
		height: 0rem;
	}

	&:focus-within > div {
		transition-duration: 250ms;
		transition-delay: 500ms;
		transform: scaleY(1);
	}

	& a {
		margin-top: 6px;
		color: ${props => props.theme.colors.fgLIGHT};
		width: 1.7rem;
		height: 1.7rem;
		transition-duration: 250ms;
		transition-delay: 250ms;
	}
	& svg {
		font-size: 1.7rem;
		transition-duration: 250ms;
		transform-origin: center center;
	}
`;

export default StyledSideBar;
