[really-async](../README.md) / ErrorBoundary

# Class: ErrorBoundary

Utility error boundary component

**`Example`**

```ts
import { ErrorBoundary } from "really-async";
import CreateTree from "$/components/create-tree";
import ErrorView from "$/components/error-view";

export function Component() {
	return (
		<ErrorBoundary fallback={({ error }) => <ErrorView error={error} />}>
			<CreateTree />
		</ErrorBoundary>
	);
}
```

## Hierarchy

- `Component`<[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md), `ErrorBoundaryState`\>

  ↳ **`ErrorBoundary`**

## Table of contents

### Constructors

- [constructor](ErrorBoundary.md#constructor)

### Methods

- [render](ErrorBoundary.md#render)
- [getDerivedStateFromError](ErrorBoundary.md#getderivedstatefromerror)

## Constructors

### constructor

• **new ErrorBoundary**(`props`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | [`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md) |

#### Overrides

React.Component&lt;
	ErrorBoundaryProps,
	ErrorBoundaryState
\&gt;.constructor

#### Defined in

index.tsx:170

## Methods

### render

▸ **render**(): `undefined` \| ``null`` \| `string` \| `number` \| `boolean` \| `ReactFragment` \| `Element`

#### Returns

`undefined` \| ``null`` \| `string` \| `number` \| `boolean` \| `ReactFragment` \| `Element`

#### Overrides

React.Component.render

#### Defined in

index.tsx:179

___

### getDerivedStateFromError

▸ `Static` **getDerivedStateFromError**(`error`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `error` | `Error` |

#### Defined in

index.tsx:175
