import React from 'react';
import './css/card.css';

export default function PersonCard ({name, age, gender, eyeColor, hairColor, url}) {
    return (
        <div className="card">
            <h2 className="cardTitle">{name}</h2>
            <h4 className="cardField">Age: {age}</h4>
            <h4 className="cardField">Gender: {gender}</h4>
            <h4 className="cardField">Eye color: {eyeColor}</h4>
            <h4 className="cardField">Hair color: {hairColor}</h4>
            <a className="cardLink" href={url} target="_blank" rel="noreferrer">Link</a>
        </div>
    );
}