import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
];

export default function SchedulePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { hairstyle, salon } = state || {};

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!hairstyle || !salon) {
    navigate('/hairstyles');
    return null;
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) { setError('Please select a date and time.'); return; }
    setError(''); setLoading(true);
    try {
      await api.createAppointment({
        salon: salon.id,
        hairstyle: hairstyle.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime + ':00',
        notes,
      });
      setSuccess(true);
    } catch (err) {
      setError(Object.values(err).flat()[0] || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={s.successPage}>
        <div style={s.successCard}>
          <div style={s.successIcon}>🎉</div>
          <h2 style={s.successTitle}>Booking Confirmed!</h2>
          <p style={s.successMsg}>Your appointment has been successfully booked.</p>
          <div style={s.bookingDetails}>
            <Detail label="Style" value={hairstyle.name} />
            <Detail label="Salon" value={salon.name} />
            <Detail label="Date" value={new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
            <Detail label="Time" value={selectedTime} />
            <Detail label="Price" value={`$${parseFloat(hairstyle.price).toFixed(0)}`} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('/appointments')} style={s.successBtn}>View My Bookings</button>
            <button onClick={() => navigate('/hairstyles')} style={{ ...s.successBtn, background: 'rgba(44,24,16,0.08)', color: 'var(--espresso)', boxShadow: 'none' }}>Book Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <h1 style={s.title}>Fix Your Schedule</h1>
      <p style={s.subtitle}>Choose your preferred date and time</p>

      {/* Summary */}
      <div style={s.summary}>
        <SummaryItem img={hairstyle.image_url} label="Hairstyle" name={hairstyle.name} sub={`${hairstyle.duration_minutes} min · $${parseFloat(hairstyle.price).toFixed(0)}`} />
        <div style={s.summaryArrow}>→</div>
        <SummaryItem img={salon.image_url} label="Salon" name={salon.name} sub={`${salon.address}, ${salon.city}`} />
      </div>

      <div style={s.grid}>
        {/* Date Picker */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>📅 Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            min={today}
            max={maxDate.toISOString().split('T')[0]}
            onChange={e => setSelectedDate(e.target.value)}
            style={s.dateInput}
          />
          {selectedDate && (
            <div style={s.selectedDateTag}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          )}
        </div>

        {/* Time Slots */}
        <div style={s.section}>
          <h3 style={s.sectionTitle}>🕐 Select Time</h3>
          <div style={s.timeGrid}>
            {TIME_SLOTS.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                style={{
                  ...s.timeSlot,
                  ...(selectedTime === t ? s.timeSlotActive : {}),
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={s.section}>
        <h3 style={s.sectionTitle}>📝 Special Requests (optional)</h3>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any special requests or notes for your stylist..."
          rows={3}
          style={s.textarea}
        />
      </div>

      {error && <div style={s.error}>{error}</div>}

      {/* Booking Summary */}
      <div style={s.bookBar}>
        <div style={s.bookInfo}>
          <div style={s.bookDate}>{selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'} {selectedTime && `at ${selectedTime}`}</div>
          <div style={s.bookTotal}>Total: <strong>${parseFloat(hairstyle.price).toFixed(0)}</strong></div>
        </div>
        <button
          onClick={handleBook}
          disabled={loading || !selectedDate || !selectedTime}
          style={{
            ...s.bookBtn,
            opacity: (!selectedDate || !selectedTime) ? 0.5 : 1,
          }}
        >
          {loading ? 'Booking...' : '✓ Confirm Appointment'}
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ img, label, name, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src={img} alt={name} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} onError={e => e.target.src = 'https://images.unsplash.com/photo-1560066984-138daaa0e2c5?w=100'} />
      <div>
        <div style={{ fontSize: 11, color: 'var(--rose)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: 'var(--espresso)' }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--mocha)' }}>{sub}</div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(201, 168, 140, 0.2)' }}>
      <span style={{ fontSize: 14, color: 'var(--mocha)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--espresso)' }}>{value}</span>
    </div>
  );
}

const s = {
  page: { maxWidth: 800, margin: '0 auto', padding: '40px 40px 100px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 36, color: 'var(--espresso)', marginBottom: 6 },
  subtitle: { fontSize: 15, color: 'var(--mocha)', marginBottom: 32 },
  summary: {
    display: 'flex', alignItems: 'center', gap: 24,
    background: 'rgba(255,255,255,0.7)', borderRadius: 16, padding: '20px 24px',
    border: '1px solid rgba(201, 168, 140, 0.2)', marginBottom: 36,
    boxShadow: '0 4px 16px var(--shadow)',
  },
  summaryArrow: { fontSize: 24, color: 'var(--sand)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: 'var(--espresso)', marginBottom: 14 },
  dateInput: {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    fontSize: 15, color: 'var(--espresso)', outline: 'none',
    background: '#fff',
  },
  selectedDateTag: {
    marginTop: 10,
    background: 'rgba(242, 203, 191, 0.3)',
    color: 'var(--rose-dark)',
    padding: '8px 14px', borderRadius: 8,
    fontSize: 14, fontWeight: 500,
  },
  timeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
  },
  timeSlot: {
    padding: '9px 6px', borderRadius: 8,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    background: 'none', color: 'var(--mocha)',
    fontSize: 13, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  timeSlotActive: {
    background: 'var(--rose)', color: '#fff', borderColor: 'var(--rose)',
  },
  textarea: {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: '1.5px solid rgba(201, 168, 140, 0.4)',
    fontSize: 14, color: 'var(--espresso)', outline: 'none',
    resize: 'vertical', background: '#fff',
  },
  error: {
    background: 'rgba(201, 125, 110, 0.1)', border: '1px solid rgba(201, 125, 110, 0.3)',
    color: 'var(--rose-dark)', padding: '12px 16px', borderRadius: 10, fontSize: 14, marginBottom: 20,
  },
  bookBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'rgba(250, 247, 242, 0.97)', backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(201, 168, 140, 0.2)',
    padding: '16px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 24,
    boxShadow: '0 -4px 20px var(--shadow)',
  },
  bookInfo: { textAlign: 'right' },
  bookDate: { fontSize: 14, color: 'var(--mocha)' },
  bookTotal: { fontSize: 16, color: 'var(--espresso)' },
  bookBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201, 125, 110, 0.3)',
  },
  successPage: {
    minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 40,
  },
  successCard: {
    background: '#fff', borderRadius: 24, padding: '48px 40px',
    maxWidth: 480, width: '100%', textAlign: 'center',
    boxShadow: '0 20px 60px var(--shadow-lg)',
    animation: 'fadeUp 0.5s ease',
  },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontFamily: "'Playfair Display', serif", fontSize: 30, color: 'var(--espresso)', marginBottom: 8 },
  successMsg: { fontSize: 15, color: 'var(--mocha)', marginBottom: 28 },
  bookingDetails: { marginBottom: 28, textAlign: 'left' },
  successBtn: {
    padding: '13px 24px',
    background: 'linear-gradient(135deg, var(--rose), var(--rose-dark))',
    color: '#fff', border: 'none', borderRadius: 12,
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(201, 125, 110, 0.3)',
  },
};
