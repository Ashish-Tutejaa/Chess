import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes, StyledComponent } from 'styled-components';

var GlobalAlertCounter = 0;

const invisBefore = keyframes`
	0% {
        transform: scaleY(1);
    }
    100% {
        transform: scaleY(0);
    }
`;

const invis = keyframes`
    0% {
        transform: scale(1);
    }
    99% {
        transform: scale(1);
    }
    100% {
        transform: scale(0);
    }
`;

interface toAlert {
	options: {
		timer: number;
		title: string;
	} | null;
	className?: string;
}

const StyledAlert = styled('div')<{ timer: number }>`
	position: fixed;
	top: 10px;
	right: 10px;
	width: 200px;
	height: 75px;
	height: fit-content;
	padding: 10px;
	font-size: 1rem;
	box-shadow: 0px 0px 0px 1px white;
	font-family: ${props => props.theme.font.main};
	font-weight: bold;
	background: ${props => props.theme.colors.bgDARK};
	color: white;
	transform: scale(1);
	border-radius: 5px;
	border-top-right-radius: 0px;
	border-bottom-right-radius: 0px;
	overflow: hidden;
	&::before {
		content: ' ';
		position: absolute;
		right: 0px;
		bottom: 0px;
		z-index: 10;
		height: 100%;
		width: 5px;
		background: ${props => props.theme.colors.fgCOL};
		transform-origin: left top;
		/* animation: ${invisBefore} ${props => props.timer}000ms 0ms 1 normal ease-in-out forwards; */
	}
	animation: ${invis} ${props => props.timer}000ms 0ms 1 normal ease-in-out forwards;
`;

const Alert: (props: toAlert) => null | JSX.Element = ({ options, className }) => {
	const [show, setShow] = useState<number>(0);

	let randomKey = useMemo(() => Math.floor(Math.random() * 100), [options]);

	useEffect(() => {
		console.log('reseting to 0');
		setShow(0);
	}, [options]);

	if (options === null || show === 1) return null;

	return (
		<div onClick={() => setShow(1)} key={randomKey} className="alert-wrapper">
			<StyledAlert timer={options.timer}>{options.title}</StyledAlert>
		</div>
	);
};

export default Alert;
