import React from 'react';
import './css/card.css';

export default function FilmCard ({title, description, releaseDate, rtScore, people}) {

    let style = "green"
    if (rtScore < 75) style = "red";

    return (
        <div className="card">
            <h2 className="cardTitle">{title}</h2>
            <h4 className="cardDate">Released in {releaseDate}</h4>
            <p className="cardDescription">{description}</p>
            <h3 className="cardScore">Rt score: <span className={style}>{rtScore}</span></h3>
            <h3 className="cardPeopleTitle">Related people in database:</h3>
                {
                    people.map(person => <div className="cardPeople" key={person.id}><a href={'https://ghibliapi.herokuapp.com/people/' + person.id} target="_blank" rel="noreferrer">{person.name}</a><br/></div>)
                }
        </div>
    );
}