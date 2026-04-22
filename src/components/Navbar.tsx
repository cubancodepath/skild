import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import Show from "./Show";

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
