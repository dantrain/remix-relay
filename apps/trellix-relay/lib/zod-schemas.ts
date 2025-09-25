import { z } from "zod";

export const idSchema = z.string().refine((val) => {
  const parts = val.split(":");

  return !!(
    parts.length === 2 &&
    z.uuid().parse(parts[0]) &&
    z.cuid2().parse(parts[1])
  );
});
