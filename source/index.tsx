/**
 * A lightweight library for generators in react 😤
 *
 * **`Install`**
 *
 * ```bash
 * pnpm i really-async
 * ```
 *
 * @license MIT Copyright (c) 2022-Present Sagnik Pradhan
 * @packageDocumentation
 */

import React, { useEffect, useState } from "react";

/** Async generator that yields and returns */
export type Gen<T> = AsyncGenerator<T, T, never>;

/** Return value of useAsyncGenerator */
export interface UseAsyncGeneratorReturnValue<T> {
	/** Values generated by the generator */
	values: T[];
	/** Error throw by the generator */
	error: any;
	/** Execute the generator */
	execute: () => void;
}

/**
 * A collector for all the values generated and returned by the generator.
 *
 * @example
 *
 * ```ts
 * import { useAsyncGenerator } from "really-async";
 * import { fetchMessages, fetchUser } from "$/api/messages";
 *
 * async function* getTransformedMessages(channelId: string) {
 * 	for await (const message of fetchMessages(channelId)) {
 * 		const user = fetchUser(message.partialUser.id);
 * 		yield { message, user };
 * 	}
 * }
 *
 * export function Component({ channelId }: { channelId: string }) {
 * 	const { values: messages } = useAsyncGenerator(() =>
 * 		getTransformedMessages(channelId)
 * 	);
 *
 * 	return (
 * 		<div>
 * 			{messages.map((message) => (
 * 				<Message key={message.id} data={message} />
 * 			))}
 * 		</div>
 * 	);
 * }
 * ```
 *
 * @param generatorFactory - Async generator function
 * @param rush - Immediately render the component
 * @returns An object containing values, error and execute function
 */
export function useAsyncGenerator<T>(
	generatorFactory: () => Gen<T>,
	rush = true
): UseAsyncGeneratorReturnValue<T> {
	const [values, setValues] = useState<T[]>([]);
	const [error, setError] = useState<any>(null);
	const signal = { stop: false };

	const execute = () => {
		setValues([]);
		setError(null);
		signal.stop = false;

		handleGenerator({
			signal,
			generator: generatorFactory(),
			handleError: (error) => setError(error),
			handleValue: (value: T) => setValues((values) => [...values, value]),
		});
	};

	useEffect(() => {
		if (rush) execute();
		return () => void (signal.stop = true);
	}, []);

	return { values, error, execute };
}

/**
 * HOC for generator components. Renders the last value
 *
 * @example
 *
 * ```ts
 * import fs from "fs/promises";
 * import { wrapAsyncGeneratorComponent } from "really-async";
 * import {
 * 	getAllNodes,
 * 	getAllDependantNodes,
 * 	optimizeNodes,
 * } from "$/utils/nodes";
 *
 * async function* CreateTree() {
 * 	const nodes = yield* getAllNodes();
 * 	const dependantNodes = yield* getAllDependantNodes(nodes);
 * 	const result = yield* optimizeNodes(dependantNodes);
 *
 * 	yield "Writing file";
 * 	await fs.writeFile(result.print());
 *
 * 	return <Result result={result} />;
 * }
 *
 * export default wrapAsyncGeneratorComponent(CreateTree);
 * ```
 *
 * @param component Component returning an async generator
 * @returns HOC
 */
export function wrapAsyncGeneratorComponent<P>(
	component: (props: P) => Gen<React.ReactNode>
) {
	return (props: P) => {
		const { error, values } = useAsyncGenerator(() => component(props));

		useEffect(() => {
			if (error) throw error;
		}, [error]);

		return <React.Fragment>{values.at(-1)}</React.Fragment>;
	};
}

export interface ErrorBoundaryProps {
	fallback: (options: { error: Error }) => React.ReactElement;
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	error: Error | null;
}

/**
 * Utility error boundary component
 *
 * @example
 *
 * ```ts
 * import { ErrorBoundary } from "really-async";
 * import CreateTree from "$/components/create-tree";
 * import ErrorView from "$/components/error-view";
 *
 * export function Component() {
 * 	return (
 * 		<ErrorBoundary fallback={({ error }) => <ErrorView error={error} />}>
 * 			<CreateTree />
 * 		</ErrorBoundary>
 * 	);
 * }
 * ```
 */
export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		const E = this.props.fallback;
		if (this.state.error) return <E error={this.state.error} />;
		else return this.props.children;
	}
}

function handleGenerator<T>(options: {
	generator: AsyncGenerator<T, T>;
	signal: { stop: boolean };
	handleValue: (value: T) => void;
	handleError: (error: any) => void;
}): Promise<void> {
	return options.generator
		.next()
		.then((result) => {
			if (options.signal.stop) return;
			if (result.value) options.handleValue(result.value);
			if (result.done) return;
			else return handleGenerator(options);
		})
		.catch(options.handleError);
}
