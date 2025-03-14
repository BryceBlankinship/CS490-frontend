import React, { useState, useEffect } from 'react';
import {
    Container,
    TextInput,
    Button,
    Text,
    Grid,
    Modal,
    Title,
    Select,
    Alert,
    Stack,
    Group,
    Box,
    Card,
    Badge,
} from '@mantine/core';
import { IconSearch, IconMovie, IconCategory, IconUser } from '@tabler/icons-react';

export default function Films() {
    const [films, setFilms] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchActor, setSearchActor] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [rentStatus, setRentStatus] = useState({ show: false, success: false, message: '' });

    useEffect(() => {
        searchFilms();
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await fetch('http://localhost:8080/customers');
            if (!response.ok) throw new Error('Failed to load customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const searchFilms = async () => {
        try {
            const params = new URLSearchParams({
                ...(searchTitle && { title: searchTitle }),
                ...(searchActor && { actor: searchActor }),
                ...(searchCategory && { category: searchCategory })
            });
            const response = await fetch(`http://localhost:8080/films/search?${params}`);
            if (!response.ok) throw new Error('Failed to search films');
            const data = await response.json();
            setFilms(data);
        } catch (error) {
            console.error('Error searching films:', error);
        }
    };

    const handleRentFilm = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/films/${selectedFilm.id}/rent?customerId=${selectedCustomer}`,
                { method: 'POST' }
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to rent film');
            }

            setRentStatus({
                show: true,
                success: true,
                message: 'Film rented successfully!'
            });
            
            setTimeout(() => {
                setOpenDialog(false);
                setSelectedCustomer('');
                setRentStatus({ show: false, success: false, message: '' });
            }, 2000);
        } catch (error) {
            setRentStatus({
                show: true,
                success: false,
                message: error.message || 'Error renting film'
            });
        }
    };

    return (
        <Box className="page-container" p="xl">
            <Container size="xl">
                <Title order={1} mb="xl" className="page-title">
                    <IconMovie size={32} style={{ marginRight: '12px' }} />
                    Film Catalog
                </Title>

                <Card className="search-card" mb="xl">
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <TextInput
                                icon={<IconSearch size={16} />}
                                label="Search by Title"
                                placeholder="Enter film title"
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                className="search-input"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <TextInput
                                icon={<IconUser size={16} />}
                                label="Search by Actor"
                                placeholder="Enter actor name"
                                value={searchActor}
                                onChange={(e) => setSearchActor(e.target.value)}
                                className="search-input"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 4 }}>
                            <TextInput
                                icon={<IconCategory size={16} />}
                                label="Search by Category"
                                placeholder="Enter category"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                                className="search-input"
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Button
                                variant="gradient"
                                gradient={{ from: '#ffd700', to: '#ff8c00' }}
                                onClick={searchFilms}
                                fullWidth
                            >
                                Search Films
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Card>

                <Grid>
                    {films.map((film) => (
                        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={film.id}>
                            <Card 
                                className="film-result-card"
                                onClick={() => {
                                    setSelectedFilm(film);
                                    setOpenDialog(true);
                                }}
                            >
                                <Stack>
                                    <Text fw={700} size="lg" className="film-title">
                                        {film.title}
                                    </Text>
                                    <Group>
                                        <Badge variant="light" color="yellow">
                                            {film.category}
                                        </Badge>
                                        <Badge variant="light" color="blue">
                                            {film.rating}
                                        </Badge>
                                    </Group>
                                    <Text size="sm" lineClamp={2}>
                                        {film.description}
                                    </Text>
                                    <Text c="dimmed" size="sm">
                                        Rental Rate: ${film.rentalRate}
                                    </Text>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                <Modal
                    opened={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title={selectedFilm?.title}
                    size="lg"
                    className="film-modal"
                    styles={{
                        title: { color: '#ffd700', fontSize: '1.5rem' },
                        body: { background: '#1a237e', color: 'white' }
                    }}
                >
                    {selectedFilm && (
                        <Stack>
                            <Text><strong>Description:</strong> {selectedFilm.description}</Text>
                            <Group>
                                <Badge variant="light" color="yellow">
                                    {selectedFilm.releaseYear}
                                </Badge>
                                <Badge variant="light" color="blue">
                                    {selectedFilm.length} minutes
                                </Badge>
                                <Badge variant="light" color="red">
                                    {selectedFilm.rating}
                                </Badge>
                            </Group>
                            <Text><strong>Rental Rate:</strong> ${selectedFilm.rentalRate}</Text>
                            <Text><strong>Replacement Cost:</strong> ${selectedFilm.replacementCost}</Text>
                            <Text><strong>Category:</strong> {selectedFilm.category}</Text>
                            <Text>
                                <strong>Starring:</strong>{' '}
                                {selectedFilm.actors?.length > 0 
                                    ? selectedFilm.actors.join(', ')
                                    : 'No actors listed'
                                }
                            </Text>

                            <Select
                                label="Select Customer"
                                placeholder="Choose a customer to rent"
                                value={selectedCustomer}
                                onChange={setSelectedCustomer}
                                data={customers.map(customer => ({
                                    value: customer.id.toString(),
                                    label: `${customer.firstName} ${customer.lastName}`
                                }))}
                                className="customer-select"
                            />

                            {rentStatus.show && (
                                <Alert 
                                    color={rentStatus.success ? "green" : "red"}
                                    title={rentStatus.success ? "Success" : "Error"}
                                >
                                    {rentStatus.message}
                                </Alert>
                            )}

                            <Group justify="flex-end" mt="md">
                                <Button 
                                    variant="subtle" 
                                    color="gray"
                                    onClick={() => setOpenDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="gradient"
                                    gradient={{ from: '#ffd700', to: '#ff8c00' }}
                                    onClick={handleRentFilm}
                                    disabled={!selectedCustomer}
                                >
                                    Rent Film
                                </Button>
                            </Group>
                        </Stack>
                    )}
                </Modal>
            </Container>
        </Box>
    );
}