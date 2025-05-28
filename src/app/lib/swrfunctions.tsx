'use client'
import { IEvent } from "database/eventSchema";
import { IGroup } from "database/groupSchema";
import { IUser } from "database/userSchema";
import { ILog } from "database/logSchema";
import useSWR, { MutatorCallback } from "swr";


export interface SWRResponse<Data, Error> {
  data?: Data;
  error?: Error;
  revalidate: () => Promise<boolean>;
  mutate: (
    data?: Data | Promise<Data> | MutatorCallback<Data>,
    shouldRevalidate?: boolean
  ) => Promise<Data | undefined>;
  isLoading: boolean;
}

export function useEventsAscending() {
  // revalidates every 10 minutes
  const { data, error, isLoading, mutate } = useSWR<IEvent[]>(
    "/api/events?sort=asc"
  );

  return {
    events: data,
    isLoading: isLoading,
    isError: error,
    mutate,
  };
}

export function useGroups() {
  // revalidates every 10 minutes
  const { data, error, isLoading, mutate } = useSWR<IGroup[]>("/api/groups");

  return {
    groups: data,
    isLoading: isLoading,
    isError: error,
    mutateGroups: mutate,
  };
}

export function useUsers() {
  // revalidates every 10 minutes
  const { data, error, isLoading, mutate } = useSWR<IUser[]>("/api/user");

  return {
    users: data,
    isLoading: isLoading,
    isError: error,
    mutate,
  };
}

export function useEventId(id: string) {
  // revalidates every 10 minutes
  const { data, error, isLoading, isValidating, mutate } = useSWR<IEvent>(
    `/api/events/${id}`
  );

  const transformedData = data
    ? {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      }
    : null;
  return {
    eventData: transformedData,
    isLoading: isValidating,
    isError: error,
    mutate,
  };
}

export function useLogs() {
  // revalidates every 10 minutes
  const { data, error, isLoading, mutate } = useSWR<ILog[]>("/api/logs");

  return {
    logs: data,
    isLoading: isLoading,
    isError: error,
    mutateLogs: mutate,
  };
}

export function useEventTypes() {
  const { data, error, isLoading } = useSWR<string[]>(
    "/api/events/bytype/eventType",
    async (url: string) => {
      const response = await fetch(url);
      const data: string[] = await response.json();
      return Array.from(
        new Set([...data, "Volunteer", "Beaver Walk", "Pond Clean Up"])
      );
    }
  );

  return {
    eventTypes: data || [],
    isLoading,
    isError: error,
  };
}
