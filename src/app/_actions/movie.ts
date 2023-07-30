import { daysToSeconds, formatSearchQuery } from "@/lib/utils";
import { DiscoverMovieAdvancedFilters } from "@/types";

// FIXME: If action fails then the page will not render
// TODO: Add error handling

export async function searchMoviesAction({ term }: { term: string }) {
    const sanitizedQuery = formatSearchQuery(term, false);
    const searchTerms = sanitizedQuery.trim().split(' ');

    let aggregatedResults = []
    let aggregatedPages = 0
    let aggregatedTotalResults = 0

    try {
        const apiRequests = searchTerms.map(async (term) => {
            const params = new URLSearchParams({
                api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
                query: term,
                language: "en-US",
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/search/movie?${params.toString()}`);
            const data = await res.json();
            return data
        });

        const results = await Promise.all(apiRequests)

        aggregatedResults = results.map((result) => result.results).flat()
        aggregatedPages = results.map((result) => result.total_pages).reduce((a, b) => a + b)
        aggregatedTotalResults = results.map((result) => result.total_results).reduce((a, b) => a + b)
    }
    catch (error) {
        return console.log(error)
    }

    return {
        term,
        sanitizedQuery,
        searchTerms,
        data: {
            pages: aggregatedPages,
            total_results: aggregatedTotalResults,
            results: aggregatedResults,
        }
    }
};

export async function getSimilarMovieAction({ id }: { id: string | number }) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/movie/${id}/similar?${params.toString()}`, { next: { revalidate: daysToSeconds(1) } });
    const data = await res.json();
    return data
}

export async function getDiscoverMovieAction() {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/discover/movie?${params.toString()}`, { next: { revalidate: daysToSeconds(1) } });
    const data = await res.json();
    return data
}

export async function getTrendingMoviesAction(genres?: string | number[]) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/trending/movie/day?${params.toString()}`, { next: { revalidate: daysToSeconds(1) } });
    const data = await res.json();
    return data
};

export async function getLatestMoviesAction({ filter }: { filter: DiscoverMovieAdvancedFilters }) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
        ...filter as string[][]
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/discover/movie?${params.toString()}`, { next: { revalidate: daysToSeconds(1) } });
    const data = await res.json();
    return data
};

export async function getMovieDetailsAction({ id }: { id: string | number }) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/movie/${id}?${params.toString()}`, { next: { revalidate: daysToSeconds(10) } });
    const data = await res.json();
    return data
};

export async function getMovieCreditsAction({ id }: { id: string | number }) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/movie/${id}/credits?${params.toString()}`, { next: { revalidate: daysToSeconds(10) } });
    const data = await res.json();
    return data;
};

export async function getMovieVideosAction({ id }: { id: string | number }) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/movie/${id}/videos?${params.toString()}`, { next: { revalidate: daysToSeconds(10) } });
    const data = await res.json();
    return data;
};

export async function getMovieRecommendationsAction({ id }: { id: string | number }) {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/movie/${id}/recommendations?${params.toString()}`, { next: { revalidate: daysToSeconds(10) } });
    const data = await res.json();
    return data;
};

export async function getComingSoonMoviesAction() {
    const params = new URLSearchParams({
        api_key: process.env.THE_MOVIE_DATABASE_API_KEY,
        language: "en-US",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_THE_MOVIE_DATABASE_API_URL}/movie/upcoming?${params.toString()}`, { next: { revalidate: daysToSeconds(1) } });
    const data = await res.json();
    return data;
};

export async function toggleFavoriteMovieAction({ id }: { id: number }) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'movie_id': id }),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/movies/favorites`, options);
    const data = await res.json();
    return data;
}