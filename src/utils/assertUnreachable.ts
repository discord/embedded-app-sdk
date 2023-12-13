/**
 * Assets x is statically unreachable at build-time,
 * and throws at runtime if data is dynamic.
 */
export default function assertUnreachable(_x: never, runtimeError: Error): never {
  throw runtimeError;
}
