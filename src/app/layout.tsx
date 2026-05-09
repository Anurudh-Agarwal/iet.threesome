import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import SyncClerkWithSupabase from '@/components/SyncClerkWithSupabase';
import Navbar from '@/components/navbar/Navbar';
import { Metadata } from 'next';
import Footer from '@/components/Footer';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: 'IET.Threesome',
	description: 'Room allocation platform for IET hostel students.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={cn("font-sans", geist.variable)}>
			<body>
				<ClerkProvider
					localization={{
						signIn: {
							start: {
								subtitle: 'Use your college email ID',
							},
						},
						signUp: {
							start: {
								subtitle: 'Use your college email ID',
							},
						},
						formFieldInputPlaceholder__emailAddress: 'Use your IET Email ID',
					}}
				>
						<SyncClerkWithSupabase />
						<Navbar />
						{children}
						<Footer />
				</ClerkProvider>
			</body>
		</html>
	);
}
