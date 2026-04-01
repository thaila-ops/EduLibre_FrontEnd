import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Feedback from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';
import { deleteBooking, fetchBookings } from '../services/http';
import { Booking } from '../types';
import { getErrorMessage } from '../utils/validation';

function BookingsPage() {
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Booking[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings({ page, pageSize })
      .then((response) => {
        setItems(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [page, pageSize]);

  async function handleDelete(id: number) {
    await deleteBooking(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="marketing-shell">
      <PageHeader title="Meus agendamentos" description="Veja as aulas marcadas, o professor responsável e as datas já combinadas." actionLabel="Agendar aula" actionTo="/professores" />
      {error ? <Feedback message={error} /> : null}
      <DataTable<Booking>
        items={items}
        editBasePath="/agendamentos"
        onDelete={handleDelete}
        columns={[
          { key: 'aluno', label: 'Aluno', render: (item) => item.aluno?.name ?? '-' },
          { key: 'aula', label: 'Aula', render: (item) => item.aula?.materia ?? '-' },
          { key: 'data', label: 'Data', render: (item) => new Date(item.data).toLocaleString('pt-BR') },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}

export default BookingsPage;
