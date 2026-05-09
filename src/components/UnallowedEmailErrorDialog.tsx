'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface WrongEmailPopupProps {
	open: boolean;
	onClose: () => void;
}

const UnallowedEmailErrorDialog = ({ open, onClose }: WrongEmailPopupProps) => {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
							<AlertCircle className="h-5 w-5 text-red-600" />
						</div>
						<DialogTitle className="text-lg font-semibold">Access Denied</DialogTitle>
					</div>
					<DialogDescription className="text-sm text-muted-foreground pt-2">
						Only <span className="font-medium text-foreground">@ietlucknow.ac.in</span>{' '}
						email addresses are allowed. Please sign in with your college email address.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="mt-4">
					<Button className="w-full" onClick={onClose}>
						Got it!
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default UnallowedEmailErrorDialog;
