// src/app/components/EventExpandedView.tsx
import React, { useContext } from 'react';
import { Button } from '@styles/Button';

interface EventExpandedViewProps {
    eventDetails: {
        name: string;
        date: string;
        time: string;
        location: string;
        description: string;
    }
}

const EventExpandedView: React.FC<EventExpandedViewProps> = ({eventDetails}) => {
  //const { isAdmin } = useContext(AuthContext); // Update based on your actual auth context

  return (
    <div>
      <h2>{eventDetails.name}</h2>
      <p>{eventDetails.description}</p>
      <Button>Sign Up</Button>

      {/* Conditional Edit/Delete Buttons */}
      {true && ( // isAdmin
        <>
          <Button>Edit</Button>
          <Button>Delete</Button>
        </>
      )}
    </div>
  );
};

export default EventExpandedView;