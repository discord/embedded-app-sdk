import * as zod from 'zod';
import {ZodDefault, ZodTypeAny} from 'zod';

type ValueOf<T> = T[keyof T];

// This interface enforces that input objects include UNHANDLED: -1 and that they are cast to const
interface UnhandledObject {
  readonly UNHANDLED: -1;
}

/**
 * This is a helper function which coerces an unsupported arg value to the key/value UNHANDLED: -1
 * This is necessary to handle a scenario where a new enum value is added in the Discord Client,
 * so that the sdk will not throw an error when given a (newly) valid enum value.
 *
 * To remove the requirement for consumers of this sdk to import an enum when parsing data,
 * we instead use an object cast as const (readonly). This maintains parity with the previous
 * schema (which used zod.enum), and behaves more like a union type, i.e. 'foo' | 'bar' | -1
 *
 * @param inputObject This object must include the key/value pair UNHANDLED = -1
 */
export function zodCoerceUnhandledValue<T extends UnhandledObject>(inputObject: T) {
  return zod.preprocess(
    (arg: any) => {
      const [objectKey] = Object.entries(inputObject).find(([, value]) => value === arg) ?? [];
      if (arg != null && objectKey === undefined) {
        return inputObject.UNHANDLED;
      }
      return arg as ValueOf<T>;
    },
    zod.string().or(zod.number()) as unknown as zod.ZodType<ValueOf<T>>,
  );
}

export interface ZodEffectOverlayType<T extends ZodTypeAny> extends zod.ZodEffects<T> {
  overlayType: T;
  // Don't allow accessing the intermediate wrapper
  innerType(): never;
  _def: never;
}

/**
 * Fallback to the default zod value if parsing fails.
 */
export function fallbackToDefault<T extends ZodDefault<ZodTypeAny>>(schema: T): ZodEffectOverlayType<T> {
  const transform = zod.custom().transform((data) => {
    const res = schema.safeParse(data);
    if (res.success) {
      return res.data;
    }
    return schema._def.defaultValue();
  }) as ZodEffectOverlayType<T>;
  // Must set this inner schema so inspection works correctly
  transform.overlayType = schema;
  // transform._def.schema = schema;
  return transform;
}

/**
 * A union of objects discriminated by a numeric `type`, which falls back to `{type: -1}` when the value matches
 * none of them (e.g. a surface type added in a newer Discord client), mirroring the -1 fallback used for enums.
 */
export function zodUnionWithUnhandled<T extends [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]>(options: T) {
  return fallbackToDefault(
    zod
      .union(options)
      .or(zod.object({type: zod.literal(-1)}))
      .default({type: -1}),
  );
}
