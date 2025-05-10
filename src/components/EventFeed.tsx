import React, { useState, useEffect } from 'react';
import { useGameStore } from '../state/gameStore';

type EventType = 'info' | 'warning' | 'alert' | 'success';

interface Event {
  id: number;
  type: EventType;
  message: string;
  timestamp: Date;
}

const EventFeed: React.FC = () => {
  const { player, currentCity } = useGameStore();
  const [events, setEvents] = useState<Event[]>([]);

  // Generate messages based on game state changes
  useEffect(() => {
    const initialEvents: Event[] = [
      {
        id: 1,
        type: 'info',
        message: 'System initialized. Welcome to SilkRoad terminal v1.0.3',
        timestamp: new Date(Date.now() - 5000)
      },
      {
        id: 2,
        type: 'info',
        message: `User ${player.name || 'Anonymous'} authenticated.`,
        timestamp: new Date(Date.now() - 4000)
      },
      {
        id: 3,
        type: 'warning',
        message: `Current debt: $${player.debt.toLocaleString()}. Interest accruing at 10% weekly.`,
        timestamp: new Date(Date.now() - 3000)
      },
      {
        id: 4,
        type: 'info',
        message: `Connected to ${currentCity.name} market. ${currentCity.risk > 0.3 ? 'CAUTION: High police activity detected.' : 'Standard security level.'}`,
        timestamp: new Date(Date.now() - 2000)
      }
    ];

    setEvents(initialEvents);
  }, [player.name, player.debt, currentCity]);

  // Function to add new events when game actions happen
  const addEvent = (message: string, type: EventType = 'info') => {
    const newEvent: Event = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date()
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, 20)); // Keep only the latest 20 events
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Render different event types with different styling
  const renderEvent = (event: Event) => {
    let eventClass = "text-text-secondary";
    
    switch(event.type) {
      case 'warning':
        eventClass = "text-accent-amber";
        break;
      case 'alert':
        eventClass = "text-accent-red";
        break;
      case 'success':
        eventClass = "text-accent-green";
        break;
      default:
        eventClass = "text-text-primary";
    }
    
    return (
      <div key={event.id} className="py-1 border-b border-border-DEFAULT last:border-0">
        <span className="text-accent-blue font-mono mr-2">[{formatTime(event.timestamp)}]</span>
        <span className={eventClass}>{event.message}</span>
      </div>
    );
  };

  return (
    <div className="panel h-64 overflow-y-auto">
      <div className="panel-header">
        <h2 className="panel-title">Terminal</h2>
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-accent-red"></div>
          <div className="h-2 w-2 rounded-full bg-accent-amber"></div>
          <div className="h-2 w-2 rounded-full bg-accent-green"></div>
        </div>
      </div>
      <div className="text-sm font-mono">
        {events.map(renderEvent)}
      </div>
    </div>
  );
};

export default EventFeed; 