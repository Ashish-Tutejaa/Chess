import React from 'react';
import styled from 'styled-components';

const StyledLobby = styled('div')`
	color: white;
	font-family: ${props => props.theme.font.main};
`;

export const Lobby: (props: { gameId: string }) => JSX.Element = ({ gameId }) => {
	console.log('Lobby');

	return (
		<StyledLobby>
			<h1>
				Waiting for player 2. <br /> Use Code {gameId} to join.
			</h1>
		</StyledLobby>
	);
};
