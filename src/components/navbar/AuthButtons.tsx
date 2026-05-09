'use client';

import { Button } from '@/components/ui/button';
import { useAuth, SignInButton, SignOutButton } from '@clerk/nextjs';
import { Spinner } from '../ui/spinner';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function AuthButtons() {
	const { isSignedIn, isLoaded } = useAuth();
	const isMobile = useIsMobile();

	if (!isLoaded) {
		return (
			<div className="h-8 w-16 flex items-center justify-center">
				<Spinner className="h-4 w-4" />
			</div>
		);
	}

	return (
		<div className="flex items-center">
			{isSignedIn ? (
				<SignOutButton>
					<Button size={isMobile ? 'sm' : 'default'}>Logout</Button>
				</SignOutButton>
			) : (
				<SignInButton mode="modal">
					<Button size={isMobile ? 'sm' : 'default'}>Login</Button>
				</SignInButton>
			)}
		</div>
	);
}
