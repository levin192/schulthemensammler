import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {IContextualMenuProps, IIconProps} from '@fluentui/react';
import {CommandButton} from '@fluentui/react/lib/Button';
import {Store} from '../../helpers/Store'
import FirebaseDataProvider from '../../helpers/Firebasedataprovider';

export const UserActions: React.FunctionComponent<> = props => {
  const navigate = useNavigate();
  const HandleClickEvent = (route) => {
    navigate('/' + route, {replace: true});
  }
  const fb = new FirebaseDataProvider();
  const clickEvent = (event, el) => {
    switch (el.key) { // Switch in case other keys need custom code
      case 'logout':
        fb.firebase.auth().signOut().then(() => {
          HandleClickEvent('')
          window.location.reload()
        })
        break;
      default:
        HandleClickEvent(el.key)
    }

  }

  const loggedInProps: IContextualMenuProps = {
    items: [
      {
        key: 'settings',
        text: 'Einstellungen',
        iconProps: {iconName: 'Settings'},
        onClick: clickEvent
      },
      {
        key: 'calendar',
        text: 'Kalender',
        iconProps: {iconName: 'Calendar'},
        onClick: clickEvent
      },
      {
        key: 'logout',
        text: 'Abmelden',
        iconProps: {iconName: 'SignOut'},
        onClick: clickEvent
      },

    ],
  };
  const loggedOutProps: IContextualMenuProps = {
    items: [
      {
        key: 'login',
        text: 'Anmelden',
        iconProps: {iconName: 'Signin'},
        onClick: clickEvent
      },
      {
        key: 'register',
        text: 'Registrieren',
        iconProps: {iconName: 'AddFriend'},
        onClick: clickEvent
      },

    ],
  };

  const userIcon: IIconProps = {iconName: 'Contact'};


  return (
      <>
        <Store.Consumer>
          {(value => (value.loggedIn) ? (
              <CommandButton iconProps={userIcon} text={value.userName} menuProps={loggedInProps}/>
          ) : (
              <CommandButton iconProps={userIcon} text="Menu" menuProps={loggedOutProps}/>
          ))}
        </Store.Consumer>
      </>
  );
};


