import 'styled-components';

// and extend them!
declare module 'styled-components' {
	export interface DefaultTheme {
		colors: {
			bgDARK: string;
			bgLIGHT: string;
			fgLIGHT: string;
			fgCOL: string;
		};
		font: {
			main: string;
		};
	}
}
