import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Feedback from '../components/Feedback';
import { payBooking, fetchBooking } from '../services/http';
import { Booking } from '../types';
import { getErrorMessage } from '../utils/validation';

function BookingDetailPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchBooking(id).then(setBooking).catch((requestError) => setError(getErrorMessage(requestError)));
  }, [id]);

  async function handlePay() {
    if (!booking) return;
    try {
      const updated = await payBooking(booking.id);
      setBooking(updated);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  if (!booking) return <main className="marketing-shell"><div className="center-card">Carregando agendamento...</div></main>;

  return (
    <main className="marketing-shell">
      <section className="hero-card compact">
        <p className="eyebrow">Agendamento #{booking.id}</p>
        <h2>{booking.aula?.materia}</h2>
        <p className="muted">Professor: {booking.aula?.professor?.name}</p>
        <p className="muted">Aluno: {booking.aluno?.name}</p>
        <p className="muted">Data: {new Date(booking.data).toLocaleString('pt-BR')}</p>
        <p><strong>Status do pagamento:</strong> {booking.paymentStatus}</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={handlePay} disabled={booking.paymentStatus === 'pago'}>Pagamento de teste</button>
          <Link className="secondary-button" to="/agendamentos">Voltar</Link>
        </div>
      </section>
      {error ? <Feedback message={error} /> : null}
    </main>
  );
}

export default BookingDetailPage;
