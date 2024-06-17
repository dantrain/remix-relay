import { z } from "zod";

export const idSchema = z.string().refine((val) => {
  const parts = val.split(":");

  return !!(
    parts.length === 2 &&
    z.string().uuid().parse(parts[0]) &&
    z.string().cuid2().parse(parts[1])
  );
});
