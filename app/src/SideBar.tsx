import React from 'react';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';

interface toSideBar {
	className?: string;
	username: string;
	remote: React.Dispatch<React.SetStateAction<number>>;
}

const SideBar: (props: toSideBar) => JSX.Element = ({ remote, className, username }) => {
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
	width: 80px;
	height: 50px;
	border-radius: 5px;
	background: ${props => props.theme.colors.fgLIGHT};
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
		margin: 0px;
		padding: 4px;
		border-radius: 5px;
	}
	& h3:hover {
		background: #c5d1dd;
	}

	&:focus-within {
		transition-duration: 250ms;
		transition-delay: 250ms;
		height: 200px;
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
		margin-top: 8px;
		color: black;
		width: 2rem;
		height: 2rem;
		transition-duration: 250ms;
		transition-delay: 250ms;
	}
	& svg {
		font-size: 2rem;
		transition-duration: 250ms;
		transform-origin: center center;
	}
`;

export default StyledSideBar;
