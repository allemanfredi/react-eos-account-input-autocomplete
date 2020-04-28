# :writing_hand: react-eos-account-input-autocomplete

Simple React component that implements the auto-completion of account names on the EOS Blockchain.

&nbsp;

***

&nbsp;

## :page_with_curl: Installation

```
npm install react-eos-account-input-autocomplete
```

&nbsp;

***

&nbsp;

## :rocket: Usage

```js

  import EosAccountInputAutocomplete from 'react-eos-account-input-autocomplete'

  const [value, setValue] = useState('')

  ....

  <EosAccountInputAutocomplete 
    value={value}
    limit={5} //default to 10
    rpc={'your rpc address or an instance of JsonRpc'}
    onChange={_e => setValue(_e.target.value)}
    onSelect={_value => setValue(_value)}
    onFetchAccounts={_accounts => console.log(_accounts)}
  />
```

&nbsp;

***

&nbsp;

## :performing_arts: Customization

It's possible to override the css classes (by default they are empty):

- __`eos-account-input-autocomplete__input`__: input text
- __`eos-account-input-autocomplete__list`__: list container
- __`eos-account-input-autocomplete__item`__: single item within the list