import React, { useState, useEffect } from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

// Event types
type EventType = 'info' | 'warning' | 'success' | 'error' | 'market' | 'police' | 'dealer';

interface GameEvent {
  id: string;
  message: string;
  timestamp: Date;
  type: EventType;
  read: boolean;
}

const MARKET_RUMORS = [
  "Word on the street is prices for Acid will skyrocket next week",
  "Heard some cartel shipment got seized, Cocaine might get scarce",
  "Police crackdown in Brooklyn, be careful moving product",
  "New synthetic hitting the streets, might cut into Speed sales",
  "Big pharma shortage making Ludes more valuable uptown",
  "Weed legalization talks making dealers nervous in certain areas"
];

const POLICE_EVENTS = [
  "Police raid reported in Staten Island, careful transporting there",
  "Undercover operation busted several dealers in Manhattan",
  "Increased patrols near Central Park, watch yourself there",
  "Police scanner indicates checkpoints being set up in the Bronx",
  "Heard NYPD narcotics division got a new captain, expect more heat"
];

const DEALER_EVENTS = [
  "New supplier offering premium Heroin at discount rates",
  "Dealer turf war in Queens affecting local prices",
  "High-end clients looking for clean Cocaine in Manhattan",
  "College kids causing spike in Acid demand near campuses",
  "Street gangs pushing cheap Speed in the outer boroughs"
];

const EventFeed: React.FC = () => {
  const { player, drugMarket, currentCity } = useGameStore();
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [filter, setFilter] = useState<EventType | 'all'>('all');
  
  useEffect(() => {
    // Add a base welcome event
    if (events.length === 0) {
      addEvent('info', `Welcome to Silkroad, ${player.name}. You have 30 days to build your empire.`);
      addEvent('warning', `You have $${player.debt.toLocaleString()} debt to repay. Interest accrues daily.`);
    }
    
    // Generate events based on game state changes
    const generateRandomEvent = () => {
      // 20% chance to generate an event
      if (Math.random() < 0.2) {
        // Choose a random event type
        const eventTypes: EventType[] = ['market', 'police', 'dealer'];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        let message = '';
        switch (randomType) {
          case 'market':
            message = MARKET_RUMORS[Math.floor(Math.random() * MARKET_RUMORS.length)];
            break;
          case 'police':
            message = POLICE_EVENTS[Math.floor(Math.random() * POLICE_EVENTS.length)];
            break;
          case 'dealer':
            message = DEALER_EVENTS[Math.floor(Math.random() * DEALER_EVENTS.length)];
            break;
        }
        
        addEvent(randomType, message);
      }
    };
    
    // Set interval to generate random events
    const eventInterval = setInterval(generateRandomEvent, 25000);
    
    // Check current drug market conditions for notable events
    const checkMarketConditions = () => {
      if (!drugMarket || Object.keys(drugMarket).length === 0) return;
      
      Object.entries(drugMarket).forEach(([drug, data]) => {
        const drugName = drug as Drug;
        const avg = (data.min + data.max) / 2;
        
        // Check for extreme prices
        if (data.price < data.min * 0.6) {
          // Exceptionally low price
          addEvent('market', `ALERT: ${drugName} prices at record lows in ${currentCity.name}! Buy now!`);
        } else if (data.price > data.max * 0.9) {
          // Exceptionally high price
          addEvent('market', `ALERT: ${drugName} prices extremely high in ${currentCity.name}. Good time to sell.`);
        }
      });
    };
    
    // Check market on initial load
    checkMarketConditions();
    
    return () => clearInterval(eventInterval);
  }, [player.name, player.debt, drugMarket, currentCity]);
  
  const addEvent = (type: EventType, message: string) => {
    const newEvent: GameEvent = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      timestamp: new Date(),
      type,
      read: false
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, 50)); // Limit to 50 events
  };
  
  const markAsRead = (id: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, read: true } : event
      )
    );
  };
  
  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);
  
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'info': return <span className="text-blue-400">ℹ️</span>;
      case 'warning': return <span className="text-yellow-400">⚠️</span>;
      case 'success': return <span className="text-green-400">✅</span>;
      case 'error': return <span className="text-red-400">❌</span>;
      case 'market': return <span className="text-green-400">📊</span>;
      case 'police': return <span className="text-red-400">🚨</span>;
      case 'dealer': return <span className="text-yellow-400">🤝</span>;
      default: return <span className="text-gray-400">•</span>;
    }
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title text-shadow-glow">NETWORK FEED</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')} 
            className={`text-xs px-2 py-0.5 rounded ${filter === 'all' ? 'bg-blue-400 bg-opacity-20 text-blue-400' : 'text-gray-400'}`}
          >
            ALL
          </button>
          <button 
            onClick={() => setFilter('market')} 
            className={`text-xs px-2 py-0.5 rounded ${filter === 'market' ? 'bg-green-400 bg-opacity-20 text-green-400' : 'text-gray-400'}`}
          >
            MARKET
          </button>
          <button 
            onClick={() => setFilter('police')} 
            className={`text-xs px-2 py-0.5 rounded ${filter === 'police' ? 'bg-red-400 bg-opacity-20 text-red-400' : 'text-gray-400'}`}
          >
            POLICE
          </button>
        </div>
      </div>
      
      <div className="h-64 overflow-y-auto pr-2 terminal-font" style={{ scrollbarWidth: 'thin' }}>
        <div className="space-y-1 font-mono">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              let eventClass = "text-gray-400";
              
              switch (event.type) {
                case 'info':
                  eventClass = "text-blue-400";
                  break;
                case 'warning':
                  eventClass = "text-yellow-400";
                  break;
                case 'success':
                  eventClass = "text-green-400";
                  break;
                case 'error':
                  eventClass = "text-red-400";
                  break;
                case 'market':
                  eventClass = "text-green-400";
                  break;
                case 'police':
                  eventClass = "text-red-400";
                  break;
                case 'dealer':
                  eventClass = "text-yellow-400";
                  break;
                default:
                  eventClass = "text-gray-100";
              }
              
              return (
                <div 
                  key={event.id} 
                  className={`py-1 border-b border-zinc-700 last:border-0 hover:bg-zinc-800 ${!event.read ? 'animate-pulse' : ''}`}
                  onClick={() => markAsRead(event.id)}
                >
                  <div className="flex items-center">
                    <span className="mr-1">{getEventIcon(event.type)}</span>
                    <span className="text-gray-500 text-xs mr-2">{formatTimestamp(event.timestamp)}</span>
                    <span className={`text-xs ${eventClass} ${!event.read ? 'font-medium' : ''}`}>
                      {event.message}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">No events to display</div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center pt-2 border-t border-zinc-700 mt-2">
        <div className="flex items-center">
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString()} | {events.filter(e => !e.read).length} unread
          </span>
          <div className="w-2 h-2 rounded-full bg-blue-400 ml-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default EventFeed; 