import React from 'react';
import {LoadingOutlined, WarningOutlined} from '@ant-design/icons';

export function ActionForm({
  cssClass,
  title,
  submitHandler,
  inputRef,
  onChangeHandler,
  buttonText,
  loading,
  inputError = false,
  inputMessage = '',
}) {
  return (
    <div className={`actionForm ${cssClass}`}>
      <form onSubmit={submitHandler}>
        <input
          ref={inputRef}
          type="number"
          onChange={onChangeHandler}
          placeholder={title}
        />
        <button type="submit">
          {loading ? <LoadingOutlined /> : buttonText}
        </button>
        <div className="warning">
          {inputError && (
            <>
              <WarningOutlined /> {inputMessage}
            </>
          )}
        </div>
      </form>
    </div>
  );
}
