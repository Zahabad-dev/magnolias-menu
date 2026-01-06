"use client";
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { prewarmCoreCategories } from '@/data/menu';
import ScrollTopButton from './ScrollTopButton';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	useEffect(() => {
		prewarmCoreCategories();
		const measure = () => {
			const h = document.getElementById('site-header')?.getBoundingClientRect().height;
			if (h) document.documentElement.style.setProperty('--header-height', h + 'px');
		};
		measure();
		const t = setTimeout(measure, 250);
		window.addEventListener('resize', measure);
		return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
	}, []);
	return (
		<div className="min-h-screen flex flex-col text-neutral-100 transition-colors overflow-x-hidden">
			<Header />
			<div aria-hidden style={{ height: 'var(--header-height,120px)' }} />
			<main className="flex-1 mx-auto w-full max-w-md px-4 pt-2 pb-16 relative">
				{children}
				<ScrollTopButton />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
