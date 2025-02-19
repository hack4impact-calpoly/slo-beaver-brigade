"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  HStack,
  Image,
  Text,
  Flex,
  Stack,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import MiniCalendar from "../../../components/calendar/MiniCalendar";
import GoogleCalendarPicker from "../../../components/calendar/GoogleCalendarPicker";
import { formatISO, parse } from "date-fns";
import { useRouter } from "next/navigation";
import { uploadFileS3Bucket } from "app/lib/clientActions";
import { Select, CreatableSelect } from "chakra-react-select";
import MDEditor from "@uiw/react-md-editor";
import style from "@styles/calendar/calendar.module.css";
import ImageSelector from "app/components/ImageSelector";
import { useEventsAscending, useGroups } from "app/lib/swrfunctions";
import { CreateTemporaryGroup } from "app/components/ViewGroups";
import { IGroup } from "database/groupSchema";
import { IEvent } from "database/eventSchema";
import "../../../fonts/fonts.css";

// Define a type for groups to resolve '_id' does not exist on type 'never'
type Group = {
  _id: string;
  group_name: string;
};

export default function Page() {
  const { mutate } = useEventsAscending();
  const toast = useToast();
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventType, setEventType] = useState("");
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  const [groupsSelected, setGroupsSelected] = useState<IGroup[]>([]);
  // Specify type for group to avoid error
  const { groups, isLoading, isError, mutateGroups } = useGroups();
  const setGroups = useCallback((updateFunction: (groups: any[]) => any[]) => {
    mutateGroups((currentGroups) => {
      if (currentGroups) {
        return updateFunction(currentGroups);
      }
      return currentGroups; // Return the same groups if currentGroups is undefined
    }, false);
  }, []);
  const [preselected, setPreselected] = useState<boolean>(false);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("Yes");
  const [description, setDescription] = useState("");
  const [accessibilityAccommodation, setAccessibilityAccommodation] =
    useState("Yes");
  const [checkList, setChecklist] = useState("N/A");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [onlyGroups, setOnlyGroups] = useState<boolean>(false);
  const [sendEmailInvitees, setSendEmailInvitees] = useState<boolean>(false);

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEventName(e.target.value);

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupId = e.target.value;
    const isChekced = e.target.checked;

    setOrganizationIds((prevIds: string[]) => {
      if (isChekced) {
        //add to list
        return [...prevIds, groupId];
      } else {
        //remove from list
        return prevIds.filter((id) => id != groupId);
      }
    });
  };

  //Parse and format start and end time from user input
  const handleTimeChange = (start: string, end: string) => {
    // Format for parsing input times (handle both 12-hour and 24-hour formats)
    if (start && end) {
      const timeFormat =
        start.includes("AM") || start.includes("PM") ? "h:mm a" : "HH:mm";

      // Parse the start and end times as dates on the active date
      const parsedStartTime = parse(
        `${start}`,
        timeFormat,
        new Date(`${activeDate}T00:00:00`)
      );
      const parsedEndTime = parse(
        `${end}`,
        timeFormat,
        new Date(`${activeDate}T00:00:00`)
      );

      // Format the adjusted dates back into ISO strings
      const formattedStartDateTime = formatISO(parsedStartTime);
      const formattedEndDateTime = formatISO(parsedEndTime);
      // Update the state with the formatted date times
      setEventStart(formattedStartDateTime);
      setEventEnd(formattedEndDateTime);
    }
    if (!start) {
      setEventStart("");
    }
    if (!end) {
      setEventEnd("");
    }
  };
  // Update active date upon change from MiniCalendar
  const handleDateChangeFromCalendar = (newDate: string) => {
    setActiveDate(newDate);
  };

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger file input click for image upload
  const promptFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for the event cover image and set preview
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreselected(false);
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setCoverImage(file);
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  interface RecurringOptions {
    startDate: string;
    endDate: string;
    daysOfWeek: string[];
    frequency: string;
  }

  const [recurringOptions, setRecurringOptions] = useState<RecurringOptions>({
    startDate: "",
    endDate: "",
    daysOfWeek: [], // initialize as empty string array
    frequency: "weekly",
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Throw a Toast when event details are not complete and makes a post request to create event if details are complete
  const handleCreateEvent = async () => {
    debugger;
    // Form validation before submission
    console.log("recurringOptions:", recurringOptions);
    console.log("startDate:", recurringOptions.startDate);
    console.log("endDate:", recurringOptions.endDate);

    if (
      !eventName ||
      !eventType ||
      !accessibilityAccommodation ||
      !location ||
      !description
    ) {
      toast({
        title: "Error",
        description: "Event details are not complete",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    // Validate dates
    if (!recurringOptions.startDate || !recurringOptions.endDate) {
      toast({
        title: "Error",
        description: "Event start and end dates are not set",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    if (recurringOptions.endDate < recurringOptions.startDate) {
      toast({
        title: "Error",
        description: "End date cannot be before start date",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    // Validate weekly recurrence
    if (
      recurringOptions.frequency === "weekly" &&
      recurringOptions.daysOfWeek.length === 0
    ) {
      toast({
        title: "Error",
        description:
          "Please select at least one day for weekly recurring events",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    // Try to upload image
    const file = fileInputRef?.current?.files?.[0] ?? null;
    let imageurl = null;

    if (file || preselected) {
      if (!preselected) {
        imageurl = await uploadFileS3Bucket(file);
        if (!imageurl) {
          console.error("Failed to create the event: image upload.");
          toast({
            title: "Error",
            description: "Failed to create the event",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
          return;
        }
      } else {
        imageurl = imagePreview;
      }
    }

    const eventData = {
      eventName,
      ...(imageurl && { eventImage: imageurl }),
      eventType,
      checklist: checkList,
      location,
      description,
      wheelchairAccessible: accessibilityAccommodation === "Yes",
      spanishSpeakingAccommodation: language === "Yes",
      startTime: recurringOptions.startDate,
      endTime: recurringOptions.endDate,
      volunteerEvent: eventType === "Volunteer",
      groupsAllowed: groupsSelected.map((group) => group._id as string),
      groupsOnly: onlyGroups,
      ...(recurringOptions.frequency && {
        recurring: {
          frequency: recurringOptions.frequency,
          daysOfWeek: recurringOptions.daysOfWeek,
          endDate: recurringOptions.endDate,
        },
      }),
    };

    const createGoogleCalendarEvent = async (eventData: any) => {
      try {
        // Parse the start date and times
        const startDate = new Date(eventData.startTime);
        const [startHours, startMinutes] = eventData.startTime
          .split("T")[1]
          .split(":");
        const [endHours, endMinutes] = eventData.endTime
          .split("T")[1]
          .split(":");

        // For both recurring and non-recurring events, end time should be on the same day as start time
        const eventStartDateTime = new Date(startDate);
        eventStartDateTime.setHours(
          parseInt(startHours),
          parseInt(startMinutes),
          0
        );

        const eventEndDateTime = new Date(startDate); // Use start date for end time
        eventEndDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

        let calendarEventData = {
          summary: eventData.eventName,
          location: eventData.location,
          description: eventData.description,
          start: {
            dateTime: eventStartDateTime.toISOString(),
            timeZone: "America/Los_Angeles",
          },
          end: {
            dateTime: eventEndDateTime.toISOString(),
            timeZone: "America/Los_Angeles",
          },
        } as {
          summary: string;
          location: string;
          description: string;
          start: { dateTime: string; timeZone: string };
          end: { dateTime: string; timeZone: string };
          recurrence?: string[];
        };

        // Add recurrence rule only if it's a recurring event
        if (eventData.recurring && eventData.recurring.frequency) {
          const untilDate = new Date(eventData.recurring.endDate);
          untilDate.setHours(23, 59, 59);
          const untilDateString =
            untilDate.toISOString().replace(/[:-]/g, "").split(".")[0] + "Z";

          let recurrenceRule = `FREQ=${eventData.recurring.frequency.toUpperCase()};UNTIL=${untilDateString}`;

          if (
            eventData.recurring.frequency === "weekly" &&
            eventData.recurring.daysOfWeek.length > 0
          ) {
            const selectedDays = eventData.recurring.daysOfWeek.filter(
              (day) => day
            );
            if (selectedDays.length > 0) {
              recurrenceRule += `;BYDAY=${selectedDays.join(",")}`;
            }
          } else if (eventData.recurring.frequency === "monthly") {
            const dayOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][
              startDate.getDay()
            ];
            const weekOfMonth = Math.ceil(startDate.getDate() / 7);
            recurrenceRule += `;BYDAY=${weekOfMonth}${dayOfWeek}`;
          }

          calendarEventData.recurrence = [`RRULE:${recurrenceRule}`];
        }

        console.log("Sending to Google Calendar:", calendarEventData);

        const response = await fetch("/api/google-calendar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(calendarEventData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Google Calendar API Error:", errorData);
          throw new Error(
            errorData.details || "Failed to create Google Calendar event"
          );
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating Google Calendar event:", error);
        throw error;
      }
    };
    // Attempt to create event via API and handle response
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("HTTP error! status: $(response.status)");
      }

      const event: IEvent = await response.json();

      // Create Google Calendar event
      try {
        await createGoogleCalendarEvent(eventData);
      } catch (calendarError) {
        console.error("Failed to create Google Calendar event:", calendarError);
        // Optionally show a warning toast but continue with the flow
        toast({
          title: "Warning",
          description: "Event created but failed to sync with Google Calendar",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }

      // send confirmation email if button was checked
      if (sendEmailInvitees) {
        const res = await fetch(
          "/api/events/" + event._id + "/groups/confirmation",
          {
            method: "POST",
            body: JSON.stringify({
              groupIds: groupsSelected.flatMap((group) => group._id),
            }),
          }
        );
        if (!res) {
          toast({
            title: "Error",
            description: "Failed to send emails.",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
        }
      }

      mutate();
      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/" + "admin/events");
    } catch (error) {
      console.error("Failed to create the event:", error);
      toast({
        title: "Error",
        description: "Failed to create the event",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCreateNewGroup = async (groupName: string) => {
    const groupData = {
      group_name: groupName,
      groupees: [],
    };

    // Optimistically update UI
    const optimisticNewGroup = {
      _id: Date.now().toString(), // Temporary ID
      group_name: groupName,
    };

    setGroups((currentGroups) => [...currentGroups, optimisticNewGroup]);

    try {
      const response = await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        // Rollback if the creation failed
        setGroups((currentGroups) =>
          currentGroups.filter((group) => group._id !== optimisticNewGroup._id)
        );
        throw new Error("Failed to create group");
      }
      const newGroup = await response.json();
      // Update the temporary group with actual _id from the response
      setGroups((currentGroups) =>
        currentGroups.map((group) =>
          group._id === optimisticNewGroup._id
            ? { ...group, _id: newGroup._id }
            : group
        )
      );
      toast({
        title: "Group Created",
        description: "The new group has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Create Group",
        description: "Failed to Create Group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fetch groups data on component mount
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to fetch groups",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  }, [isError]);

  // Fetching different event types
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/events/bytype/eventType");
        const data: string[] = await response.json();
        const uniqueEventTypes = Array.from(
          new Set([...data, "Volunteer", "Beaver Walk", "Pond Clean Up"])
        );
        setEventTypes(uniqueEventTypes);
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };

    fetchEventTypes();
  }, []);

  return (
    <Box p={8} mx="10">
      <Text fontSize="2xl" fontWeight="bold" color="black" mt={-12} mb={3}>
        Create New Event
      </Text>

      {/* image uploading */}
      <Flex
        flexDir={{ base: "column", md: "row" }}
        flex="1"
        gap={{ base: "10px", md: "50px" }}
      >
        <FormControl mb="4" onClick={promptFileInput} cursor="pointer">
          <Input
            id="cover-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            hidden // Hide the actual input
          />
          <Box
            position="relative"
            borderWidth="1px"
            p="4"
            mt="4"
            textAlign="center"
            h="64"
            borderRadius="20px"
            overflow="hidden"
            width="100%"
            bg="gray.200"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            {!imagePreview ? (
              <>
                <Text>Upload Image</Text>
                <IconButton
                  aria-label="Upload image"
                  icon={<AddIcon />}
                  mt="2"
                />
              </>
            ) : (
              <Image
                src={imagePreview}
                alt="Event cover preview"
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                objectFit="cover"
                zIndex={0}
              />
            )}
          </Box>
        </FormControl>
        <ImageSelector
          setPreselected={setPreselected}
          setImageURL={setImagePreview}
        ></ImageSelector>
      </Flex>

      <Flex direction={{ base: "column", md: "row" }} gap={20} mb={6}>
        <VStack spacing={4} align="stretch" flex="1">
          <FormControl isRequired>
            <FormLabel htmlFor="event-name" fontWeight="bold">
              Event Name
            </FormLabel>
            <Input
              id="event-name"
              placeholder="Enter event name"
              onChange={handleEventNameChange}
            />
          </FormControl>

          <HStack justifyContent="space-between">
            <FormControl width="48%">
              <FormLabel htmlFor="event-type" fontWeight="bold">
                Event Type
              </FormLabel>
              <CreatableSelect
                id="event-type"
                placeholder="Select or create event type"
                options={eventTypes.map((type) => ({
                  value: type,
                  label: type,
                }))}
                onChange={(option) => {
                  setEventType(option ? option.value : "");
                }}
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    textAlign: "left",
                  }),
                }}
                isClearable
                isSearchable
              />
            </FormControl>

            <FormControl width="48%">
              <FormLabel htmlFor="organization" fontWeight="bold">
                Groups
              </FormLabel>
              <CreatableSelect
                id="organization"
                placeholder="Select or create organization"
                options={groups?.map((group) => ({
                  value: group,
                  label: group.group_name,
                }))}
                value={groupsSelected.map((group) => ({
                  value: group,
                  label: group.group_name,
                }))}
                onChange={(selectedOptions) =>
                  setGroupsSelected(
                    selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : []
                  )
                }
                onCreateOption={handleCreateNewGroup}
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    textAlign: "left",
                  }),
                }}
                isMulti
                isClearable
                isSearchable
              />
            </FormControl>
          </HStack>

          <FormControl isRequired>
            <FormLabel htmlFor="location" fontWeight="bold">
              Location
            </FormLabel>
            <Input
              id="location"
              placeholder="Enter event location"
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="spanishAccommodation" fontWeight="bold">
              Spanish Speaking Accommodation
            </FormLabel>
            <Select
              id="accommodation-type"
              placeholder="Yes"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              defaultInputValue="Yes"
              onChange={(option) => setLanguage(option ? option.value : " ")}
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            ></Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="accessibility" fontWeight="bold">
              Accessibility Accommodation
            </FormLabel>
            <Select
              id="accessibility"
              placeholder="Yes"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              defaultInputValue="Yes"
              onChange={(option) =>
                setAccessibilityAccommodation(option ? option.value : " ")
              }
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="invitees" fontWeight="bold">
              Only Available to Selected Groups
            </FormLabel>
            <Select
              id="invitees"
              placeholder="No"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              defaultInputValue="No"
              onChange={(option) =>
                setOnlyGroups(option ? option.value == "Yes" : false)
              }
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            />
          </FormControl>
          {onlyGroups && groups && (
            <div className="flex sm:flex-row flex-col-reverse gap-5 sm:gap-10 sm:items-center ">
              <CreateTemporaryGroup
                groups={groupsSelected}
                mutate={mutateGroups}
                setGroups={setGroupsSelected}
              />
              <div className="flex flex-row gap-4 justify-center">
                {" "}
                Notify Group Individuals:{" "}
                <Checkbox
                  checked={sendEmailInvitees}
                  onChange={() => setSendEmailInvitees((checked) => !checked)}
                ></Checkbox>
              </div>
            </div>
          )}

          <FormControl isRequired>
            <FormLabel htmlFor="description" fontWeight="bold">
              Description
            </FormLabel>
            <MDEditor
              className={style.preview}
              value={description}
              onChange={(e) => setDescription(e || "")}
              data-color-mode="light"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="required-items" fontWeight="bold">
              Checklist
            </FormLabel>
            <MDEditor
              className={style.preview}
              value={checkList}
              onChange={(e) => setChecklist(e || "")}
              data-color-mode="light"
            />
          </FormControl>
        </VStack>
        <Flex flex="1">
          <VStack alignItems="flex-start">

            {/* MiniCalendar */}
            {/* <FormControl ml="-4" isRequired>
              <MiniCalendar
                onTimeChange={(start, end) => handleTimeChange(start, end)}
                onDateChange={(date) => handleDateChangeFromCalendar(date)}
              />
            </FormControl> */}

            <Flex flex="1">
              <VStack alignItems="flex-start" spacing={4}>
                <Text fontWeight="bold">Date/Time</Text>
                <FormControl isRequired>
                  <GoogleCalendarPicker
                    onDateTimeSelect={(start, end) => {
                      setEventStart(start);
                      setEventEnd(end);
                    }}
                    onRecurringOptionsChange={(options: RecurringOptions) => {
                      setRecurringOptions(options);
                    }}
                  />
                </FormControl>
              </VStack>
            </Flex>
          </VStack>
        </Flex>
      </Flex>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          loadingText="Creating"
          bg="#e0af48"
          color="black"
          _hover={{ bg: "#C19137" }}
          onClick={handleCreateEvent}
          minWidth="150px"
          width="20%"
        >
          Create Event
        </Button>
      </Box>
    </Box>
  );
}
