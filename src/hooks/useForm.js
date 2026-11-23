import { useState } from 'react'

export default function useForm(initial) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er))
  }
  const reset = () => { setValues(initial); setErrors({}) }
  return { values, setValues, errors, setErrors, handleChange, reset }
}
