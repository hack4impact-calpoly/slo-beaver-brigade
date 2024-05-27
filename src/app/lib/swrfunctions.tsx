'use client'
import { IEvent } from "database/eventSchema";
import { IGroup } from "database/groupSchema";
import { IUser } from "database/userSchema";
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

export function useGroups() {
    // revalidates every 10 minutes
    const { data, error, isValidating, mutate } = useSWR<IGroup[]>('/api/group');

    return {
        groups: data,
        isLoading: isValidating,
        isError: error,
        mutateGroups: mutate
    }
}
export function useUsers() {
    // revalidates every 10 minutes
    const { data, error, isValidating, mutate } = useSWR< IUser[]>('/api/user');

    return {
        users: data,
        isLoading: isValidating,
        isError: error,
         mutate
    }
}

