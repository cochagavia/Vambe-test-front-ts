import React from 'react';
import ReactDOM from 'react-dom';

interface EventType {
    start: {
        dateTime: string;
    };
    end: {
        dateTime: string;
    };
    summary: string;
}

interface Position {
    x: number;
    y: number;
}

interface EventHoverProps {
    event: EventType;
    position: Position;
}

const EventHover: React.FC<EventHoverProps> = ({ event, position }) => {
    return ReactDOM.createPortal(
        <div 
            style={{
                position: 'fixed',
                left: `${position.x + 20}px`,
                top: `${position.y}px`,
                transform: 'translateY(-50%)',
                backgroundColor: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: '8px',
                minWidth: '250px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid #e0e0e0',
                zIndex: 999999,
                pointerEvents: 'none'
            }}
        >
            <div>
                <div>
                    <strong>Hora:</strong> {new Date(event.start.dateTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })} - {new Date(event.end.dateTime).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <div>
                    <strong>Evento:</strong> {event.summary}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EventHover; 