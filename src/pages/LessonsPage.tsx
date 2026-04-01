import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Feedback from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import usePagination from '../hooks/usePagination';
import { deleteLesson, fetchLessons } from '../services/http';
import { Lesson } from '../types';
import { getErrorMessage } from '../utils/validation';

function LessonsPage() {
  const { page, pageSize, setPage } = usePagination();
  const [items, setItems] = useState<Lesson[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons({ page, pageSize })
      .then((response) => {
        setItems(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((requestError) => setError(getErrorMessage(requestError)));
  }, [page, pageSize]);

  async function handleDelete(id: number) {
    await deleteLesson(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="marketing-shell">
      <PageHeader title="Minhas aulas" description="Gerencie as aulas que você publicou para receber novos agendamentos." actionLabel="Publicar aula" actionTo="/criar-aula" />
      {error ? <Feedback message={error} /> : null}
      <DataTable<Lesson>
        items={items}
        editBasePath="/minhas-aulas"
        onDelete={handleDelete}
        columns={[
          { key: 'materia', label: 'Matéria', render: (item) => item.materia },
          { key: 'valor', label: 'Valor', render: (item) => `R$ ${item.valor}` },
          { key: 'professor', label: 'Professor', render: (item) => item.professor?.name ?? '-' },
        ]}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
}

export default LessonsPage;
