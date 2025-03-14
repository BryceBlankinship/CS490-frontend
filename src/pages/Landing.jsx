import { useEffect, useState } from 'react';
import './landing.css';
import { Modal, Text, Stack, Group, Button, Badge } from '@mantine/core';
import { IconMovie, IconStar, IconTicket } from '@tabler/icons-react';

export default function LandingPage() {
    const [films, setFilms] = useState([]);
    const [actors, setActors] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [filmsRes, actorsRes] = await Promise.all([
                fetch('http://localhost:8080/films'),
                fetch('http://localhost:8080/actors')
            ]);

            if (filmsRes.ok) {
                setFilms(await filmsRes.json());
            }
            if (actorsRes.ok) {
                setActors(await actorsRes.json());
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    return (
        <div className="landing-page-container">
            <div className="hero-section">
                <div className="logo">
                    <IconMovie size={48} style={{ marginRight: '12px' }} />
                    Film City
                </div>
                <div className="subtitle">Your Premier Destination for Classic and Contemporary Cinema</div>
            </div>

            <div className="section-title">
                <IconStar size={32} style={{ marginRight: '12px' }} />
                Most Popular Films
            </div>
            <div className="films">
                {films.map((film) => (
                    <FilmCard key={film.id} film={film} />
                ))}
            </div>

            <div className="section-title">
                <IconTicket size={32} style={{ marginRight: '12px' }} />
                Featured Actors
            </div>
            <div className="films">
                {actors.map((actor) => (
                    <ActorCard key={actor.id} actor={actor} />
                ))}
            </div>
        </div>
    );
}

export function FilmCard({ film }) {
    const [opened, setOpened] = useState(false);
    const [filmDetails, setFilmDetails] = useState(null);

    const loadFilmDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/films/${film.id}`);
            if (response.ok) {
                const details = await response.json();
                setFilmDetails(details);
                setOpened(true);
            }
        } catch (error) {
            console.error('Error loading film details:', error);
        }
    };

    return (
        <>
            <div className="film-card">
                <h2>{film.title}</h2>
                <Badge className="stats-badge" variant="light">
                    {film.category}
                </Badge>
                <Badge className="stats-badge" variant="light">
                    {film.rentalCount} Rentals
                </Badge>
                <Button 
                    variant="gradient" 
                    gradient={{ from: '#ffd700', to: '#ff8c00' }}
                    onClick={loadFilmDetails}
                    style={{ marginTop: 'auto' }}
                >
                    View Details
                </Button>
            </div>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={filmDetails?.title}
                size="lg"
                styles={{
                    title: { color: '#ffd700', fontSize: '1.5rem' },
                    body: { background: '#1a237e', color: 'white' }
                }}
            >
                {filmDetails && (
                    <Stack>
                        <Text><strong>Description:</strong> {filmDetails.description}</Text>
                        <Group>
                            <Badge variant="light" color="yellow">
                                {filmDetails.releaseYear}
                            </Badge>
                            <Badge variant="light" color="blue">
                                {filmDetails.length} minutes
                            </Badge>
                            <Badge variant="light" color="red">
                                {filmDetails.rating}
                            </Badge>
                        </Group>
                        <Text><strong>Rental Rate:</strong> ${filmDetails.rentalRate}</Text>
                        <Text><strong>Replacement Cost:</strong> ${filmDetails.replacementCost}</Text>
                        <Text><strong>Category:</strong> {filmDetails.category}</Text>
                        <Text>
                            <strong>Starring:</strong>{' '}
                            {filmDetails.actors?.length > 0 
                                ? filmDetails.actors.join(', ')
                                : 'No actors listed'
                            }
                        </Text>
                    </Stack>
                )}
            </Modal>
        </>
    );
}

export function ActorCard({ actor }) {
    const [opened, setOpened] = useState(false);
    const [actorDetails, setActorDetails] = useState(null);

    const loadActorDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/actors/${actor.id}/details`);
            if (response.ok) {
                const details = await response.json();
                setActorDetails(details);
                setOpened(true);
            }
        } catch (error) {
            console.error('Error loading actor details:', error);
        }
    };

    return (
        <>
            <div className="film-card">
                <h2>{actor.firstName} {actor.lastName}</h2>
                <Badge className="stats-badge" variant="light">
                    {actor.movies} Films
                </Badge>
                <Button 
                    variant="gradient" 
                    gradient={{ from: '#ffd700', to: '#ff8c00' }}
                    onClick={loadActorDetails}
                    style={{ marginTop: 'auto' }}
                >
                    View Filmography
                </Button>
            </div>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={`${actor.firstName} ${actor.lastName}`}
                size="lg"
                styles={{
                    title: { color: '#ffd700', fontSize: '1.5rem' },
                    body: { background: '#1a237e', color: 'white' }
                }}
            >
                {actorDetails && (
                    <Stack>
                        <Text size="lg" fw={500} c="#ffd700">Top 5 Featured Films:</Text>
                        {actorDetails.topFilms?.map((film, index) => (
                            <div key={film.id} style={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '1rem',
                                borderRadius: '8px'
                            }}>
                                <Text size="lg">
                                    {index + 1}. {film.title}
                                </Text>
                                <Group>
                                    <Badge variant="light" color="yellow">
                                        {film.category}
                                    </Badge>
                                    <Badge variant="light" color="blue">
                                        {film.rentalCount} Rentals
                                    </Badge>
                                </Group>
                            </div>
                        ))}
                    </Stack>
                )}
            </Modal>
        </>
    );
}