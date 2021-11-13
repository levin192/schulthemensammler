import React, {Component} from 'react'
import {FirebaseDataProvider} from '../../../helpers/Firebasedataprovider'
import {Stack, IStackTokens} from '@fluentui/react';
import {DefaultButton, PrimaryButton} from '@fluentui/react/lib/Button';
import {TextField, MaskedTextField} from '@fluentui/react/lib/TextField';

const stackTokens: IStackTokens = {childrenGap: 40};

class RegisterPage extends React.Component {
  componentDidMount = () => {
    const fb = new FirebaseDataProvider
    fb.register({
      email: 'testqs@asdsgad.de',
      password: 'test123'
    })
  }


  render() {
    return <>
      <h1>Schulthemensammler</h1>
      <TextField label="E-Mail" required/>
      <TextField
          label="Passwort"
          type="password"
          canRevealPassword
          revealPasswordAriaLabel="Passwort anzeigen"
      />
      <DefaultButton text="Anmelden"/>
      <PrimaryButton text="Registrieren"/>
    </>
  }
}


export default RegisterPage;