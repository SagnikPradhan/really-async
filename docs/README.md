really-async

# really-async

A lightweight library for generators in react 😤

**`Install`**

```bash
pnpm i really-async
```

**`License`**

MIT Copyright (c) 2022-Present Sagnik Pradhan

## Table of contents

### Classes

- [ErrorBoundary](classes/ErrorBoundary.md)

### Interfaces

- [ErrorBoundaryProps](interfaces/ErrorBoundaryProps.md)
- [UseAsyncGeneratorReturnValue](interfaces/UseAsyncGeneratorReturnValue.md)

### Type Aliases

- [Gen](README.md#gen)

### Functions

- [useAsyncGenerator](README.md#useasyncgenerator)
- [wrapAsyncGeneratorComponent](README.md#wrapasyncgeneratorcomponent)

## Type Aliases

### Gen

Ƭ **Gen**<`T`\>: `AsyncGenerator`<`T`, `T`, `never`\>

Async generator that yields and returns

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

index.tsx:17

## Functions

### useAsyncGenerator

▸ **useAsyncGenerator**<`T`\>(`generatorFactory`, `rush?`): [`UseAsyncGeneratorReturnValue`](interfaces/UseAsyncGeneratorReturnValue.md)<`T`\>

A collector for all the values generated and returned by the generator.

**`Example`**

```ts
import { useAsyncGenerator } from "really-async";
import { fetchMessages, fetchUser } from "$/api/messages";

async function* getTransformedMessages(channelId: string) {
	for await (const message of fetchMessages(channelId)) {
		const user = fetchUser(message.partialUser.id);
		yield { message, user };
	}
}

export function Component({ channelId }: { channelId: string }) {
	const { values: messages } = useAsyncGenerator(() =>
		getTransformedMessages(channelId)
	);

	return (
		<div>
			{messages.map((message) => (
				<Message key={message.id} data={message} />
			))}
		</div>
	);
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `generatorFactory` | () => [`Gen`](README.md#gen)<`T`\> | `undefined` | Async generator function |
| `rush` | `boolean` | `true` | Immediately render the component |

#### Returns

[`UseAsyncGeneratorReturnValue`](interfaces/UseAsyncGeneratorReturnValue.md)<`T`\>

An object containing values, error and execute function

#### Defined in

index.tsx:64

___

### wrapAsyncGeneratorComponent

▸ **wrapAsyncGeneratorComponent**<`P`\>(`component`): (`props`: `P`) => `Element`

HOC for generator components. Renders the last value

**`Example`**

```ts
import fs from "fs/promises";
import { wrapAsyncGeneratorComponent } from "really-async";
import {
	getAllNodes,
	getAllDependantNodes,
	optimizeNodes,
} from "$/utils/nodes";

async function* CreateTree() {
	const nodes = yield* getAllNodes();
	const dependantNodes = yield* getAllDependantNodes(nodes);
	const result = yield* optimizeNodes(dependantNodes);

	yield "Writing file";
	await fs.writeFile(result.print());

	return <Result result={result} />;
}

export default wrapAsyncGeneratorComponent(CreateTree);
```

#### Type parameters

| Name |
| :------ |
| `P` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | (`props`: `P`) => [`Gen`](README.md#gen)<`ReactNode`\> | Component returning an async generator |

#### Returns

`fn`

HOC

▸ (`props`): `Element`

##### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `P` |

##### Returns

`Element`

#### Defined in

index.tsx:124
