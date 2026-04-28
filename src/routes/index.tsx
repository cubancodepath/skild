import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Terminal } from "lucide-react";
import SkillCard from "#/components/SkillCard";
import { GetSkills } from "#/db/queries/skills";
import { dummySkills } from "#/lib/dummySkills";

const getSkillsFn = createServerFn({ method: "GET" }).handler(async () => {
	try {
		const skills = await GetSkills({});
		return skills;
	} catch (e) {
		console.error(e);
		return [];
	}
});

export const Route = createFileRoute("/")({
	component: Home,
	loader: () => getSkillsFn(),
});

function Home() {
	const skills = Route.useLoaderData();
	return (
		<div id="home">
			<section className="hero">
				<div className="copy">
					<h1>
						The Registry for <br />
						<span className="text-gradient">Agentic Intelligence</span>
					</h1>
					<p>
						A high performance registry for procedural agent skills. Discover,
						publish, and operate agent capabilities form a route driven
						workspace
					</p>
				</div>
				<div className="actions">
					<Link to="/skills" className="btn-primary">
						<Terminal size={18} />
						Browser Registry
					</Link>
					<Link to="/skills/new" className="btn-secondary">
						Publish Skill
					</Link>
				</div>
			</section>

			<section className="latest">
				<div className="space-y-2">
					<h2>
						Recently Created <span className="text-gradient">Skills</span>
					</h2>
					<p>Latest skills loading from Postgresql in descending order</p>
				</div>
				<div>
					{skills.length > 0 ? (
						<div className="skills-grid">
							{skills.map((skill) => (
								<SkillCard key={skill.id} {...skill} />
							))}
						</div>
					) : (
						<p>Not skills has been created yet</p>
					)}
				</div>
			</section>
		</div>
	);
}
