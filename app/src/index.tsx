import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Auth from './Auth';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Auth>
				<App />
			</Auth>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
