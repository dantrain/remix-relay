import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../app/schema/db-schema";
import { movies } from "../app/schema/types/Movie";
import { $ } from "zx";

const sqlite = new Database();
const db = drizzle(sqlite, { schema });

const query = db
  .insert(movies)
  .values([
    {
      id: "1",
      slug: "lady_bird",
      title: "Lady Bird",
      criticScore: 99,
      audienceScore: 79,
      criticsConsensus:
        "Lady Bird delivers fresh insights about the turmoil of adolescence — and reveals writer-director Greta Gerwig as a fully formed filmmaking talent.",
      boxOffice: "$48.9M",
      imgUrl:
        "https://resizing.flixster.com/RldEI9TKeGI7afFzLTtitjj3zvY=/206x305/v2/https://resizing.flixster.com/LOtla2hZ_dEZ8mLjLKYYUX5NLyo=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzI4MjU0NjdiLTMwYTQtNDVmNy1hYjdjLWYwNTk5NTc0MGQ3MC53ZWJw",
    },
    {
      id: "2",
      slug: "downsizing",
      title: "Downsizing",
      criticScore: 47,
      audienceScore: 25,
      criticsConsensus:
        "Downsizing assembles a talented cast in pursuit of some truly interesting ideas — which may be enough for some audiences to forgive the final product's frustrating shortcomings.",
      boxOffice: "$24.4M",
      imgUrl:
        "https://resizing.flixster.com/Z1VFiOCKmtTnpaF1xpjv770Yhe4=/206x305/v2/https://resizing.flixster.com/M2oJAZpNF55WTowKCUlfRgUAdlw=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzMxOGQyOThiLTExYjItNDQ3Zi05MzEwLWUyZjdlYjQ1Y2FjOS53ZWJw",
    },
  ])
  .toSQL();

const sql = query.params.reduce((acc: string, param) => {
  return acc.replace(
    "?",
    typeof param === "string" ? `'${param.replace("'", "")}'` : `${param}`,
  );
}, query.sql);

console.log(sql);

await $`wrangler d1 execute DB --local --command ${sql}`;
