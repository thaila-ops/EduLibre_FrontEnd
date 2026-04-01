import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Feedback from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { createBooking, fetchLessons } from '../services/http';
import { Lesson } from '../types';
import { getErrorMessage } from '../utils/validation';

function BookingFormPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [form, setForm] = useState({ alunoId: user ? String(user.id) : '0', aulaId: lessonId ?? '0', data: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons({ page: 1, pageSize: 50 }).then((response) => setLessons(response.data));
    if (user) {
      setForm((current) => ({ ...current, alunoId: String(user.id) }));
    }
  }, [user]);

  function setField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createBooking({
        alunoId: Number(form.alunoId),
        aulaId: Number(form.aulaId),
        data: new Date(form.data).toISOString(),
      });
      navigate('/agendamentos');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  }

  return (
    <main className="marketing-shell">
      <PageHeader title="Agendar aula" description="Escolha a aula e defina a data do seu agendamento." />
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Aluno</span>
            <input value={user?.name ?? ''} disabled />
          </label>
          <label className="field">
            <span>Aula</span>
            <select value={form.aulaId} onChange={(event) => setField('aulaId', event.target.value)}>
              <option value="0">Selecione</option>
              {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.materia}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Data e hora</span>
            <input type="datetime-local" value={form.data} onChange={(event) => setField('data', event.target.value)} />
          </label>
        </div>
        {error ? <Feedback message={error} /> : null}
        <button className="primary-button" type="submit">Confirmar agendamento</button>
      </form>
    </main>
  );
}

export default BookingFormPage;
