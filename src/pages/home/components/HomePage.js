import {CompoundButton, PrimaryButton} from '@fluentui/react/lib/Button';
import React from 'react';
import {Link} from 'react-router-dom';
import {ReactComponent as SideSVG} from '../../../svg/space.svg';
import {Store} from '../../../helpers/Store'

class HomePage extends React.Component {
  render() {
    return (
        <>
          <div>
            <h1>Sammelt eure Schulthemen gemeinsam - egal wo ihr seid!</h1>
            <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
              gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
            {(!this.context.isRegisteredUser) ? (
                <>
                  <Link to="/register">
                    <CompoundButton primary secondaryText="Für neue Nutzer" style={{marginRight: '15px'}}>
                      Registrieren
                    </CompoundButton>
                  </Link>
                  <Link to="/login">
                    <CompoundButton secondaryText="Für registrierte Nutzer">
                      Anmelden
                    </CompoundButton>
                  </Link>
                </>
            ) : (
                <>
                  <Link to="/calendar">
                    <PrimaryButton text="Zum Kalender" />
                  </Link>
                </>
            )}
          </div>
          <div>
            <SideSVG/>
          </div>
        </>
    );
  }
  static contextType = Store;
}

export default HomePage;
