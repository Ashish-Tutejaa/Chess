import { StyledButton } from './Styles';
import styled from 'styled-components';

interface toRetry {
	retry: React.Dispatch<React.SetStateAction<number>>;
	className?: string;
}

const Retry: (props: toRetry) => JSX.Element = ({ retry, className }) => {
	return (
		<div className={className}>
			<h1>Connection Failed 😐</h1>
			<StyledButton onClick={() => retry(p => (p % 2 == 0 ? p + 1 : p - 1))}>Retry</StyledButton>
		</div>
	);
};

export const StyledRetry = styled(Retry)<toRetry>`
	color: white;
	font-family: ${props => props.theme.font.main};
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;
	align-items: center;
`;
