import React from 'react';
import styles from '@styles/admin/eventPreview.module.css'; // Update the import path as needed
import {IEvent} from '@database/eventSchema'

interface EventPreviewProps {

    event: IEvent;
}

const EventPreviewComponent: React.FC<EventPreviewProps> = ({ event }) => {
  // Helper function to format dates
  const formatDate = (date: Date | string): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <div className={styles.eventCard}>
      <h3>{event.eventName}</h3>
      <p>View Details</p>
      <p>{event.attendeeIds.length}</p>
    </div>
  );
};

export default EventPreviewComponent;



