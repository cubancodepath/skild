import { createFileRoute } from "@tanstack/react-router";

// export const getSkillFn = createServerFn({ method: "GET" })
// 	.validator((d: string) => d)
// 	.handler(async ({ data }) => {
// 		const skill = await GetSkillById(data);
// 		if (!skill) {
// 			throw notFound();
// 		}
// 		return skill;
// 	});

export const Route = createFileRoute("/skills/$skillId")({
	// loader: ({ params }) => getSkillFn({ data: params.skillId }),
	component: RouteComponent,
});

function RouteComponent() {
	// const handleCopy = () => {
	// 	if (!skill.installCommand) return;
	// 	navigator.clipboard.writeText(skill.installCommand);
	// 	setCopied(true);
	// 	setTimeout(() => setCopied(false), 2000);
	// };

	return (
		<div>hello</div>
		// <div className="container mx-auto py-10">
		// 	<div className="max-w-4xl mx-auto">
		// 		<div className="mb-8">
		// 			<h1 className="text-4xl font-bold mb-4">{skill.title}</h1>
		// 			<p className="text-xl text-text-muted">{skill.description}</p>
		// 		</div>

		// 		<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
		// 			<div className="md:col-span-2 space-y-8">
		// 				<section className="bg-elevated p-6 rounded-xl border border-border/50">
		// 					<h2 className="text-xl font-semibold mb-4 text-gradient">
		// 						Installation
		// 					</h2>
		// 					<div className="bg-black/40 rounded-lg p-4 flex items-center justify-between font-mono text-sm">
		// 						<code className="text-blue-400">
		// 							<span className="text-emerald-500 mr-2">$</span>
		// 							{skill.installCommand}
		// 						</code>
		// 						<button
		// 							type="button"
		// 							onClick={handleCopy}
		// 							className="p-2 hover:bg-white/10 rounded-md transition-colors"
		// 							title="Copy to clipboard"
		// 						>
		// 							{copied ? (
		// 								<Check size={18} className="text-emerald-500" />
		// 							) : (
		// 								<Copy size={18} />
		// 							)}
		// 						</button>
		// 					</div>
		// 				</section>

		// 				{skill.usageExample && (
		// 					<section className="bg-elevated p-6 rounded-xl border border-border/50">
		// 						<h2 className="text-xl font-semibold mb-4 text-gradient">
		// 							Usage Example
		// 						</h2>
		// 						<pre className="bg-black/40 rounded-lg p-4 font-mono text-sm overflow-x-auto">
		// 							<code>{skill.usageExample}</code>
		// 						</pre>
		// 					</section>
		// 				)}

		// 				{skill.promptConfig && (
		// 					<section className="bg-elevated p-6 rounded-xl border border-border/50">
		// 						<h2 className="text-xl font-semibold mb-4 text-gradient">
		// 							System Prompt / Config
		// 						</h2>
		// 						<pre className="bg-black/40 rounded-lg p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
		// 							<code>{skill.promptConfig}</code>
		// 						</pre>
		// 					</section>
		// 				)}
		// 			</div>

		// 			<div className="space-y-6">
		// 				<div className="bg-elevated p-6 rounded-xl border border-border/50">
		// 					<h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
		// 						Details
		// 					</h3>
		// 					<dl className="space-y-4">
		// 						<div>
		// 							<dt className="text-xs text-text-muted uppercase mb-1">
		// 								Author
		// 							</dt>
		// 							<dd className="flex items-center gap-2">
		// 								<img
		// 									src="/logo192.png"
		// 									alt={skill.author?.name ?? "Author"}
		// 									className="size-6 rounded-full"
		// 								/>
		// 								<span className="text-sm font-medium">
		// 									{skill.author?.name ?? "Unknown"}
		// 								</span>
		// 							</dd>
		// 						</div>
		// 						<div>
		// 							<dt className="text-xs text-text-muted uppercase mb-1">
		// 								Created
		// 							</dt>
		// 							<dd className="text-sm">
		// 								{new Date(skill.createdAt).toLocaleDateString()}
		// 							</dd>
		// 						</div>
		// 						{skill.tags && skill.tags.length > 0 && (
		// 							<div>
		// 								<dt className="text-xs text-text-muted uppercase mb-1">
		// 									Tags
		// 								</dt>
		// 								<dd className="flex flex-wrap gap-2 pt-1">
		// 									{skill.tags.map((tag) => (
		// 										<span
		// 											key={tag}
		// 											className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-bold"
		// 										>
		// 											{tag}
		// 										</span>
		// 									))}
		// 								</dd>
		// 							</div>
		// 						)}
		// 					</dl>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
	);
}
