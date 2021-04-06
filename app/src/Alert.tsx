import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes, StyledComponent } from 'styled-components';

var GlobalAlertCounter = 0;

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
	background: #1e1e1e;
	color: white;
	transform: scale(1);
	animation: ${invis} ${props => props.timer}000ms 0ms 1 normal ease-in-out forwards;
`;

const Alert: (props: toAlert) => null | JSX.Element = ({ options, className }) => {
	const [show, setShow] = useState<number>(0);

	useEffect(() => {
		console.log('reseting to 0');
		setShow(0);
	}, [options]);

	if (options === null || show === 1) return null;

	return (
		<div onClick={() => setShow(1)} key={Math.random()} className="alert-wrapper">
			<StyledAlert timer={options.timer}>{options.title}</StyledAlert>
		</div>
	);
};

export default Alert;
