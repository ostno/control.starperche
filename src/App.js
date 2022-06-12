import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import classNames from 'classnames'

import React, { useRef, useState } from 'react';

function App() {

  const [athletePerche, setAthletePerche] = useState(
    {
      name: 'Isack PALATS',
      id: 'isackpalats',
      nation: 'FRA',
      club: 'Bordeaux athlé',
      rp: '5m20',
      sb: '5m20',
      hauteurFranchie: '5m17',
      prochaineTentative: '',
      totalEchec: 3,
      concours: ['O', 'O', 'XXX'],
      echecsDerniereBarre: 3,
      totalSaut: 5,
      place: 9,
      special: ['RP', 'MR']
    }

  )

  const [athletePoids, setAthletePoids] = useState(
    {
      name: 'Tsanko ARNAUDOV',
      id: 'tsankoarnaudov',
      nation: 'POR',
      club: '',
      rp: '21m56',
      sb: '20m25',
      bestShot: '19m94',
      secondBestShot: '',
      prochaineTentative: 7,
      totalEchec: 2,
      concours: ['18m20', '17m22', '13m50', '19m94'],
      totalShots: 6,
      place: 1,
      special: ['RP']
    },
  )

  const [displayPerche, setDisplayPerche] = useState(false);
  const [displayPoids, setDisplayPoids] = useState(true);
  const [barres, setBarres] = useState(['5m10', '5m30', '5m40', '5m50', '5m60']);

  const webSocket = useRef(null);

  useEffect(() => {
    webSocket.current = new WebSocket("ws://localhost:3042");
    webSocket.current.onmessage = (message) => {
      console.log(JSON.parse(message.data))
      const data = JSON.parse(message.data);
      if (data.type === "clear") {
        setDisplayPerche(false);
      } else if (data.type === "single" && data.event === "Perche") {
        if (data.data.concours.length > 6) {
          data.barres.splice(0, data.data.concours.length - 6);
          data.data.concours = data.data.concours.slice(-6);
        }
        setAthletePerche(data.data)
        setBarres(data.barres)
        setDisplayPerche(true);
      }
      else if (data.type === "single" && data.event === "Poids") {
        setAthletePoids(data.data)
        setDisplayPoids(true);
      }
    };

    webSocket.current.onerror = (message) => {
      console.log('ws error', message)
      setTimeout(() => {
        console.log('ws reconnected')
        webSocket.current = new WebSocket("ws://localhost:3042");
      }, 1000);
    };

    webSocket.current.onclose = (message) => {
      console.log('ws error', message)
      setTimeout(() => {
        console.log('ws reconnected after error')
        webSocket.current = new WebSocket("ws://localhost:3042");
      }, 1000);
    };

    return () => webSocket.current.close();
  }, []);

  const rankClasses = classNames(
    'rank_inside',
    {
      'first_place': athletePerche.place === 1,
      'second_place': athletePerche.place === 2,
      'third_place': athletePerche.place === 3,
    }
  );

  return (
    <div>
      <div className='logo-urban'>
        <img src="logo.png" />
      </div>

      {displayPerche &&
        <div className="container single">

          <div className="recap">
            <div className="recap_inside">

              <div className="nation">
                <div className="nation_bg">
                  <div className="nation_inside">
                    {athletePerche.nation}
                    <img src={`${athletePerche.nation.toLowerCase()}.svg`} className="flag" />
                  </div>
                </div>
              </div>
              <div className="right_frame">
                <div className="name_place">
                  <div className="name">
                    <span className="name_inside">
                      {athletePerche.name}
                    </span>
                  </div>
                  <div className="rank">
                    <span className={rankClasses}>
                      {athletePerche.place}
                    </span>
                  </div>
                  <div className="special_out">
                    <div className="special">
                      {athletePerche.special.map((spe, index) => {
                        return (
                          <span className="special_inside " key={`spe-${index}`}>
                            {spe}
                          </span>)
                      })}
                    </div>
                  </div>
                </div>

              </div>
              <div className=" cleared_height">
                <div className="cleared_height_background">
                  <div className="cleared_height_inside">
                    {athletePerche.hauteurFranchie}
                  </div>
                </div>
              </div>
            </div>

            <div className="concours">
              {athletePerche.concours.map((height, index) => {
                if (index < 6) {
                  return (
                    <div className="hauteur" key={`height-${index}`}>
                      <div
                        className="height_inside <% if (data.athlete.hauteurFranchie === data.barres[i]) { %> cleared  <% } %>">
                        {barres[index]}
                      </div>
                      <div
                        className="height_inside <% if (data.athlete.concours[i].includes('_')) { %> current_bar  <% } %>">
                        {athletePerche.concours[index]}
                      </div>
                    </div>)
                }
              })}
            </div>

          </div>

        </div>
      }
    </div >
  );
}

export default App;
