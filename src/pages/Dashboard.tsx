import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventHover from '../components/EventHover';
import '../styles/Dashboard.styles.css';


interface Event {
    id: string;
    summary: string;
    start: {
        dateTime: string;
        date?: string;
        timeZone?: string;
    };
    end: {
        dateTime: string;
        date?: string;
        timeZone?: string;
    };
}

interface NewEvent {
    summary: string;
    date: string;
    startTime: string;
    endTime: string;
}

interface MousePosition {
    x: number;
    y: number;
}

const Dashboard: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
    const [newEvent, setNewEvent] = useState<NewEvent>({
        summary: '',
        date: '',
        startTime: '',
        endTime: ''
    });
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        // Generate week days starting from Monday
        const generateWeekDays = () => {
            const days: Date[] = [];
            const today = new Date();
            const monday = new Date(today);
            monday.setDate(monday.getDate() - monday.getDay() + 1);

            for (let i = 0; i < 7; i++) {
                const day = new Date(monday);
                day.setDate(monday.getDate() + i);
                days.push(day);
            }
            setWeekDays(days);
        };

        generateWeekDays();
        fetchEvents();
    }, []);

    // Fetch events from the backend
    const fetchEvents = async (): Promise<void> => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
            setEvents(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    // Group events by date
    const getEventsForDate = (date: Date): Event[] => {
        return events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate.toDateString() === date.toDateString();
        });
    };

    // Handle logout
    const handleLogout = (): void => {
        navigate('/');
    };

    const handleCreateEvent = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const startDateTime = new Date(`${newEvent.date}T${newEvent.startTime}:00`);
        const endDateTime = new Date(`${newEvent.date}T${newEvent.endTime}:00`);

        if (endDateTime <= startDateTime) {
            alert('La hora de término debe ser posterior a la hora de inicio');
            return;
        }

        const event = {
            summary: newEvent.summary,
            start: {
                dateTime: startDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: endDateTime.toISOString(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/new-event`, event);
            setShowEventModal(false);
            setNewEvent({ summary: '', date: '', startTime: '', endTime: '' });
            fetchEvents();
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleMouseMove = (event: React.MouseEvent): void => {
        setMousePosition({
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <>
            <div className="dashboard-container" onMouseMove={handleMouseMove}>
                <div className="dashboard-header">
                    <div className="header-left">
                        <h1>Calendario Semanal</h1>
                    </div>
                    <div className="header-right">
                        <button onClick={() => setShowEventModal(true)} className="add-event-button">
                            + New Event
                        </button>
                        <button onClick={handleLogout} className="logout-button">
                            Log Out
                        </button>
                    </div>
                </div>
                <div className="calendar-grid">
                    {weekDays.map((day, index) => (
                        <div key={index} className="day-column">
                            <div className="day-header">
                                <div className="day-name">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                                <div className="day-date">{day.getDate()}</div>
                            </div>
                            <div className="day-events">
                                {getEventsForDate(day).map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-card"
                                        onMouseEnter={() => setHoveredEvent(event)}
                                        onMouseLeave={() => setHoveredEvent(null)}
                                    >
                                        <div className="event-time">
                                            {new Date(event.start.dateTime || event.start.date || '').toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            {' - '}
                                            {new Date(event.end.dateTime || event.end.date || '').toLocaleTimeString('es-ES', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <div className="event-title">{event.summary || 'Sin título'}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {showEventModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Nuevo Evento</h2>
                            <form onSubmit={handleCreateEvent}>
                                <div className="form-group">
                                    <label>Título:</label>
                                    <input
                                        type="text"
                                        value={newEvent.summary}
                                        onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Fecha:</label>
                                    <select
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar fecha</option>
                                        {weekDays.map((day, index) => (
                                            <option key={index} value={day.toISOString().split('T')[0]}>
                                                {day.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Hora inicio:</label>
                                    <input
                                        type="time"
                                        value={newEvent.startTime}
                                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Hora fin:</label>
                                    <input
                                        type="time"
                                        value={newEvent.endTime}
                                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button type="submit" className="save-button">Guardar</button>
                                    <button type="button" onClick={() => setShowEventModal(false)} className="cancel-button">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {hoveredEvent && (
                    <EventHover 
                        event={hoveredEvent} 
                        position={mousePosition} 
                    />
                )}


            </div>
        </>
    );
};

export default Dashboard;
