import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const ThemeToggle: FC = () => {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => setMounted(true), [])

	if (!mounted) {
		return <div className='w-6 h-6 p-5 border' /> // a placeholder so that so that the toggle doesn't show up suddenly
	}

	if (resolvedTheme === "dark") {
		return (
			<Button variant={'outline'} className='px-2' onClick={() => setTheme("light")}>
				<Sun className='w-6 h-6' />
			</Button>
		);
	}

	if (resolvedTheme === "light") {
		return (
			<Button variant={'outline'} className='px-2' onClick={() => setTheme("dark")}>
				<Moon className='w-6 h-6' />
			</Button>
		);
	}
};

export default ThemeToggle;
