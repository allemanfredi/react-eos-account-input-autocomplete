import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import EosAccountInputAutocomplete from './components/EosAccountInputAutocomplete'
import * as serviceWorker from './serviceWorker'

const App = () => {
  const [value, setValue] = useState('')

  return (
    <EosAccountInputAutocomplete
      value={value}
      rpc={'rpc address or istance of JsonRpc'}
      onChange={(_e) => setValue(_e.target.value)}
      onSelect={(_value) => setValue(_value)}
      onFetchAccounts={(_accounts) => console.log(_accounts)}
    />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
