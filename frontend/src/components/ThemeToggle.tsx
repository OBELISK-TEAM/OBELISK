import { FC } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunMoon } from 'lucide-react';
import { Button } from './ui/button';

const ThemeToggle: FC = () => {
	const { darkTheme, setDarkTheme } = useTheme();
	return (
		<div>
			<Button variant={'outline'} className='px-2' onClick={() => setDarkTheme(!darkTheme)}><SunMoon width='28px' height='28px'/></Button>
		</div>
	);
};

export default ThemeToggle;
