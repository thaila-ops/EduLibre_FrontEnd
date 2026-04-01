const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function isImageFile(file: File) {
  return file.type.startsWith('image/');
}

function isAllowedSize(file: File) {
  return file.size <= MAX_IMAGE_SIZE;
}

function readDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.readAsDataURL(file);
  });
}

export async function imageFileToDataUrl(file: File) {
  if (!isImageFile(file)) throw new Error('Selecione um arquivo de imagem.');
  if (!isAllowedSize(file)) throw new Error('A imagem deve ter no máximo 2 MB.');
  return readDataUrl(file);
}
