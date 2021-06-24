# Vlad

Functional Validation library.

Provides simple validation with custom error messages.

See `src/validators` to see all available validators.

Example:

```ts


type Test = {
    foo: number,
    bla?: Array<string>
}

const validator = properties({
    foo: requiredPrimitive("Foo has to be set"),
    bla: all(maxItems(5, "has at max 5 items"), (it) => it.starsWith("s") ? undefined : "Should start with an s")
})

```
