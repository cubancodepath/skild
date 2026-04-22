import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import NavUser from "./nav-user";
import Show from "./Show";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
	return (
		<nav className="navbar">
			<div className="brand">
				<div className="mark">
					<div className="glyph"></div>
				</div>
				<Link to="/">
					<span>Skild</span>
				</Link>
			</div>
			<div className="actions">
				<Show when="sign-in">
					<NavUser />
				</Show>
				<Show when="sign-out">
					<Link to="/sign-in" className="btn-primary">
						<LogIn size={16} />
						Sign In
					</Link>
				</Show>
			</div>
		</nav>
	);
};

export default Navbar;
