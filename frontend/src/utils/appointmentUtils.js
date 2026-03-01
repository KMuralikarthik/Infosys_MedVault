export const generateTimeSlots = (start, end, duration) => {
    const slots = [];
    let current = new Date(`2024-01-01T${convertTo24Hour(start)}`);
    const endTime = new Date(`2024-01-01T${convertTo24Hour(end)}`);

    while (current < endTime) {
        const timeString = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        slots.push(timeString);
        current = new Date(current.getTime() + duration * 60000);
    }

    return slots;
};

const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
};

export const isSlotAvailable = (doctorId, date, time, appointments) => {
    return !appointments.find(app =>
        app.doctorId === doctorId &&
        app.date === date &&
        app.timeSlot === time &&
        app.status !== 'Rejected' &&
        app.status !== 'Cancelled'
    );
};
