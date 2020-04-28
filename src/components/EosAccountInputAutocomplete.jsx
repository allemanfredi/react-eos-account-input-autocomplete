import React, { useState } from 'react'
import { Mutex } from 'async-mutex'
import { JsonRpc } from 'eosjs'
import fetch from 'node-fetch'

const mutex = new Mutex()

/**
 *
 * Return the account list filtered by _currentTypedAccount with _limit
 *
 * @param {String} _currentTypedAccount
 * @param {Array} _currentAccounts
 * @param {Number} _limit
 */
const getAccounts = async (
  _rpc,
  _currentTypedAccount,
  _currentAccounts,
  _limit
) => {
  const release = await mutex.acquire()

  try {
    if (_currentTypedAccount.length === 0) {
      release()
      return []
    }

    if (_currentTypedAccount.length > 12) {
      release()
      return _currentAccounts
    }

    const res = await _rpc.get_table_by_scope({
      code: 'eosio',
      table: 'userres',
      lower_bound: _currentTypedAccount,
      upper_bound: _currentTypedAccount.padEnd(12, 'z'),
      limit: _limit,
    })

    release()

    if (!res.rows) return _currentAccounts

    return res.rows.map((row) => row.scope)
  } catch (err) {
    release()
    return _currentAccounts
  }
}

/**
 * React Component
 *
 * @param {Object} _props
 */
const EosAccountInputAutoComplete = (_props) => {
  let input = null
  let wrapper = null

  const [isFocused, setIsFocused] = useState(false)
  const [accounts, setAccounts] = useState([])

  const handleClickOutside = (_event) => {
    if (wrapper && !wrapper.contains(_event.target)) {
      setIsFocused(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)

  const rpc =
    typeof _props.rpc === 'string'
      ? new JsonRpc(_props.rpc, { fetch })
      : _props.rpc

  return (
    <div
      ref={(ref) => (wrapper = ref)}
      onClick={() => {
        setIsFocused(true)
        input.focus()
      }}
    >
      <input
        ref={(ref) => (input = ref)}
        className="eos-account-input-autocomplete__input"
        type="text"
        id={'eos-account-input-autocomplete-input'}
        name={'eos-account-input-autocomplete-input'}
        value={_props.value}
        onClick={(_e) => {
          if (_props.onClick) _props.onClick(_e)
        }}
        onChange={(_e) => {
          if (_props.onChange) _props.onChange(_e)

          getAccounts(
            rpc,
            _e.target.value,
            accounts,
            _props.limit ? _props.limit : 10
          ).then((_accounts) => {
            if (_props.onFetchAccounts) _props.onFetchAccounts(_accounts)
            setAccounts(_accounts)
          })
        }}
      />
      {accounts && accounts.length > 0 && isFocused ? (
        <div
          id={'eos-account-input-autocomplete-list'}
          className="eos-account-input-autocomplete__list"
        >
          {accounts.map((_account, _index) => {
            return (
              <div
                key={`eos-account-input-autocomplete__item-${_index.toString()}`}
                onClick={() => {
                  if (_props.onSelect) _props.onSelect(_account)
                  setTimeout(() => {
                    setIsFocused(false)
                  }, 200)
                }}
                className="eos-account-input-autocomplete__item"
              >
                {_account}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default EosAccountInputAutoComplete
