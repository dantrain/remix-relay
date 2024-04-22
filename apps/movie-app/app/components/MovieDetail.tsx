import { graphql, useFragment } from "react-relay";
import { twMerge } from "tailwind-merge";
import { Suspense } from "@remix-relay/react";
import LikeButton from "./LikeButton";
import type { MovieDetailFragment$key } from "./__generated__/MovieDetailFragment.graphql";

const fragment = graphql`
  fragment MovieDetailFragment on Movie {
    title
    criticScore
    audienceScore
    criticsConsensus
    imgUrl
    ...LikeButtonFragment @defer
  }
`;

type MovieDetailProps = {
  className?: string;
  dataRef: MovieDetailFragment$key;
};

export default function MovieDetail({ className, dataRef }: MovieDetailProps) {
  const movie = useFragment(fragment, dataRef);
  const { title, criticScore, audienceScore, criticsConsensus, imgUrl } = movie;

  return (
    <div className={twMerge("flex flex-col gap-8 sm:flex-row", className)}>
      <div className="flex flex-none justify-center">
        <img alt={`${title} poster`} height={305} src={imgUrl} width={206} />
      </div>
      <div className="flex-grow py-2">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="my-[1px] text-2xl font-bold">{title}</h1>
          <Suspense>
            <LikeButton dataRef={movie} />
          </Suspense>
        </div>
        <hr className="mb-4 border-slate-700" />
        <dl className="mb-4">
          <div className="mb-4 flex gap-8">
            <div>
              <dt className="mb-1 text-xs font-bold uppercase text-slate-400">
                Tomatometer
              </dt>
              <dd className="text-2xl font-bold">
                <div className="text-2xl">
                  {criticScore >= 60 ? "🍅" : "🤢"}
                </div>
                <div>{criticScore}%</div>
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-xs font-bold uppercase text-slate-400">
                Audience
              </dt>
              <dd className="text-2xl font-bold">
                <div className="text-2xl">
                  {audienceScore >= 60 ? "🍿" : "🤮"}
                </div>
                <div>{audienceScore}%</div>
              </dd>
            </div>
          </div>
          <div>
            <dt className="mb-2 text-xs font-bold uppercase text-slate-400">
              Critics Consensus
            </dt>
            <dd>{criticsConsensus}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
