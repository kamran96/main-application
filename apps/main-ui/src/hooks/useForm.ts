/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from 'react';

export function useForm(initial, schema, changeAgent = null) {
  const [values, setState] = useState(initial);
  const [touched, setTouched] = useState([]);
  const [errors, setErrors] = useState(null);
  const [submitted, formSubmitted] = useState(false);

  const oldInitial = useRef(initial);
  const reset = () => {
    setState(oldInitial.current);
    setErrors(null);
    setTouched([]);
  };

  // update values if initial are changed, useful when data is asynchronous
  // if (changeAgent) {
  //   useEffect(() => {
  //     oldInitial.current = initial;
  //     setState(initial);
  //   }, [initial[changeAgent]]);
  // }

  const changeValue = (key: string, value) => {
    if (key) {
      if (key.startsWith('push|')) {
        // example: key = push|variants, means push value to variants.
        const [, variable] = key.split('|');
        const _values = { ...values };
        const _data = _values[variable];
        _data.push(value);
        _values[variable] = _data;
        setState(_values);
      } else if (key.indexOf('|') > -1) {
        // we've index values
        const _values = { ...values };
        const [name, _key, index] = key.split('|');
        const _data = _values[_key];
        const _subject = { ..._data[index] };
        _subject[name] = value;
        _data[index] = _subject;
        _values[_key] = _data;
        setState(_values);
      } else {
        setState({ ...values, [key]: value });
      }
    }
  };

  // update field value on change on any input in the form
  const onFormChange = (e) => {
    const { name, value, type } = e.target;
    if (name) {
      if (type === 'checkbox') {
        changeValue(name, e.target.checked);
      } else {
        changeValue(name, value);
      }
    }
  };

  // update whether item is touched or not.
  const onFormBlur = (e) => {
    const { name } = e.target;

    if (name && !touched.includes(name)) {
      setTouched([...touched, name]);
    }

    onFormChange(e);
  };

  const error = (key) => {
    if (
      (touched.includes(key) && errors && errors[key]) ||
      (submitted && errors && errors[key])
    ) {
      return errors[key];
    }

    return null;
  };

  useEffect(() => {
    if (schema) {
      schema
        .validate(values, { abortEarly: false })
        .then((res) => {
          setErrors({});
        })
        .catch((error) => {
          const newErrors = {};
          error.inner.forEach((err) => {
            if (touched.includes(err.path) || formSubmitted) {
              newErrors[err.path] = err.message;
            }

            return null;
          });

          setErrors(newErrors);
        });
    }
  }, [values, touched, submitted]);

  // has errors
  const hasErrors = useMemo(() => {
    return errors !== null && Object.keys(errors).length > 0;
  }, [errors]);

  return {
    values,
    setState,
    touched,
    onFormChange,
    onFormBlur,
    errors,
    setErrors,
    error,
    reset,
    changeValue,
    hasErrors,
    formSubmitted,
  };
}
