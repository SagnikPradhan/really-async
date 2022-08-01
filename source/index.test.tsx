import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary, wrapAsyncGeneratorComponent } from ".";

const delay = (ms: number) =>
	new Promise<void>((resolve) => setTimeout(resolve, ms));

describe("Generator HOC", () => {
	async function* GeneratorComponent(options: {
		payload?: string;
		error?: string;
	}) {
		yield <h1>Loading</h1>;
		await delay(50);
		if (options.error) throw new Error(options.error);
		return <h1>{options.payload}</h1>;
	}

	const Component = wrapAsyncGeneratorComponent(GeneratorComponent);

	it("Should render in order", async () => {
		render(<Component payload="Hello World" />);

		await screen.findByText("Loading");
		await screen.findByText("Hello World");
	});

	it("Should throw and catch error", async () => {
		render(
			<ErrorBoundary fallback={({ error }) => <h1>{error.message}</h1>}>
				<Component error="Hello, I want to error" />
			</ErrorBoundary>
		);

		await screen.findByText("Loading");
		await screen.findByText("Hello, I want to error");
	});

	it("Should clean up", async () => {
		const view = render(<Component payload="Hello World" />);
		view.unmount();
	});
});
