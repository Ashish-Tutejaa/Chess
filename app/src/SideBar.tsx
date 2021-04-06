import React from 'react';
import styled from 'styled-components';

interface toSideBar {
	className?: string;
	username: string;
	remote: React.Dispatch<React.SetStateAction<number>>;
}

const SideBar: (props: toSideBar) => JSX.Element = ({ remote, className, username }) => {
	return (
		<div className={className}>
			<div onClick={() => remote(0)}>
				<h3>{username}</h3>
			</div>
			<div onClick={() => remote(1)}>
				<h3>Make Challenge</h3>
			</div>
			<div>
				<h3>Join Challenge</h3>
			</div>
		</div>
	);
};

const StyledSideBar = styled(SideBar)<toSideBar>`
	position: absolute;
	left: 0px;
	top: 0px;
	width: 250px;
	height: 100%;
	background: #abc;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: center;
	font-family: 'Open Sans', sans-serif;
	& div:first-child {
		margin-top: 50px;
	}
	& div {
		margin-bottom: 20px;
		cursor: pointer;
		border-radius: 5px;
		transition-duration: 250ms;
		padding: 5px;
	}
	& h3 {
		margin: 0px;
	}
	& div:hover {
		background: #c5d1dd;
	}
`;

export default StyledSideBar;
