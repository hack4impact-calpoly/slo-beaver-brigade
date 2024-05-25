'use client'
import { IEvent } from "database/eventSchema";
import useSWR, { Fetcher, MutatorCallback } from "swr";

export interface SWRResponse<Data, Error> {
    data?: Data;
    error?: Error;
    revalidate: () => Promise<boolean>;
    mutate: (data?: Data | Promise<Data> | MutatorCallback<Data>, shouldRevalidate?: boolean) => Promise<Data | undefined>;
    isValidating: boolean;
}

export function useEventsAscending() {
    // revalidates every 10 minutes
    const { data, error, isValidating, mutate } = useSWR<IEvent[]>('/api/events?sort=asc');

    return {
        events: data,
        isLoading: isValidating,
        isError: error,
        mutate
    }
}
