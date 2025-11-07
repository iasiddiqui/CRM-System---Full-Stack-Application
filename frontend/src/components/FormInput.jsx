import './FormInput.css'

const FormInput = ({ label, type = 'text', value, onChange, error, ...props }) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-input ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}

export default FormInput

