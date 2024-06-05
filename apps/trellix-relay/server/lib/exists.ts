import invariant from "tiny-invariant";

export default function exists<T>(
  value: T,
  message?: string | (() => string) | undefined,
) {
  invariant(value, message);
  return value;
}
