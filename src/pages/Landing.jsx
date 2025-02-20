import { useEffect, useState } from 'react';
import './landing.css';
import { useNavigate } from 'react-router';

export default function LandingPage() {
    const [films, setFilms] = useState([]);
    const [actors, setActors] = useState([]);

    useEffect(() => {
        (async function run() {
            const res = await fetch('http://localhost:8080/films');

            if (res.ok) {
                setFilms([...await res.json()]);
            }

            const res2 = await fetch('http://localhost:8080/actors');

            if (res2.ok) {
                setActors([...await res2.json()]);
            }
        })();
    }, [])

    return (
        <div className="landing-page-container">
            <h1>Top 5 rented films (All-time)</h1>
            <div className="films">
                {films.map((film) => {
                    return <FilmCard film={film} />
                })}
            </div>

            <h1>Top 5 Actors (All-time)</h1>
            <div className="films">
                {actors.map((actor) => {
                    return <ActorCard actor={actor} />
                })}
            </div>
        </div>
    )
}

export function FilmCard({ film }) {
    const [opened, setOpened] = useState(false);

    return (
        <div className="film-card">
            <h2>{film.title}</h2>
            {opened &&
                <>
                    <p>Category: {film.category}</p>
                    <p>Rental Count: {film.rentalCount}</p>
                </>
            }
            <button style={{ alignSelf: 'flex-end', cursor: 'pointer' }} onClick={() => setOpened(!opened)}>{opened ? 'Hide details' : 'Show details'}</button>
        </div>
    )
}

export function ActorCard({ actor }) {

    return (
        <div className="film-card">
            <h2>{actor.firstName} {actor.lastName}</h2>
            <p>Movie Appearances: {actor.movies}</p>
        </div>
    )
}