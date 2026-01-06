import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="mt-12 py-8 text-center text-xs text-neutral-400 border-t border-neutral-700/50 max-w-md mx-auto w-full px-4">
			<p>© {new Date().getFullYear()} Magnolias · Menú Digital</p>
		</footer>
	);
};

export default Footer;
