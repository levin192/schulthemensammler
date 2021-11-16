import * as React from 'react';
import {IContextualMenuProps, IIconProps} from '@fluentui/react';
import {CommandButton} from '@fluentui/react/lib/Button';
import {Store} from '../../helpers/Store'


const clickEvent = (event) => {
  console.log(event)

}

const loggedInProps: IContextualMenuProps = {
  items: [
    {
      key: 'userSettings',
      text: 'Einstellungen',
      iconProps: {iconName: 'Settings'},
      onClick: clickEvent
    },
    {
      key: 'calendarEvent',
      text: 'Kalender',
      iconProps: {iconName: 'Calendar'},
      onClick: clickEvent
    },
    {
      key: 'userLogOut',
      text: 'Abmelden',
      iconProps: {iconName: 'SignOut'},
      onClick: clickEvent
    },

  ],
};
const loggedOutProps: IContextualMenuProps = {
  items: [
    {
      key: 'signIn',
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

export const UserActions: React.FunctionComponent<> = props => {
  const {disabled, checked} = props;

  return (<>
        <Store.Consumer>
          {(value => (value.loggedIn) ? (
              <CommandButton iconProps={userIcon} text="Menu" menuProps={loggedInProps} disabled={disabled}
                             checked={checked} onClick={clickEvent}/>
          ) : (
              <CommandButton iconProps={userIcon} text="Menu" menuProps={loggedOutProps} disabled={disabled}
                             checked={checked} onClick={clickEvent}/>
          ))}
        </Store.Consumer>

      </>
  );
};


