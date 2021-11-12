import React, {Component} from 'react'
import FirebaseDataProvider from '../../../helpers/Firebasedataprovider'
import {Stack, IStackTokens} from '@fluentui/react';
import {DefaultButton, PrimaryButton} from '@fluentui/react/lib/Button';
import {TextField, MaskedTextField} from '@fluentui/react/lib/TextField';

const stackTokens: IStackTokens = {childrenGap: 40};

class RegisterPage extends React.Component {
  componentDidMount = () => {


    //  FirebaseDataProvider.register("testqs@asdsad.de", "test123");

  }


  render() {
    return <Stack horizontal tokens={stackTokens}>
      <TextField label="E-Mail " required/>
      <TextField
          label="Passwort"
          type="password"
          canRevealPassword
          revealPasswordAriaLabel="Passwort anzeigen"
      />
      <DefaultButton text="Standard"/>
      <PrimaryButton text="Primary"/>
    </Stack>
  }
}


export default RegisterPage;