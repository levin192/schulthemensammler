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
            <h1 className="special">Sammelt eure Schulthemen gemeinsam - egal wo ihr seid!</h1>
            <p>
              Herzlich Willkommen zu unserem Schulthemensammler!
              <br/>
              Mithilfe unseres Schulthemensammlers ist es für euch möglich, die
              Schulthemen bezogend auf den Schultag für jedes Fach zu
              hinterlegen um einen einheitlichen strukturierten Überblick zu
              erhalten. <br/>
              Falls du noch nicht registriet bist, klicke bitte unten auf den
              Registrierungsbotten.
              Falls du erfreulicherweise bereits ein Konto angelegt hast, klicke
              unten auf den Kalenderbutton, anschließend ist es für dich möglich
              die Schulthemen zu hinterlegen! <br/><br/>

              Wir hoffen, dass euch der Schulthemensammler im Schulalltag
              unterstützen wird und euch diesbezüglich das Leben deutlich
              vereinfachen wird! :-)
            </p>
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
