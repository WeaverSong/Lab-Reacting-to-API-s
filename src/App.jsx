import React from 'react';
import './App.css';
import FilmCard from './components/FilmCard';
import PersonCard from './components/PersonCard';

let films = [];
let people = [];
let tempStage = 0;

/*

*/

export default function App()
{

    const [stage, setStage] = React.useState(0);

    React.useEffect(() =>
    {
        fetch('https://ghibliapi.herokuapp.com/films/')
            .then(data =>
            {
                if (data.ok) return data.json()
                else throw new Error("Request failed with code " + data.status);
            })
            .then(data =>
            {
                films = data;
                tempStage++;
                setStage(tempStage);
            })
            .catch(error =>
            {
                console.error(error);
            });

        fetch('https://ghibliapi.herokuapp.com/people/')
            .then(data =>
            {
                if (data.ok) return data.json()
                else throw new Error("Request failed with code " + data.status);
            })
            .then(data =>
            {
                people = data.map(person => ({
                    id: person.id,
                    name: person.name,
                    gender: person.gender,
                    age: person.age,
                    eye_color: person.eye_color,
                    hair_color: person.hair_color,
                    films: person.films.map(film => film.substring(38)),
                    url: person.url
                }))
                tempStage++;
                setStage(tempStage);

            })
            .catch(error =>
            {
                console.error(error);
            });
    }, [])

    React.useEffect(() =>
    {
        if (stage === 2 && tempStage !== -1)
        {

            films = films.map(film => ({
                id: film.id,
                title: film.title,
                description: film.description,
                release_date: film.release_date,
                rt_score: film.rt_score,
                people: people.filter(person => person.films.find(id => id === film.id))
            }));

            tempStage = -1;

        }
    }, [stage]);

    let nextData = <div></div>;

    switch (stage)
    {
        case 3:
            nextData = <div className="cardBox">
                {
                    films.map(film => < FilmCard title={film.title} description={film.description} releaseDate={film.release_date} rtScore={film.rt_score} people={film.people} key={film.title} />)
                }
            </div>
            break;
        case 4:
            nextData = <div className="cardBox">
                {
                    people.map(person => < PersonCard name={person.name} age={person.age} gender={person.gender} eyeColor={person.eye_color} hairColor={person.hair_color} url={person.url} key={person.name} />)
                }
            </div>
            break;
        default:
            break;
    }

    return (
        <div className="global">
            <div className="titleCard">
                <button className="filmsButton" disabled={stage < 2 || stage === 3} onClick={() => setStage(3)}>Films</button>
                <button className="resetButton" disabled={stage < 2} onClick={() => setStage(2)}>Reset</button>
                <button className="peopleButton" disabled={stage < 2 || stage === 4} onClick={() => setStage(4)}>People</button>
            </div>
            {nextData}
        </div>
    );
}