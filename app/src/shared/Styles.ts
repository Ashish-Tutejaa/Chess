import styled, { keyframes } from 'styled-components';
import { BiLoaderAlt } from 'react-icons/bi';

export const StyledButton = styled('button')`
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
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const rotate = keyframes`
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
`;

export const StyledLoader = styled(BiLoaderAlt)`
	animation: ${rotate} 1000ms 0ms infinite normal ease-in-out forwards;
`;
