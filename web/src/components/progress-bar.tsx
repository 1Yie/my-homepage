import nprogress from 'nprogress';
import { useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router-dom';
import 'nprogress/nprogress.css';

nprogress.configure({
	showSpinner: false,
	speed: 400,
	minimum: 0.2,
});

export function ProgressBar() {
	const location = useLocation();
	const navigation = useNavigation();

	useEffect(() => {
		if (navigation.state === 'loading' || navigation.state === 'submitting') {
			nprogress.start();
		} else {
			nprogress.done();
		}
	}, [navigation.state]);

	useEffect(() => {
		nprogress.start();

		const timer = setTimeout(() => {
			nprogress.done();
		}, 100);

		return () => clearTimeout(timer);
	}, [location.pathname]);

	return null;
}
