import { FC } from 'react';
import { Button } from './ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: FC = () => {
	const { darkTheme, setDarkTheme } = useTheme();
	return (
		<div>
			<Button onClick={() => setDarkTheme(!darkTheme)}>Toggle Theme</Button>
		</div>
	);
};

export default ThemeToggle;
