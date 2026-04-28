/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

const submitSkillSchema = z.object({
	title: z.string().trim().min(1, "Skill title is required."),
	description: z.string().trim().min(1, "Description is required."),
	tags: z
		.string()
		.trim()
		.refine(
			(value) =>
				value
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean).length > 0,
			{ message: "At least one tag is required." },
		),
	installCommand: z.string().trim().min(1, "Install command is required."),
	promptConfig: z.string().trim().min(1, "Prompt configuration is required."),
	usageExample: z.string().trim().min(1, "Usage example is required."),
});

type SubmitSkillsFormValues = z.infer<typeof submitSkillSchema>;

const defaultValues: SubmitSkillsFormValues = {
	title: "",
	description: "",
	tags: "",
	installCommand: "",
	promptConfig: "",
	usageExample: "",
};

export const Route = createFileRoute("/skills/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: submitSkillSchema,
		},
		onSubmit: async ({ value }) => {
			toast.success("Form submitted successfully");
		},
	});

	const isSubmitting = form.state.isSubmitting;

	return (
		<div id="new-skill">
			<Link
				to={"/skills" as string}
				search={{ q: "", page: 1 }}
				className="back"
			>
				<ArrowLeft size={16} />
				<span>Back to Skills</span>
			</Link>

			<div className="intro">
				<h1>Submit a New Skill</h1>
				<p>Share your skill with the community.</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="content"
			>
				{/* Section 1: Basic Info */}
				<div className="block">
					<FieldGroup>
						<form.Field
							name="title"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g. Firebase Authentication Helper"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="description"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Description</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Briefly describe what this skill does and when to use it..."
											rows={4}
											className="min-h-24 resize-none"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="tags"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tags</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g. firebase, auth, react (comma-separated)"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				{/* Divider */}
				<div className="divider" />

				{/* Section 2: Installation */}
				<div className="block">
					<FieldGroup>
						<form.Field
							name="installCommand"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Install Command
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g. npx shadcn@latest add button"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
						<form.Field
							name="promptConfig"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Prompt Configuration
										</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Paste the prompt or agent instructions here..."
											rows={6}
											className="min-h-32 resize-none"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				{/* Divider */}
				<div className="divider" />

				{/* Section 3: Usage */}
				<div className="block">
					<FieldGroup>
						<form.Field
							name="usageExample"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Usage Example</FieldLabel>
										<Textarea
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="Show how to use this skill in a real scenario..."
											rows={6}
											className="min-h-32 resize-none"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</div>

				{/* Submit */}
				<div className="actions">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="animate-spin" />
								Publishing...
							</>
						) : (
							<>
								<Zap />
								Publish Skill
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
