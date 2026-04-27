import { useNavigate, useRouter } from "@tanstack/react-router";
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";
import { authClient } from "#/lib/auth-client";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavUser = () => {
	const navigate = useNavigate();
	const router = useRouter();
	const logout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.invalidate();
					navigate({ to: "/" });
				},
			},
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					className="flex items-center gap-2 rounded-full"
					variant="ghost"
					size="icon"
				>
					<Avatar className="h-8 w-8 cursor-pointer">
						{/* <AvatarImage src={user.avatar} alt={user.name} /> */}
						<AvatarFallback className="rounded-lg">CN</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Sparkles />
						Upgrade to Pro
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheck />
						Account
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						Billing
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell />
						Notifications
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout}>
					<LogOut />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default NavUser;
