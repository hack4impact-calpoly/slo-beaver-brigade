'use client'
import { IEvent } from "database/eventSchema";
import { IGroup } from "database/groupSchema";
import { IUser } from "database/userSchema";
import useSWR, { Fetcher, MutatorCallback } from "swr";


const groupIdsFetcher = (urls: string[]) => Promise.all(urls.map(url => fetch(url).then(res => res.json())));
export interface SWRResponse<Data, Error> {
    data?: Data;
    error?: Error;
    revalidate: () => Promise<boolean>;
    mutate: (data?: Data | Promise<Data> | MutatorCallback<Data>, shouldRevalidate?: boolean) => Promise<Data | undefined>;
    isLoading: boolean;
}

export function useEventsAscending() {
    // revalidates every 10 minutes
    const { data, error, isLoading, mutate } = useSWR<IEvent[]>('/api/events?sort=asc');

    return {
        events: data,
        isLoading: isLoading,
        isError: error,
        mutate
    }
}

export function useGroups() {
    // revalidates every 10 minutes
    const { data, error, isLoading, mutate } = useSWR<IGroup[]>('/api/group');

    return {
        groups: data,
        isLoading: isLoading,
        isError: error,
        mutateGroups: mutate
    }
}
export function useUsers() {
    // revalidates every 10 minutes
    const { data, error, isLoading, mutate } = useSWR< IUser[]>('/api/user');

    return {
        users: data,
        isLoading: isLoading,
        isError: error,
         mutate
    }
}


export function useEventId(id: string){
  // revalidates every 10 minutes
    const { data, error, isLoading, mutate } = useSWR<IEvent>(`/api/events/${id}`);


    const transformedData = data
    ? {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      }
    : null;
    return {
        eventData: transformedData,
        isLoading: isLoading,
        isError: error,
        mutate
    }
}

