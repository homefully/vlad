import { Validator } from '../types'

type ValidatorMap = { [property: string]: Validator }
export type PropertiesValidatorInput<V extends ValidatorMap> = { [property in keyof V]?: Parameters<V[property]>[0] }
export type PropertiesValidatorResult<V extends ValidatorMap> = { [property in keyof V]?: ReturnType<V[property]> }

/**
 * Builds a validator function that applies the given validator map to the properties
 * in the given object, returning a map of errors.
 *
 * Example:
 *
 * ```typescript
 * const validator = properties({
 *     age: min(12, 'Age must be at least 12 to ride the rollercoaster'),
 *     name: requiredPrimitive('Must submit a name'),
 * })
 *
 * console.assert(validator({ age: 4 }) === {
 *     age: [ 'Age must be at least 12 to ride the rollercoaster' ],
 *     name: [ 'Must submit a name' ],
 * })
 * console.assert(validator({ age: 13 }) === {
 *     name: [ 'Must submit a name' ],
 * })
 * console.assert(validator({ age: 15, name: 'Kim' }) === undefined)
 * ```
 */
export function properties<
    V extends ValidatorMap
>(validatorMap: V,): Validator<PropertiesValidatorInput<V>, PropertiesValidatorResult<V>> {
    return function propertiesValidator(
        subject: PropertiesValidatorInput<V> | undefined,
        context: object | undefined,
    ): PropertiesValidatorResult<V> | undefined {
        if (subject === undefined)
            return undefined

        const errorEntries = Object
            .keys(validatorMap)
            .map(key => [
                key,
                validatorMap[key](subject[key], context),
            ] as const)
            .filter(([ _, errors ]) => errors !== undefined)

        if (errorEntries.length === 0)
            return undefined

        return Object.fromEntries(errorEntries) as PropertiesValidatorResult<V>
    }
}

