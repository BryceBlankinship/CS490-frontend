import { 
    Button, 
    Modal, 
    Select, 
    Table, 
    TextInput,
    Stack,
    Group,
    Text,
    Badge,
    ActionIcon,
    Box,
    Tabs,
    Card,
    Container,
    Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconEdit, IconTrash, IconEye, IconUsers, IconSearch, IconPlus } from '@tabler/icons-react';
import './Customer.css';

export default function Customer() {
    const [allCustomers, setAllCustomers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchType, setSearchType] = useState('firstName');
    const [paginationStart, setPaginationStart] = useState(0);
    const [paginationEnd, setPaginationEnd] = useState(10);
    const [opened, setOpened] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerRentals, setCustomerRentals] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        district: '',
        city: '',
        cityId: 1,
        country: '',
        countryId: 1,
        phone: '',
        postalCode: '',
        storeId: 1,
        active: true
    });

    useEffect(() => {
        console.log('Component mounted, loading customers...'); // Debug log
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const res = await fetch("http://localhost:8080/customers");
            if (!res.ok) {
                throw new Error('Failed to fetch customers');
            }
            const data = await res.json();
            console.log('Loaded customers:', data); // Debug log
            setAllCustomers(data);
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const loadCustomerRentals = async (customerId) => {
        try {
            const res = await fetch(`http://localhost:8080/customers/${customerId}/rentals`);
            if (res.ok) {
                const data = await res.json();
                setCustomerRentals(data);
            }
        } catch (error) {
            console.error('Error loading rentals:', error);
        }
    };

    const handlePrev = () => {
        setPaginationStart((prev) => prev - 10);
        setPaginationEnd((prev) => prev - 10);
    };

    const handleNext = () => {
        setPaginationStart((prev) => prev + 10);
        setPaginationEnd((prev) => prev + 10);
    };

    const openCustomer = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/customers/${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch customer details');
            }
            const customer = await res.json();
            console.log('Selected customer:', customer); // Debug log
            setSelectedCustomer(customer);
            await loadCustomerRentals(id);
            setOpened(true);
            setEditMode(false);
        } catch (error) {
            console.error('Error loading customer details:', error);
        }
    };

    const handleEdit = () => {
        setFormData({
            firstName: selectedCustomer.firstName,
            lastName: selectedCustomer.lastName,
            email: selectedCustomer.email,
            address: selectedCustomer.address,
            district: selectedCustomer.district,
            city: selectedCustomer.city,
            country: selectedCustomer.country,
            phone: selectedCustomer.phone,
            postalCode: selectedCustomer.postalCode,
            storeId: selectedCustomer.storeId,
            active: selectedCustomer.active,
            cityId: selectedCustomer.cityId,
            countryId: selectedCustomer.countryId,
            addressId: selectedCustomer.addressId
        });
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:8080/customers/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                await loadCustomers();
                setOpened(false);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const handleSave = async () => {
        try {
            const method = selectedCustomer ? 'PUT' : 'POST';
            const url = selectedCustomer 
                ? `http://localhost:8080/customers/${selectedCustomer.id}`
                : 'http://localhost:8080/customers';

            // Ensure all required fields are present
            const dataToSend = {
                ...formData,
                ...(selectedCustomer && { id: selectedCustomer.id }),
                storeId: formData.storeId || 1,
                active: formData.active === undefined ? true : formData.active,
                cityId: formData.cityId || 1, // Add default cityId
                postalCode: formData.postalCode ? parseInt(formData.postalCode) : null
            };

            console.log('Saving customer data:', dataToSend); // Debug log

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to save customer');
            }

            await loadCustomers();
            setOpened(false);
            setEditMode(false);
        } catch (error) {
            console.error('Error saving customer:', error);
            // You might want to show an error notification here
        }
    };

    const handleReturnRental = async (rentalId) => {
        try {
            const res = await fetch(`http://localhost:8080/rentals/${rentalId}/return`, {
                method: 'POST'
            });
            if (res.ok) {
                await loadCustomerRentals(selectedCustomer.id);
            }
        } catch (error) {
            console.error('Error returning rental:', error);
        }
    };

    useEffect(() => {
        if (searchValue.length !== 0) {
            const lowerSearchValue = searchValue.toLowerCase();
            const filtered = allCustomers.filter((customer) => {
                if (searchType === "firstName") {
                    return customer.firstName.toLowerCase().includes(lowerSearchValue);
                } else if (searchType === "lastName") {
                    return customer.lastName.toLowerCase().includes(lowerSearchValue);
                } else if (searchType === "id") {
                    return customer.id.toString().includes(lowerSearchValue);
                }
                return false;
            });
            setCustomers(filtered);
        } else {
            setCustomers(allCustomers);
        }
    }, [searchValue, searchType, allCustomers]);

    const renderCustomerForm = () => (
        <Stack>
            <Group grow>
                <TextInput
                    required
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                <TextInput
                    required
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
            </Group>
            <TextInput
                required
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextInput
                required
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <Group grow>
                <TextInput
                    required
                    label="District"
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                />
                <TextInput
                    required
                    label="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
            </Group>
            <Group grow>
                <TextInput
                    required
                    label="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
                <TextInput
                    required
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                />
            </Group>
            <TextInput
                required
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <Select
                label="Active Status"
                value={formData.active ? 'true' : 'false'}
                onChange={(value) => setFormData({...formData, active: value === 'true'})}
                data={[
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' }
                ]}
            />
        </Stack>
    );

    const renderCustomerDetails = () => (
        <Tabs defaultValue="details">
            <Tabs.List>
                <Tabs.Tab value="details">Details</Tabs.Tab>
                <Tabs.Tab value="rentals">Rental History</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details">
                <Stack mt="md">
                    <Text><strong>Customer ID:</strong> {selectedCustomer?.id}</Text>
                    <Text><strong>Name:</strong> {selectedCustomer?.firstName} {selectedCustomer?.lastName}</Text>
                    <Text><strong>Email:</strong> {selectedCustomer?.email}</Text>
                    <Text><strong>Phone:</strong> {selectedCustomer?.phone}</Text>
                    <Text><strong>Address:</strong> {selectedCustomer?.address}</Text>
                    <Text><strong>District:</strong> {selectedCustomer?.district}</Text>
                    <Text><strong>City:</strong> {selectedCustomer?.city}</Text>
                    <Text><strong>Country:</strong> {selectedCustomer?.country}</Text>
                    <Text><strong>Postal Code:</strong> {selectedCustomer?.postalCode}</Text>
                    <Text>
                        <strong>Active Status:</strong>{' '}
                        <Badge color={selectedCustomer?.active ? 'green' : 'red'}>
                            {selectedCustomer?.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Text>
                    <Text><strong>Customer since:</strong> {new Date(selectedCustomer?.createDate).toLocaleDateString()}</Text>
                    <Text><strong>Last updated:</strong> {new Date(selectedCustomer?.lastUpdate).toLocaleDateString()}</Text>
                </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="rentals">
                <Table mt="md">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Film</Table.Th>
                            <Table.Th>Rental Date</Table.Th>
                            <Table.Th>Return Date</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {customerRentals.map((rental) => (
                            <Table.Tr key={rental.rentalId}>
                                <Table.Td>{rental.filmTitle}</Table.Td>
                                <Table.Td>{new Date(rental.rentalDate).toLocaleDateString()}</Table.Td>
                                <Table.Td>
                                    {rental.returnDate 
                                        ? new Date(rental.returnDate).toLocaleDateString()
                                        : <Badge color="yellow">Not Returned</Badge>
                                    }
                                </Table.Td>
                                <Table.Td>${rental.paymentAmount}</Table.Td>
                                <Table.Td>
                                    {!rental.returnDate && (
                                        <Button 
                                            size="xs"
                                            onClick={() => handleReturnRental(rental.rentalId)}
                                        >
                                            Return
                                        </Button>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Tabs.Panel>
        </Tabs>
    );

    return (
        <Box className="page-container" p="xl">
            <Container size="xl">
                <Title order={1} mb="xl" className="page-title">
                    <IconUsers size={32} style={{ marginRight: '12px' }} />
                    Customer Management
                </Title>

                <Card className="search-card" mb="xl">
                    <Group align="flex-end">
                        <TextInput
                            icon={<IconSearch size={16} />}
                            placeholder="Search customers"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="search-input"
                            label="Search customers"
                        />
                        <Select
                            label="Search by"
                            value={searchType}
                            onChange={setSearchType}
                            data={[
                                { label: 'ID', value: 'id' },
                                { label: 'First Name', value: 'firstName' },
                                { label: 'Last Name', value: 'lastName' }
                            ]}
                            className="search-input"
                        />
                        <Button
                            variant="gradient"
                            gradient={{ from: '#ffd700', to: '#ff8c00' }}
                            onClick={() => {
                                setSelectedCustomer(null);
                                setFormData({
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    address: '',
                                    district: '',
                                    city: '',
                                    country: '',
                                    phone: '',
                                    postalCode: '',
                                    storeId: 1,
                                    active: true
                                });
                                setEditMode(true);
                                setOpened(true);
                            }}
                            leftIcon={<IconPlus size={16} />}
                        >
                            Add New Customer
                        </Button>
                    </Group>
                </Card>

                <Card className="table-card">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>First Name</Table.Th>
                                <Table.Th>Last Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {customers.slice(paginationStart, paginationEnd).map((customer) => (
                                <Table.Tr key={customer.id}>
                                    <Table.Td>{customer.id}</Table.Td>
                                    <Table.Td>{customer.firstName}</Table.Td>
                                    <Table.Td>{customer.lastName}</Table.Td>
                                    <Table.Td>{customer.email}</Table.Td>
                                    <Table.Td>{customer.phone}</Table.Td>
                                    <Table.Td>
                                        <Badge 
                                            color={customer.active ? 'green' : 'red'}
                                            variant="light"
                                        >
                                            {customer.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() => openCustomer(customer.id)}
                                            >
                                                <IconEye size="1.125rem" />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="yellow"
                                                onClick={() => {
                                                    openCustomer(customer.id).then(() => handleEdit());
                                                }}
                                            >
                                                <IconEdit size="1.125rem" />
                                            </ActionIcon>
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => handleDelete(customer.id)}
                                            >
                                                <IconTrash size="1.125rem" />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    <Group justify="center" mt="xl" className="pagination-buttons">
                        <Button 
                            variant="light"
                            disabled={paginationStart === 0} 
                            onClick={handlePrev}
                        >
                            Previous
                        </Button>
                        <Text c="dimmed">
                            Showing {paginationStart + 1}-{Math.min(paginationEnd, customers.length)} of {customers.length} customers
                        </Text>
                        <Button 
                            variant="light"
                            disabled={paginationEnd >= customers.length} 
                            onClick={handleNext}
                        >
                            Next
                        </Button>
                    </Group>
                </Card>

                <Modal
                    opened={opened}
                    onClose={() => {
                        setOpened(false);
                        setEditMode(false);
                    }}
                    title={editMode 
                        ? (selectedCustomer ? 'Edit Customer' : 'Add New Customer')
                        : 'Customer Details'
                    }
                    size="lg"
                    className="customer-modal"
                    styles={{
                        title: { color: '#ffd700', fontSize: '1.5rem' },
                        body: { background: '#1a237e', color: 'white' }
                    }}
                >
                    {editMode ? (
                        <>
                            {renderCustomerForm()}
                            <Group justify="flex-end" mt="lg">
                                <Button 
                                    variant="subtle" 
                                    color="gray"
                                    onClick={() => {
                                        setEditMode(false);
                                        if (!selectedCustomer) setOpened(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="gradient"
                                    gradient={{ from: '#ffd700', to: '#ff8c00' }}
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </Group>
                        </>
                    ) : (
                        renderCustomerDetails()
                    )}
                </Modal>
            </Container>
        </Box>
    );
}
