type Props = {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
};

function FormField({ label, name, type = 'text', value, onChange }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <input aria-label={label} name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default FormField;
