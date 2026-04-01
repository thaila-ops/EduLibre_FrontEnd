import { ChangeEvent } from 'react';
import { imageFileToDataUrl } from '../utils/imageUpload';

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
};

async function handleFile(
  event: ChangeEvent<HTMLInputElement>,
  onChange: (value: string) => void,
  onError: (message: string) => void,
) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    onChange(await imageFileToDataUrl(file));
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Não foi possível carregar a imagem.');
  } finally {
    event.target.value = '';
  }
}

function ImageUploadField({ label, name, value, onChange, onError }: Props) {
  return (
    <label className="field field-wide">
      <span>{label}</span>
      <input
        aria-label={label}
        name={name}
        type="file"
        accept="image/*"
        onChange={(event) => {
          void handleFile(event, onChange, onError);
        }}
      />
      <p className="muted upload-help">Selecione uma imagem do computador. Tamanho máximo: 2 MB.</p>
      <div className="image-upload-preview">
        {value ? <img src={value} alt={label} className="image-upload-thumb" /> : <div className="image-upload-empty">Nenhuma imagem selecionada.</div>}
      </div>
      {value ? (
        <button className="secondary-button image-upload-clear" type="button" onClick={() => onChange('')}>
          Remover imagem
        </button>
      ) : null}
    </label>
  );
}

export default ImageUploadField;
