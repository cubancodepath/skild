import { Link } from "@tanstack/react-router";

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
			<div className="actions" />
		</nav>
	);
};

export default Navbar;
